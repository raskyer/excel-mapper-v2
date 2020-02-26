import CellMap from 'src/entities/CellMap';
import Logger from 'src/entities/Logger';

export function validate(
  idCell: number | undefined,
  markCell: number | undefined,
  map: CellMap,
  logger: Logger,
  row: any[]
) {
  const id = validateCell(idCell, logger, row);
  const item = validateItem(id, map, logger);
  const mark = validateMark(markCell, item, logger);

  return { id, mark };
}

export function validateDateRow(
  typeCell: number | undefined,
  loadingDateCell: number | undefined,
  shippingDateCell: number | undefined,
  logger: Logger,
  row: any[]
): Date | undefined {
  const type = validateType(typeCell, logger, row);
  const date = validateDate(type, loadingDateCell, shippingDateCell, logger, row);

  return date;
}

function validateCell(cell: number | undefined, log: Logger, row: any[]): any {
  if (cell === undefined || row.length <= cell || row[cell] === undefined) {
    log('Unable to find cell :', cell, 'in row :' , row);
    return undefined;
  }
  return row[cell];
}

function validateItem(id: any, map: CellMap, log: Logger): any[] | undefined {
  if (id === undefined || id === null || id === '') {
    log('id is empty', id);
    return undefined;
  }

  if (typeof id !== 'string' && typeof id !== 'number') {
    log('id is of invalid type', typeof id);
    return undefined;
  }

  if (typeof id === 'string') {
    id = id.trim().toLowerCase();
  }

  const object = map.get(id);
  if (object === undefined) {
    log('unknown id in map', id, map);
    return undefined;
  }

  return object;
}

function validateMark(
  cell: number | undefined,
  item: any[] | undefined,
  log: Logger
): string | number | undefined {
  if (cell === undefined) {
    log('undefined mark cell', cell, item);
    return undefined;
  }

  if (item === undefined) {
    log('undefined item', item);
    return undefined;
  }

  if (typeof item[cell] !== 'number' && typeof item[cell] !== 'string') {
    log('mark is of invalid type', typeof item[cell]);
    return undefined;
  }

  return item[cell];
}

function validateType(
  typeCell: number | undefined,
  logger: Logger,
  row: any[]
): string | undefined {
  const type = validateCell(typeCell, logger, row);
  if (typeof type !== 'string') {
    logger('type is not a string', typeof type);
    return undefined;
  }

  const trimType = type.trim().toLowerCase();
  if (trimType !== 'chargement' && trimType !== 'livraison') {
    logger('type is not one of "chargement" or "livraison"', trimType);
    return undefined;
  }

  return trimType;
}

function validateDate(
  type: string | undefined,
  loadingDateCell: number | undefined,
  shippingDateCell: number | undefined,
  logger: Logger,
  row: any[]
): Date | undefined {
  let date = undefined;

  if (type === 'chargement' && loadingDateCell) {
    date = row[loadingDateCell];
  }

  if (type === 'livraison' && shippingDateCell) {
    date = row[shippingDateCell];
  }

  if (date === undefined || typeof date !== 'object' || !(date instanceof Date)) {
    logger('date undefined or invalid', date);
    return undefined;
  }

  return date;
}
