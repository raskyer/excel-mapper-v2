import CellMap from 'src/entities/CellMap'
import State from 'src/entities/State';
import RankedOrder from 'src/entities/RankedOrder';

import { formatValue } from 'src/utils/core';

class Compute {
  private readonly errors: string[] = [];

  constructor(
    private readonly customerMap: CellMap,
    private readonly providerMap: CellMap,
    private readonly $: State
  ) {}

  compute(orderSheet: any[][]): RankedOrder[] {
    console.log(orderSheet);
    if (orderSheet === undefined || orderSheet.length === 0) {
      return [];
    }

    const orders = this.computeRanking(orderSheet);
    const sorted = this.sortOrders(orders);

    return this.createProjection(sorted, orderSheet[0], this.$.projection);
  }

  getErrors(): string[] {
    return this.errors;
  }

  private computeRanking(orderSheet: any[][]): RankedOrder[] {
    const orders: RankedOrder[] = [];
    const { orderCustomerIDCell, orderProviderIDCell } = this.$;

    for (let i = 1; i < orderSheet.length; i++) {
      const order = orderSheet[i];

      const customerID = orderCustomerIDCell !== undefined ? order[orderCustomerIDCell] : undefined;
      const customerMark = this.getCustomerMark(customerID);
      const customerRanking = this.computeCustomerRank(customerMark, this.$.customerMarkRate);

      const providerID = orderProviderIDCell ? order[orderProviderIDCell] : undefined;
      const providerMark = this.getProviderMark(providerID);
      const providerRanking = this.computeProviderRank(providerMark, this.$.providerMarkRate);

      const date = this.getDate(order);
      const dateRanking = this.computeDateRank(date, this.$.dateMarkRate);

      orders.push({
        order,
        customer: {
          id: customerID,
          mark: customerMark,
          ranking: customerRanking
        },
        provider: {
          id: providerID,
          mark: providerMark,
          ranking: providerRanking
        },
        date: {
          date,
          ranking: dateRanking
        },
        ranking: customerRanking + providerRanking + dateRanking
      });
    }

    return orders;
  }

  private createProjection(rankedOrders: RankedOrder[], orderHeaders: string[], projection: string[]): RankedOrder[] {
    const projectionIndexes = projection.map(projection => orderHeaders.indexOf(projection));
  
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

  private sortOrders(orders: RankedOrder[]): RankedOrder[] {
    const { orderTypeCell } = this.$;

    return orders.sort((a, b) => {
      if (orderTypeCell !== undefined && a.order[orderTypeCell] !== b.order[orderTypeCell]) {
        return a.order[orderTypeCell].localeCompare(b.order[orderTypeCell]);
      }
      return b.ranking - a.ranking
    });
  }

  private getCustomerMark(customerKey: string | number): string | undefined {
    const { customerMarkCell } = this.$;
    if (customerMarkCell === undefined) {
      return undefined;
    }
    if (this.isValid(customerKey, this.customerMap, customerMarkCell)) {
      return undefined;
    }
    const customer = this.getInMap(customerKey, this.customerMap);
    return customer ? customer[customerMarkCell] : undefined;
  }

  private computeCustomerRank(customerMark: string | undefined, customerRate: number): number {
    const mark = customerMark ? customerMark.toLowerCase().trim() : undefined;
    
    switch (mark) {
      case 'sensible':
        return 5 * customerRate;
      case 'rdv':
        return 4 * customerRate;
      case 'flexible/fragile':
        return 3 * customerRate;
      case 'ponctuel':
        return 2 * customerRate;
      default:
        return 0 * customerRate;
    }
  }

  private getProviderMark(providerKey: string | number): number | undefined {
    const { providerMarkCell } = this.$;
    if (providerMarkCell === undefined) {
      return undefined;
    }
    if (!this.isValid(providerKey, this.providerMap, providerMarkCell)) {
      return undefined;
    }
    const provider = this.getInMap(providerKey, this.providerMap);
    return provider ? provider[providerMarkCell] : undefined;
  }
  
  private computeProviderRank(providerMark: number | undefined, providerRate: number): number {
    const mark = 6 - (providerMark ? providerMark : 6);
    return mark * providerRate;
  }
  
  private getDate(o: any[]): Date | undefined {
    const { orderTypeCell, orderLoadingDateCell, orderShippingDateCell } = this.$;
    if (orderTypeCell === undefined) {
      return undefined;
    }

    const type = o[orderTypeCell]; 
    if (type === undefined || type === null || type === '') {
      this.errors.push('CHECK : type is empty ' + this.$.orderTypeCell);
      return undefined;
    }
  
    if (typeof type !== 'string') {
      this.errors.push('CHECK : type is not a string ' + typeof type);
      return undefined;
    }
  
    const trimType = type.trim().toLowerCase();
  
    if (trimType !== 'chargement' && trimType !== 'livraison') {
      this.errors.push('CHECK : type is not one of "chargement" or "livraison" ' + trimType);
      return undefined;
    }

    if (trimType === 'chargement' && orderLoadingDateCell !== undefined) {
      const date = o[orderLoadingDateCell];
      if (date === undefined || typeof date !== 'object' || !(date instanceof Date)) {
        this.errors.push('CHECK : date undefined or invalid ' + date);
        return undefined;
      }
      return date;
    }

    if (trimType === 'livraison' && orderShippingDateCell !== undefined) {
      const date = o[orderShippingDateCell];
      if (date === undefined || typeof date !== 'object' || !(date instanceof Date)) {
        this.errors.push('CHECK : date undefined or invalid ' + date);
        return undefined;
      }
      return date;
    }

    return undefined;
  }

  private computeDateRank(date: Date | undefined, dateRate: number) {
    const rate = 24 - (date ? date.getUTCHours() : 24);
    const mark = (rate / 24) * 5
    return mark * dateRate;
  }

  private isValid(key: string | number | undefined, map: CellMap, markCell: number): boolean {
    if (key === undefined || key === null || key === '') {
      this.errors.push('CHECK : key is empty ' + key);
      return false;
    }
  
    if (typeof key !== 'string' && typeof key !== 'number') {
      this.errors.push('CHECK : key is of invalid type ' + typeof key);
      return false;
    }
  
    const object = this.getInMap(key, map);
  
    if (object === undefined) {
      this.errors.push('CHECK : unknown key in map ' + key + ' ' + map);
      return false;
    }

    if (markCell === undefined) {
      this.errors.push('CHECK : undefined mark cell');
      return false;
    }
  
    if (typeof object[markCell] !== 'number' && typeof object[markCell] !== 'string') {
      this.errors.push('CHECK : mark is of invalid type ' + typeof object[markCell]);
      return false;
    }

    return false;
  }

  private getInMap(key: string | number, map: CellMap): any[] | undefined {
    if (typeof key === 'string') {
      key = key.trim().toLowerCase();
    }
    return map.get(key);
  }
}

export default Compute;
