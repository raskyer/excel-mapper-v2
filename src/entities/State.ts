import XLSX from "xlsx";

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
  customerRatingCell?: number;
  providerRatingCell?: number;

  orderTypeCell?: number;
  orderShippingDateCell?: number;
  orderDeliveryDateCell?: number;
}

export default State;
