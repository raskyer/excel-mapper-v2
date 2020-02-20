interface RankedOrder {
  order: any[];
  customerID: string | number;
  customerMark: string;
  customerRanking: number;
  providerID: string | number;
  providerMark: number;
  providerRanking: number;
  dateRanking: number;
  ranking: number;
}

export default RankedOrder;
