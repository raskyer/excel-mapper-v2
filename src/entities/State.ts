import XLSX from 'xlsx';
import RankedOrder from './RankedOrder';

interface State {
  dbWorkbook?: XLSX.WorkBook;
  orderWorkbook?: XLSX.WorkBook;

  customerSheetName?: string;
  providerSheetName?: string;
  orderSheetName?: string;

  customerIDCell?: number;
  providerIDCell?: number;
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  customerMarkCell?: number;
  providerMarkCell?: number;

  orderTypeCell?: number;
  orderShippingDateCell?: number;
  orderDeliveryDateCell?: number;

  customerMarkRate: number; // TODO : Fetch from Locator
  providerMarkRate: number;
  dateMarkRate: number;

  activeKeys: Set<string>;
  projection: Set<string>;

  headers?: string[]; // TODO : ADD in Locator
  results?: RankedOrder[];
}

export default State;
