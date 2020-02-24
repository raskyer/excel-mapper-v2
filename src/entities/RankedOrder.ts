interface RankedInfo {
  id: string | number;
  mark?: string | number;
  ranking: number;
}

interface DateInfo {
  date?: Date;
  ranking: number;
}

interface RankedOrder {
  order: any[];
  projection?: any[];
  customer: RankedInfo;
  provider: RankedInfo;
  date: DateInfo;
  ranking: number;
}

export default RankedOrder;
