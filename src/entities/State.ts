interface State {
  sheetsNames: string[];
  orderSheetsNames: string[];

  customerSheetName?: string;
  providerSheetName?: string;
  orderSheetName?: string;

  customerSheet: null;
  providerSheet: null;

  customerCells: string[];
  providerCells: string[];
  orderCells: string[];

  customerIDCell?: number;
  providerIDCell?: number;
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
}

export default State;
