import CellMap from 'src/entities/CellMap';
import RankedOrder from "src/entities/RankedOrder";
import Projection from "src/entities/Projection";

export function createMap(sheet: any[][], idCell: number): CellMap {
  const map = new Map();
  for (let i = 1; i < sheet.length; i++) {
    let id = sheet[i][idCell];
    if (typeof id === 'string') {
      id = id.trim().toLowerCase();
    }
    if (id === undefined) {
      console.warn('CREATE MAP : try to create map with undefined key', i, idCell, sheet);
      continue;
    }
    map.set(id, sheet[i]);
  }
  return map;
}

export function difference(orderMap: CellMap, itemMap: CellMap): { present: any[][],  missing: any[][] } {
  const present: any[][] = [];
  const missing: any[][] = [];

  for (const [key, value] of orderMap.entries()) {
    if (!itemMap.has(key)) {
      missing.push(value);
    } else {
      present.push(value);
    }
  }

  return { present, missing };
}

export function diffPercentage(size: number, missingSize: number): number {
  const percentage = Math.round(((size - missingSize) / size) * 100);
  if (isNaN(percentage)) {
    return 0;
  }
  return percentage;
}

export function formatValue(value: any): any {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value instanceof Date) {
    return formatDate(value);
  }
  if (typeof value === 'object') {
    return value;
  }
  return value;
}

export function formatDate(date?: Date): string {
  if (date === undefined) {
    return '';
  }
  return date.toLocaleDateString(
    'fr-FR',
    { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', timeZone: 'UTC' }
  );
}

export function project(rankedOrders: RankedOrder[], projections: Projection[]): RankedOrder[] {
  const projectionIndexes = projections.map(projection => projection.index);

  return rankedOrders.map(rankedOrder => {
    const order = rankedOrder.order;

    const projectedOrder = projectionIndexes.map(index => {
      if (index === -1) {
        // this projection is a new cell
        return '';
      }
      return formatValue(order[index]);
    });

    return {
      ...rankedOrder,
      projection: projectedOrder
    };
  });
}
