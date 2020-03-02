import RankedOrder, { RankedOrderInfo, RankedOrderDate } from 'src/entities/RankedOrder';
import CellMap from 'src/entities/CellMap';
import Logger from 'src/entities/Logger';

import { validate, validateDateRow } from './Validator';

class RankedOrderService {
  constructor(
    private readonly customerMap: CellMap,
    private readonly providerMap: CellMap,

    private readonly customerMarkCell: number | undefined,
    private readonly providerMarkCell: number | undefined,

    private readonly orderCustomerIDCell: number | undefined,
    private readonly orderProviderIDCell: number | undefined,
    private readonly orderTypeCell: number | undefined,
    private readonly orderLoadingDateCell: number | undefined,
    private readonly orderShippingDateCell: number | undefined,

    private readonly customerMarkRate: number,
    private readonly providerMarkRate: number,
    private readonly dateMarkRate: number,

    private readonly logger: Logger
  ) {}

  build(orderSheet: any[][]) {
    const orders: RankedOrder[] = [];

    for (let i = 1; i < orderSheet.length; i++) {
      const order = orderSheet[i];

      const customer = this.customerStrategy(order);
      const provider = this.providerStrategy(order);
      const date = this.dateStrategy(order);

      orders.push({
        order,
        customer,
        provider,
        date,
        ranking: customer.ranking + provider.ranking + date.ranking
      });
    }

    return orders.sort(this.sortStrategy.bind(this));
  }

  private customerStrategy(order: any[]): RankedOrderInfo {
    const { id, mark } = validate(
      this.orderCustomerIDCell,
      this.customerMarkCell,
      this.customerMap,
      this.logger,
      order
    );
    const ranking = customerRankingStrategy(mark, this.customerMarkRate);

    return {
      id,
      mark,
      ranking
    };
  }

  private providerStrategy(order: any[]): RankedOrderInfo {
    const { id, mark } = validate(
      this.orderProviderIDCell,
      this.providerMarkCell,
      this.providerMap,
      this.logger,
      order
    );
    const ranking = providerRankingStrategy(mark, this.providerMarkRate);

    return {
      id,
      mark,
      ranking
    };
  }

  private dateStrategy(order: any[]): RankedOrderDate {
    const date = validateDateRow(
      this.orderTypeCell,
      this.orderLoadingDateCell,
      this.orderShippingDateCell,
      this.logger,
      order
    );
    const ranking = dateRankingStrategy(date, this.dateMarkRate);

    return {
      date,
      ranking
    };
  }

  private sortStrategy(a: RankedOrder, b: RankedOrder): number {
    if (
      this.orderTypeCell !== undefined
      && a.order[this.orderTypeCell] !== b.order[this.orderTypeCell]
      && typeof a.order[this.orderTypeCell].localeCompare === 'function'
    ) {
      return a.order[this.orderTypeCell].localeCompare(b.order[this.orderTypeCell]);
    }
    return b.ranking - a.ranking
  }
}

export function computeRankedOrders(
  orderSheet: any[][],
  customerStrategy: (order: any[]) => RankedOrderInfo,
  providerStrategy: (order: any[]) => RankedOrderInfo,
  dateStrategy: (order: any[]) => RankedOrderDate,
  sortStrategy: (a: RankedOrder, b: RankedOrder) => number
): RankedOrder[] {
  const orders: RankedOrder[] = [];

  for (let i = 1; i < orderSheet.length; i++) {
    const order = orderSheet[i];

    const customer = customerStrategy(order);
    const provider = providerStrategy(order);
    const date = dateStrategy(order);

    orders.push({
      order,
      customer,
      provider,
      date,
      ranking: customer.ranking + provider.ranking + date.ranking
    });
  }

  return orders.sort(sortStrategy);
};

const customerRankingStrategy = (rawMark: string | number | undefined, rate: number): number => {
  if (typeof rawMark === 'number') {
    return 0;
  }

  const mark = rawMark !== undefined ? rawMark.toLowerCase().trim() : undefined;

  switch (mark) {
    case 'sensible':
      return 5 * rate;
    case 'rdv':
      return 4 * rate;
    case 'flexible/fragile':
      return 3 * rate;
    case 'ponctuel':
      return 2 * rate;
    default:
      return 0;
  }
};

const providerRankingStrategy = (rawMark: string | number | undefined, rate: number): number => {
  if (typeof rawMark === 'string') {
    return 0;
  }

  const mark = 6 - (rawMark !== undefined ? rawMark : 6);
  return mark * rate;
};

const dateRankingStrategy = (date: Date | undefined, rate: number): number => {
  const raw = 24 - (date ? date.getUTCHours() : 24);
  const mark = (raw / 24) * 5
  return mark * rate;
};

export default RankedOrderService;
