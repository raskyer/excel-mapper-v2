import WorkBookAdaptor from './WorkbookAdaptor';

interface FinalState {
  dbWorkbook: WorkBookAdaptor;
  orderWorkbook: WorkBookAdaptor;

  customerSheetName: string;
  providerSheetName: string;
  orderSheetName: string;

  customerIDCell: number;
  providerIDCell: number;
  orderCustomerIDCell: number;
  orderProviderIDCell: number;
  customerMarkCell: number;
  providerMarkCell: number;

  orderTypeCell: number;
  orderLoadingDateCell: number;
  orderShippingDateCell: number;

  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;

  projection: string[];
}

export default FinalState;
