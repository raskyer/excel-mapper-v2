import XLSX from "xlsx";

interface State {
  dbWorkbook?: XLSX.WorkBook;

  sheetsNames: string[];
  orderSheetsNames: string[];

  customerSheetName?: string;
  providerSheetName?: string;
  orderSheetName?: string;

  customerSheet?: any[];
  providerSheet?: any[];

  customerCells: string[];
  providerCells: string[];
  orderCells: string[];

  customerIDCell?: number;
  providerIDCell?: number;
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  customerRatingCell?: number;
  providerRatingCell?: number;
}

export default State;
