import State from '../entities/State';
import { parseFile, parseSheet } from '../utils/excel';
import Locator from '../utils/locator';
import { getCustomerMap, getProviderMap, getOrderSheet } from './selector';
import Compute from '../utils/compute';
import { fromState } from '../utils/core';

const INITIAL_STATE: State = {
  customerMarkRate: 1,
  providerMarkRate: 1,
  dateMarkRate: 1
};

interface Action {
  type: string;
  payload: Partial<State>;
}

type Dispatcher = (a: Action) => void;
type Getter = () => State;

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
      const customerMarkCell = Locator.findCell(customerCells, Locator.CUSTOMER_MARK);
      const providerMarkCell = Locator.findCell(providerCells, Locator.PROVIDER_MARK);

      dispatch({
        type: MERGE,
        payload: {
          dbWorkbook: workbook,
          customerSheetName,
          providerSheetName,
          customerIDCell,
          providerIDCell,
          customerMarkCell,
          providerMarkCell
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
      const orderTypeCell = Locator.findCell(orderCells, Locator.ORDER_TYPE);
      const orderShippingDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_SHIPPING);
      const orderDeliveryDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_DELIVERY);

      dispatch({
        type: MERGE,
        payload: {
          orderWorkbook: workbook,
          orderSheetName,
          orderCustomerIDCell,
          orderProviderIDCell,
          orderTypeCell,
          orderShippingDateCell,
          orderDeliveryDateCell
        }
      });
    });
};

export const customerSheetChangedAction = (customerSheetName: string) => (dispatch: Dispatcher, getState: Getter): void => {
  const { dbWorkbook } = getState();

  if (!dbWorkbook) {
    return;
  }

  const customerSheet = customerSheetName ? parseSheet(dbWorkbook.Sheets[customerSheetName]) : undefined;
  const customerCells: string[] = customerSheet ? customerSheet[0] : [];

  const customerIDCell = Locator.findCell(customerCells, Locator.CUSTOMER_ID);
  const customerMarkCell = Locator.findCell(customerCells, Locator.CUSTOMER_MARK);

  dispatch({
    type: MERGE,
    payload: {
      customerSheetName,
      customerIDCell,
      customerMarkCell
    }
  });
};

export const providerSheetChangedAction = (providerSheetName: string) => (dispatch: Dispatcher, getState: Getter): void => {
  const { dbWorkbook } = getState();

  if (!dbWorkbook) {
    return;
  }

  const providerSheet = providerSheetName ? parseSheet(dbWorkbook.Sheets[providerSheetName]) : undefined;
  const providerCells: string[] = providerSheet ? providerSheet[0] : [];

  const providerIDCell = Locator.findCell(providerCells, Locator.PROVIDER_ID);
  const providerMarkCell = Locator.findCell(providerCells, Locator.PROVIDER_MARK);

  dispatch({
    type: MERGE,
    payload: {
      providerSheetName,
      providerIDCell,
      providerMarkCell
    }
  })
};

export const orderSheetChangedAction = (orderSheetName: string) => (dispatch: Dispatcher, getState: Getter): void => {
  const { orderWorkbook } = getState();

  if (!orderWorkbook) {
    return;
  }

  const orderSheet = orderSheetName ? parseSheet(orderWorkbook.Sheets[orderSheetName]) : undefined;
  const orderCells: string[] = orderSheet ? orderSheet[0] : [];

  const orderCustomerIDCell = Locator.findCell(orderCells, Locator.ORDER_CUSTOMER_ID);
  const orderProviderIDCell = Locator.findCell(orderCells, Locator.ORDER_PROVIDER_ID);
  const orderTypeCell = Locator.findCell(orderCells, Locator.ORDER_TYPE);
  const orderShippingDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_SHIPPING);
  const orderDeliveryDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_DELIVERY);

  dispatch({
    type: MERGE,
    payload: {
      orderSheetName,
      orderCustomerIDCell,
      orderProviderIDCell,
      orderTypeCell,
      orderShippingDateCell,
      orderDeliveryDateCell
    }
  });
};

export const submit = () => (dispatch: Dispatcher, getState: Getter): void => {
  const state = getState();

  const customerMap = getCustomerMap(state);
  const providerMap = getProviderMap(state);
  const orderSheet = getOrderSheet(state);

  const compute = new Compute(customerMap, providerMap, fromState(state));
  const rankedOrder = compute.compute(orderSheet);

  console.log(rankedOrder);
};

export const customerIDCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const customerIDCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      customerIDCell
    }
  });
};

export const orderCustomerIDCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const orderCustomerIDCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      orderCustomerIDCell
    }
  });
};

export const providerIDCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const providerIDCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      providerIDCell
    }
  });
};

export const orderProviderIDCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const orderProviderIDCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      orderProviderIDCell
    }
  });
};

export const customerMarkCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const customerMarkCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      customerMarkCell
    }
  });
};

export const providerMarkCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const providerMarkCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      providerMarkCell
    }
  });
};

export const orderTypeCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const orderTypeCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      orderTypeCell
    }
  });
};

export const orderShippingDateCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const orderShippingDateCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      orderShippingDateCell
    }
  });
};

export const orderDeliveryDateCellChangedAction = (str: string) => (dispatch: Dispatcher): void => {
  const orderDeliveryDateCell = parseInt(str, 10);
  dispatch({
    type: MERGE,
    payload: {
      orderDeliveryDateCell
    }
  });
};

export const keyChangedAction = (key: string, str: string) => (dispatch: Dispatcher): void => {
  let int = parseInt(str, 10);
  if (isNaN(int)) {
    int = 0;
  }
  dispatch({
    type: MERGE,
    payload: {
      [key]: int
    }
  });
};

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case MERGE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
};

export default AppReducer;
