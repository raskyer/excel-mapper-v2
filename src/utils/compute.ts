import CellMap from '../entities/CellMap'
import FinalState from '../entities/FinalState';
import RankedOrder from '../entities/RankedOrder';

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

      const dateRanking = this.getDateRanking(order);
      
      orders.push({
        order,
        customerID,
        customerMark,
        customerRanking,
        providerID,
        providerMark,
        providerRanking,
        dateRanking,
        ranking: customerRanking + providerRanking + dateRanking
      });
    }

    return orders;
  }

  private createProjection(orders: RankedOrder[], orderHeaders: string[], projection: string[]): RankedOrder[] {
    const newHeaders = projection.map(header => ({
      index: orderHeaders.indexOf(header),
      name: header
    }));
  
    const mapped = orders.map(rankedOrder => {
      const order = rankedOrder.order;

      const projectedOrder = newHeaders
        .map(({ index }) => index !== -1 ? order[index] : '')
        .map(value => {
          if (value === undefined || value === null) {
            return '';
          }
          if (typeof value === 'object') {
            return value.toString();
          }
          return value;
        });

      return {
        ...rankedOrder,
        order: projectedOrder
      };
    });
  
    // insert headers at first line
    // mapped.unshift(newHeaders.map(({ name }) => name));

    return mapped;
  }

  private sortOrders(orders: RankedOrder[]): RankedOrder[] {
    return orders.sort((a, b) => {
      if (a.order[this.$.orderTypeCell] !== b.order[this.$.orderTypeCell]) {
        return a.order[this.$.orderTypeCell].localeCompare(b.order[this.$.orderTypeCell]);
      }
      return b.ranking - a.ranking
    });
  }

  private getCustomerMark(customerKey: string | number): string {
    if (this.isValid(customerKey, this.customerMap, this.$.customerMarkCell)) {
      return 'unknown';
    }
    const customer = this.customerMap.get(customerKey);
    if (customer === undefined) {
      return 'unknow';
    }
    return customer[this.$.customerMarkCell];
  }

  private computeCustomerRank(customerMark: string, customerRate: number): number {
    const mark = customerMark.toLowerCase().trim();
    
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

  private getProviderMark(providerKey: string | number): number {
    if (!this.isValid(providerKey, this.providerMap, this.$.providerMarkCell)) {
      return 6;
    }
    const provider = this.providerMap.get(providerKey);
    if (provider === undefined) {
      return 6;
    }
    return provider[this.$.providerMarkCell];
  }
  
  private computeProviderRank(providerMark: number, providerRate: number): number {
    const mark = 6 - providerMark;
    return mark * providerRate;
  }
  
  private getDateRanking(o: any[]): number {
    const type = o[this.$.orderTypeCell];
  
    if (type === undefined || type === null || type === '') {
      this.errors.push('CHECK : type is empty ' + this.$.orderTypeCell);
      return 0;
    }
  
    if (typeof type !== 'string') {
      this.errors.push('CHECK : type is not a string ' + typeof type);
      return 0;
    }
  
    const trimType = type.trim().toLowerCase();
  
    if (trimType !== 'chargement' && trimType !== 'livraison') {
      this.errors.push('CHECK : type is not one of "chargement" or "livraison" ' + trimType);
      return 0;
    }
  
    const date = trimType === 'chargement' ?
      o[this.$.orderLoadingDateCell] : o[this.$.orderShippingDateCell];
  
    if (date === undefined || typeof date !== 'object') {
      this.errors.push('CHECK : date undefined or invalid ' + date);
      return 0;
    }
  
    return this.computeDateRank(date.getHours(), this.$.dateMarkRate);
  }

  private computeDateRank(dateHours: number, dateRate: number) {
    const rate = 24 - dateHours;
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
  
    if (typeof key === 'string') {
      key = key.trim().toLowerCase();
    }
  
    const object = map.get(key);
  
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
}

export default Compute;
