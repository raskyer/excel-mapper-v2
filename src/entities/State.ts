import WorkBookAdaptor from './WorkbookAdaptor';
import RankedOrder from './RankedOrder';
import Projection from './Projection';

interface State extends StateWorkbook, StateSheet, StateCell, StateRate, StateUI {}

export interface StateWorkbook {
  dbWorkbook?: WorkBookAdaptor;
  orderWorkbook?: WorkBookAdaptor;
}

export interface StateSheet {
  customerSheetName?: string;
  providerSheetName?: string;
  orderSheetName?: string;
}

export interface StateCell {
  customerIDCell?: number;
  providerIDCell?: number;
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  customerMarkCell?: number;
  providerMarkCell?: number;
  orderTypeCell?: number;
  orderLoadingDateCell?: number;
  orderShippingDateCell?: number;
}

export interface StateRate {
  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;
}

export interface StateUI {
  activeKeys: Set<string>;
  projections: Projection[];
  rankedOrders?: RankedOrder[];
}

export default State;
