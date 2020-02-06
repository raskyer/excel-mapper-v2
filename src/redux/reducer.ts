import State from "../entities/State";
import { parseFile, parseSheet } from "../utils/excel";
import Locator from '../utils/locator';

const INITIAL_STATE: State = {};

interface Action {
  type: string;
  payload: Partial<State>;
}

type Dispatcher = (a: Action) => void;

const MERGE = 'merge';

export const dbFileChangedAction = (dbFile: File) => (dispatch: Dispatcher) => {
  parseFile(dbFile)
    .then(workbook => {
      const sheetsNames = workbook.SheetNames;
      const customerSheetName = Locator.findSheet(sheetsNames, Locator.CUSTOMER_SHEET);
      const providerSheetName = Locator.findSheet(sheetsNames, Locator.PROVIDER_SHEET);
      
      const customerSheet = customerSheetName ? parseSheet(workbook.Sheets[customerSheetName]) : undefined;
      const providerSheet = providerSheetName ? parseSheet(workbook.Sheets[providerSheetName]) : undefined;

      const customerCells: string[] = customerSheet ? customerSheet[0] : [];
      const providerCells: string[] = providerSheet ? providerSheet[0] : [];

      const customerIDCell = Locator.findCell(customerCells, Locator.CUSTOMER_ID);
      const providerIDCell = Locator.findCell(providerCells, Locator.PROVIDER_ID);
      const customerRatingCell = Locator.findCell(customerCells, Locator.CUSTOMER_RATING);
      const providerRatingCell = Locator.findCell(providerCells, Locator.PROVIDER_RATING);

      dispatch({
        type: MERGE,
        payload: {
          dbWorkbook: workbook,
          customerSheetName,
          providerSheetName,
          customerIDCell,
          providerIDCell,
          customerRatingCell,
          providerRatingCell
        }
      });
    });
};

export const orderFileChangedAction = (orderFile: File) => (dispatch: Dispatcher) => {
  parseFile(orderFile)
    .then(workbook => {
      const sheetsNames = workbook.SheetNames;
      const orderSheetName = Locator.findSheet(sheetsNames, Locator.ORDER_SHEET);

      const orderSheet = orderSheetName ? parseSheet(workbook.Sheets[orderSheetName]) : undefined;
      const orderCells = orderSheet ? orderSheet[0] : [];
      const orderCustomerIDCell = Locator.findCell(orderCells, Locator.ORDER_CUSTOMER_ID);
      const orderProviderIDCell = Locator.findCell(orderCells, Locator.ORDER_PROVIDER_ID);

      dispatch({
        type: MERGE,
        payload: {
          orderWorkbook: workbook,
          orderSheetName,
          orderCustomerIDCell,
          orderProviderIDCell
        }
      });
    });
};

export const customerSheetChangedAction = (customerSheetName: string) => (dispatch: Dispatcher, state: State): void => {
  if (!state.dbWorkbook) {
    return;
  }

  const customerSheet = customerSheetName ? parseSheet(state.dbWorkbook.Sheets[customerSheetName]) : undefined;
  const customerCells: string[] = customerSheet ? customerSheet[0] : [];

  const customerIDCell = Locator.findCell(customerCells, Locator.CUSTOMER_ID);
  const customerRatingCell = Locator.findCell(customerCells, Locator.CUSTOMER_RATING);

  dispatch({
    type: MERGE,
    payload: {
      customerSheetName,
      customerIDCell,
      customerRatingCell
    }
  })
};

export const customerIDCellChangedAction = (customerIDCellStr: string) => (dispatch: Dispatcher): void => {
  const customerIDCell = parseInt(customerIDCellStr, 10);
  dispatch({
    type: MERGE,
    payload: {
      customerIDCell
    }
  });
};

export const orderCustomerIDCellChangedAction = (orderCustomerIDCellStr: string) => (dispatch: Dispatcher): void => {
  const orderCustomerIDCell = parseInt(orderCustomerIDCellStr, 10);
  dispatch({
    type: MERGE,
    payload: {
      orderCustomerIDCell
    }
  });
};

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case MERGE:
      console.log(action.payload);
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
};

export default AppReducer;
