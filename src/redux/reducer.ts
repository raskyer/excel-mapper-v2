import State from "../entities/State";
import { parseFile, parseSheet } from "../utils/excel";
import Locator from '../utils/locator';

const INITIAL_STATE: State = {};

interface Action {
  type: string;
  payload: Partial<State>;
}

type Dispatcher = (a: Action) => void;

const INIT_DB = 'init_db';

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
        type: INIT_DB,
        payload: {
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
    type: INIT_DB,
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
    type: INIT_DB,
    payload: {
      customerIDCell
    }
  });
};

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case INIT_DB:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
};

export default AppReducer;
