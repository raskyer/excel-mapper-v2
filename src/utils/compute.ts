import FinalState from "../entities/FinalState";

type CellMap = Map<string | number, any[]>;

class Compute {
  constructor(private customerMap: CellMap, private providerMap: CellMap, private $: FinalState) {}

  compute(orderSheet: any[][]) {
    const orders = this.computeRanking(orderSheet);
    return this.sortOrders(orders);
  }

  private computeRanking(orderSheet: any[][]) {
    const orders = [];
    for (let i = 1; i < orderSheet.length; i++) {
      const order = orderSheet[i];
      const customerRanking = this.getCustomerRanking(order[this.$.orderCustomerIDCell]);
      const providerRanking = this.getProviderRanking(order[this.$.orderProviderIDCell]);
      const dateRanking     = this.getDateRanking(order);
      
      orders.push({
        order,
        customerRanking,
        providerRanking,
        dateRanking,
        ranking: customerRanking + providerRanking + dateRanking
      });
    }
    return orders;
  }

  private sortOrders(orders: {order: any[], ranking: number}[]) {
    return orders.sort((a, b) => {
      if (a.order[this.$.orderTypeCell] !== b.order[this.$.orderTypeCell]) {
        return a.order[this.$.orderTypeCell].localeCompare(b.order[this.$.orderTypeCell]);
      }
      return b.ranking - a.ranking
    });
  }

  private getCustomerRanking(customerKey: string | number): number {
    if (this.isValid(customerKey, this.customerMap, this.$.customerMarkCell)) {
      return 0;
    }
    const customer = this.customerMap.get(customerKey);
    if (customer === undefined) {
      return 0;
    }
    const mark = customer[this.$.customerMarkCell];
    return this.computeCustomerRank(mark, this.$.customerMarkRate);
  }

  private computeCustomerRank(customerMark: string, customerRate: number): number {
    const mark = customerMark.toLowerCase().trim();
    
    switch (mark) {
      case 'sensible':
        return 5 * customerRate;
      default:
        return 1 * customerRate;
    }
  }
  
  private getProviderRanking(providerKey: string | number): number {
    if (!this.isValid(providerKey, this.providerMap, this.$.providerMarkCell)) {
      return 0;
    }
    const provider = this.providerMap.get(providerKey);
    if (provider === undefined) {
      return 0;
    }
    const mark = provider[this.$.providerMarkCell];
    return this.computeProviderRank(mark, this.$.providerMarkRate);
  }

  private computeProviderRank(providerMark: number, providerRate: number): number {
    const mark = 6 - providerMark;
    return mark * providerRate;
  }
  
  private getDateRanking(o: any[]): number {
    const type = o[this.$.orderTypeCell];
  
    if (type === undefined || type === null || type === '') {
      console.error('CHECK : type is empty', this.$.orderTypeCell);
      return 0;
    }
  
    if (typeof type !== 'string') {
      console.error('CHECK : type is not a string', typeof type);
      return 0;
    }
  
    const trimType = type.trim().toLowerCase();
  
    if (trimType !== 'chargement' && trimType !== 'livraison') {
      console.error('CHECK : type is not one of "chargement" or "livraison"', trimType);
      return 0;
    }
  
    const date = trimType === 'chargement' ?
      o[this.$.orderShippingDateCell] : o[this.$.orderDeliveryDateCell];
  
    if (date === undefined || typeof date !== 'object') {
      console.log('CHECK : date undefined or invalid', date);
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
      console.error('CHECK : key is empty', key);
      return false;
    }
  
    if (typeof key !== 'string' && typeof key !== 'number') {
      console.error('CHECK : key is of invalid type', typeof key);
      return false;
    }
  
    if (typeof key === 'string') {
      key = key.trim().toLowerCase();
    }
  
    const object = map.get(key);
  
    if (object === undefined) {
      console.warn('CHECK : unknown key in map', key, map);
      return false;
    }

    if (markCell === undefined) {
      console.error('CHECK : undefined mark cell');
      return false;
    }
  
    if (typeof object[markCell] !== 'number' && typeof object[markCell] !== 'string') {
      console.warn('CHECK : mark is of invalid type', typeof object[markCell]);
      return false;
    }

    return false;
  }
}

function createProjection(orders: any[], headers: string[], projection: any) {
  const newHeaders = Object
    .keys(projection)
    .map(key => ({
      index: headers.indexOf(key),
      name: projection[key]
    }));

  const mapped = orders
    .map(({ order }) => 
      newHeaders
        .map(({ index }) => index !== -1 ? order[index] : '')
        .map(value => value !== undefined && value !== null ? value : '')
    );

  // insert headers at first line
  mapped.unshift(newHeaders.map(({ name }) => name));

  return mapped;
}

export default Compute;
