export interface RankedOrderInfo {
  id: string | number | undefined;
  mark: string | number | undefined;
  ranking: number;
}

export interface RankedOrderDate {
  date?: Date;
  ranking: number;
}

interface RankedOrder {
  order: any[];
  projection?: any[];
  customer: RankedOrderInfo;
  provider: RankedOrderInfo;
  date: RankedOrderDate;
  ranking: number;
}

export default RankedOrder;
