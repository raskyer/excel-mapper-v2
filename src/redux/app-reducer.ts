import State from "../entities/State";
import { parseFile, parseSheet } from "../utils/excel";
import Locator from '../utils/locator';

const INITIAL_STATE: State = {
  sheetsNames: [],
  orderSheetsNames: [],
  customerSheet: null,
  providerSheet: null,
  customerCells: [],
  providerCells: [],
  orderCells: []
};

const INIT_DB = 'init_db';

export const dbFileChangedAction = (dbFile: File) => (dispatch: Function) => {
  parseFile(dbFile)
    .then(workbook => {
      const sheetsNames = workbook.SheetNames;
      const customerSheetName = Locator.findSheet(sheetsNames, Locator.CUSTOMER_SHEET);
      const providerSheetName = Locator.findSheet(sheetsNames, Locator.PROVIDER_SHEET);
      
      const customerSheet = customerSheetName ? parseSheet(workbook.Sheets[customerSheetName]) : null;
      const providerSheet = providerSheetName ? parseSheet(workbook.Sheets[providerSheetName]) : null;

      const customerCells: string[] = customerSheet ? customerSheet[0] : [];
      const providerCells: string[] = providerSheet ? providerSheet[0] : [];

      const customerIDCell = Locator.findCell(customerCells, Locator.CUSTOMER_ID);
      const providerIDCell = Locator.findCell(providerCells, Locator.PROVIDER_ID);
      const customerRatingCell = Locator.findCell(customerCells, Locator.CUSTOMER_RATING);
      const providerRatingCell = Locator.findCell(providerCells, Locator.PROVIDER_RATING);

      dispatch({
        type: INIT_DB,
        payload: {
          sheetsNames,
          customerSheetName,
          providerSheetName,
          customerSheet,
          providerSheet,
          customerCells,
          providerCells,
          customerIDCell,
          providerIDCell,
          customerRatingCell,
          providerRatingCell
        }
      })
    });
};

export const orderFileChangedAction = (orderFile: File) => (dispatch: Function) => {
  parseFile(orderFile)
    .then(workbook => {

    });
};

const AppReducer = (state: State = INITIAL_STATE, action: any): State => {
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
