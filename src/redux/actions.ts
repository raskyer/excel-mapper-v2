import Dispatcher from 'src/entities/Dispatcher';
import Action from 'src/entities/Action';

import * as C from './constants';

import { parseFile } from 'src/services/DefaultLibraryAdaptor'; 

// TODO : Remove
export const dbFileChangeAction = (dbFile: File) => (dispatch: Dispatcher): void => {
  parseFile(dbFile).then(workbook => {
    dispatch({
      type: C.FILE_CHANGE.DB,
      payload: workbook
    });
  });
};


export const orderFileChangeAction = (orderFile: File) => (dispatch: Dispatcher): void => {
  parseFile(orderFile).then(workbook => {
    dispatch({
      type: C.FILE_CHANGE.ORDER,
      payload: workbook
    });
  });
};

export const customerSheetChangeAction = (customerSheetName: string): Action => ({
  type: C.SHEET_NAME_CHANGE.CUSTOMER,
  payload: customerSheetName
});

export const providerSheetChangeAction = (providerSheetName: string): Action => ({
  type: C.SHEET_NAME_CHANGE.PROVIDER,
  payload: providerSheetName
});

export const orderSheetChangeAction = (orderSheetName: string): Action => ({
  type: C.SHEET_NAME_CHANGE.ORDER,
  payload: orderSheetName
});

export const customerIDCellChangeAction = (customerIDCell: number): Action => ({
  type: C.CELL_CHANGE.CUSTOMER_ID,
  payload: customerIDCell
});

export const providerIDCellChangeAction = (providerIDCell: number): Action => ({
  type: C.CELL_CHANGE.PROVIDER_ID,
  payload: providerIDCell
});

export const orderCustomerIDCellChangeAction = (orderCustomerIDCell: number): Action => ({
  type: C.CELL_CHANGE.ORDER_CUSTOMER_ID,
  payload: orderCustomerIDCell
});

export const orderProviderIDCellChangeAction = (orderProviderIDCell: number): Action => ({
  type: C.CELL_CHANGE.ORDER_PROVIDER_ID,
  payload: orderProviderIDCell
});

export const orderTypeCellChangeAction = (orderTypeCell: number): Action => ({
  type: C.CELL_CHANGE.ORDER_TYPE,
  payload: orderTypeCell
});

export const orderLoadingDateCellChangeAction = (orderLoadingDateCell: number): Action => ({
  type: C.CELL_CHANGE.ORDER_LOADING_DATE,
  payload: orderLoadingDateCell
});

export const orderShippingDateCellChangeAction = (orderShippingDateCell: number): Action => ({
  type: C.CELL_CHANGE.ORDER_SHIPPING_DATE,
  payload: orderShippingDateCell
});

export const customerMarkCellChangeAction = (customerMarkCell: number): Action => ({
  type: C.CELL_CHANGE.CUSTOMER_MARK,
  payload: customerMarkCell
});

export const providerMarkCellChangeAction = (providerMarkCell: number): Action => ({
  type: C.CELL_CHANGE.PROVIDER_MARK,
  payload: providerMarkCell
});

export const customerMarkRateChangeAction = (customerMarkRate: number): Action => ({
  type: C.RATE_CHANGE.CUSTOMER,
  payload: customerMarkRate
});

export const providerMarkRateChangeAction = (providerMarkRate: number): Action => ({
  type: C.RATE_CHANGE.PROVIDER,
  payload: providerMarkRate
});

export const dateMarkRateChangeAction = (dateMarkRate: number): Action => ({
  type: C.RATE_CHANGE.DATE,
  payload: dateMarkRate
});

export const projectionAddAction = (cell: string): Action => ({
  type: C.PROJECTION.ADD,
  payload: cell
});

export const projectionRemoveAction = (index: number): Action => ({
  type: C.PROJECTION.REMOVE,
  payload: index
});

export const projectionUpAction = (index: number): Action => ({
  type: C.PROJECTION.UP,
  payload: index
});

export const projectionDownAction = (index: number): Action => ({
  type: C.PROJECTION.DOWN,
  payload: index
});

/*export const projectionAddAllAction = (): Action => ({
  type: C.PROJECTION_ADD_ALL,
  payload: undefined
});

export const projectionRemoveAllAction = (): Action => ({
  type: C.PROJECTION_REMOVE_ALL,
  payload: undefined
});*/
