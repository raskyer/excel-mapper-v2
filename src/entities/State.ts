import XLSX from 'xlsx';

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

  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;

  activeKeys: Set<string>;
}

export default State;
