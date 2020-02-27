import Dispatcher from 'src/entities/Dispatcher';
import Action from 'src/entities/Action';
import RankedOrder from 'src/entities/RankedOrder';

import * as C from './constants';

import { DefaultLibraryAdaptor } from 'src/services/LibraryAdaptorFactory'; 

export const dbFileChangeAction = (dbFile: File) => (dispatch: Dispatcher): void => {
  DefaultLibraryAdaptor.parseFile(dbFile).then(workbook => {
    dispatch({
      type: C.DB_FILE_CHANGE,
      payload: workbook
    });
  });
};

export const orderFileChangeAction = (orderFile: File) => (dispatch: Dispatcher): void => {
  DefaultLibraryAdaptor.parseFile(orderFile).then(workbook => {
    dispatch({
      type: C.ORDER_FILE_CHANGE,
      payload: workbook
    });
  });
};

export const customerSheetChangeAction = (customerSheetName?: string): Action => ({
  type: C.CUSTOMER_SHEET_CHANGE,
  payload: customerSheetName
});

export const providerSheetChangeAction = (providerSheetName?: string): Action => ({
  type: C.PROVIDER_SHEET_CHANGE,
  payload: providerSheetName
});

export const orderSheetChangeAction = (orderSheetName?: string): Action => ({
  type: C.ORDER_SHEET_CHANGE,
  payload: orderSheetName
});

export const customerIDCellChangeAction = (customerIDCell?: string): Action => ({
  type: C.CUSTOMER_ID_CELL_CHANGE,
  payload: customerIDCell
});

export const providerIDCellChangeAction = (providerIDCell?: string): Action => ({
  type: C.PROVIDER_ID_CELL_CHANGE,
  payload: providerIDCell
});

export const orderCustomerIDCellChangeAction = (orderCustomerIDCell?: string): Action => ({
  type: C.ORDER_CUSTOMER_ID_CELL_CHANGE,
  payload: orderCustomerIDCell
});

export const orderProviderIDCellChangeAction = (orderProviderIDCell?: string): Action => ({
  type: C.ORDER_PROVIDER_ID_CELL_CHANGE,
  payload: orderProviderIDCell
});

export const orderTypeCellChangeAction = (orderTypeCell?: string): Action => ({
  type: C.ORDER_TYPE_CELL_CHANGE,
  payload: orderTypeCell
});

export const orderLoadingDateCellChangeAction = (orderLoadingDateCell?: string): Action => ({
  type: C.ORDER_LOADING_DATE_CELL_CHANGE,
  payload: orderLoadingDateCell
});

export const orderShippingDateCellChangeAction = (orderShippingDateCell?: string): Action => ({
  type: C.ORDER_SHIPPING_DATE_CELL_CHANGE,
  payload: orderShippingDateCell
});

export const customerMarkCellChangeAction = (customerMarkCell?: string): Action => ({
  type: C.CUSTOMER_MARK_CELL_CHANGE,
  payload: customerMarkCell
});

export const providerMarkCellChangeAction = (providerMarkCell?: string): Action => ({
  type: C.PROVIDER_MARK_CELL_CHANGE,
  payload: providerMarkCell
});

export const customerMarkRateChangeAction = (customerMarkRate: string): Action => ({
  type: C.CUSTOMER_MARK_RATE_CHANGE,
  payload: customerMarkRate
});

export const providerMarkRateChangeAction = (providerMarkRate: string): Action => ({
  type: C.PROVIDER_MARK_RATE_CHANGE,
  payload: providerMarkRate
});

export const dateMarkRateChangeAction = (dateMarkRate: string): Action => ({
  type: C.DATE_MARK_RATE_CHANGE,
  payload: dateMarkRate
});

export const eventKeyToggleAction = (eventKey: string): Action => ({
  type: C.EVENT_KEY_TOGGLE,
  payload: eventKey
});

export const projectionAddAction = (cell: string): Action => ({
  type: C.PROJECTION_ADD,
  payload: cell
});

export const projectionRemoveAction = (index: number): Action => ({
  type: C.PROJECTION_REMOVE,
  payload: index
});

export const projectionUpAction = (index: number): Action => ({
  type: C.PROJECTION_UP,
  payload: index
});

export const projectionDownAction = (index: number): Action => ({
  type: C.PROJECTION_DOWN,
  payload: index
});

export const projectionAddAllAction = (): Action => ({
  type: C.PROJECTION_ADD_ALL,
  payload: undefined
});

export const projectionRemoveAllAction = (): Action => ({
  type: C.PROJECTION_REMOVE_ALL,
  payload: undefined
});

// TODO : REMOVE
export const download = (headers: string[], rankedOrders: RankedOrder[]) => {
  DefaultLibraryAdaptor.createWorkbook(headers, rankedOrders).download();
  return {
    type: ''
  };
};
