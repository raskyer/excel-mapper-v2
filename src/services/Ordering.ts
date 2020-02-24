import CellMap from '../entities/CellMap'
import FinalState from '../entities/FinalState';
import RankedOrder from '../entities/RankedOrder';

import { formatValue } from '../utils/core';

class Compute {
  private readonly errors: string[] = [];

  constructor(
    private readonly customerMap: CellMap,
    private readonly providerMap: CellMap,
    private readonly $: FinalState
  ) {}

  compute(orderSheet: any[][]): RankedOrder[] {
    const orders = this.computeRanking(orderSheet);
    const sorted = this.sortOrders(orders);

    return this.createProjection(sorted, orderSheet[0], this.$.projection);
  }

  getErrors(): string[] {
    return this.errors;
  }

  private computeRanking(orderSheet: any[][]): RankedOrder[] {
    const orders: RankedOrder[] = [];

    for (let i = 1; i < orderSheet.length; i++) {
      const order = orderSheet[i];

      const customerID = order[this.$.orderCustomerIDCell];
      const customerMark = this.getCustomerMark(customerID);
      const customerRanking = this.computeCustomerRank(customerMark, this.$.customerMarkRate);

      const providerID = order[this.$.orderProviderIDCell];
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
    return orders.sort((a, b) => {
      if (a.order[this.$.orderTypeCell] !== b.order[this.$.orderTypeCell]) {
        return a.order[this.$.orderTypeCell].localeCompare(b.order[this.$.orderTypeCell]);
      }
      return b.ranking - a.ranking
    });
  }

  private getCustomerMark(customerKey: string | number): string | undefined {
    if (this.isValid(customerKey, this.customerMap, this.$.customerMarkCell)) {
      return undefined;
    }
    const customer = this.getInMap(customerKey, this.customerMap);
    return customer ? customer[this.$.customerMarkCell] : undefined;
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
        return 1 * customerRate;
    }
  }

  private getProviderMark(providerKey: string | number): number | undefined {
    if (!this.isValid(providerKey, this.providerMap, this.$.providerMarkCell)) {
      return undefined;
    }
    const provider = this.getInMap(providerKey, this.providerMap);
    return provider ? provider[this.$.providerMarkCell] : undefined;
  }
  
  private computeProviderRank(providerMark: number | undefined, providerRate: number): number {
    const mark = 6 - (providerMark ? providerMark : 6);
    return mark * providerRate;
  }
  
  private getDate(o: any[]): Date | undefined {
    const type = o[this.$.orderTypeCell];
  
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
  
    const date = trimType === 'chargement' ?
      o[this.$.orderLoadingDateCell] : o[this.$.orderShippingDateCell];
  
    if (date === undefined || typeof date !== 'object' || !(date instanceof Date)) {
      this.errors.push('CHECK : date undefined or invalid ' + date);
      return undefined;
    }

    return date;
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
