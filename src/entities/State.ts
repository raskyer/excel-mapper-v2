import XLSX from 'xlsx';
import RankedOrder from './RankedOrder';

interface State extends StateWorkbook, StateSheet, StateCell, StateRate, StateUI {}

export interface StateWorkbook {
  dbWorkbook?: XLSX.WorkBook;
  orderWorkbook?: XLSX.WorkBook;
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
  projection: string[];
  results?: RankedOrder[];
}

export default State;
