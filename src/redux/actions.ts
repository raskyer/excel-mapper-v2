import Dispatcher from 'src/entities/Dispatcher';
import StateGetter from 'src/entities/StateGetter';
import Action from 'src/entities/Action';
import RankedOrder from 'src/entities/RankedOrder';

import {
  DB_FILE_CHANGE,
  ORDER_FILE_CHANGE,
  CUSTOMER_SHEET_CHANGE,
  PROVIDER_SHEET_CHANGE,
  ORDER_SHEET_CHANGE,
  CUSTOMER_ID_CELL_CHANGE,
  ORDER_CUSTOMER_ID_CELL_CHANGE,
  PROVIDER_ID_CELL_CHANGE,
  ORDER_PROVIDER_ID_CELL_CHANGE,
  ORDER_TYPE_CELL_CHANGE,
  ORDER_LOADING_DATE_CELL_CHANGE,
  ORDER_SHIPPING_DATE_CELL_CHANGE,
  CUSTOMER_MARK_CELL_CHANGE,
  PROVIDER_MARK_CELL_CHANGE,
  CUSTOMER_MARK_RATE_CHANGE,
  PROVIDER_MARK_RATE_CHANGE,
  DATE_MARK_RATE_CHANGE,
  EVENT_KEY_TOGGLE,
  PROJECTION_ADD,
  PROJECTION_REMOVE,
  PROJECTION_UP,
  PROJECTION_DOWN,
  PROJECTION_ADD_ALL,
  PROJECTION_REMOVE_ALL,
  RESULTS_COMPUTED
} from './constants';
import { getCustomerMap, getProviderMap, getOrderSheet } from './selectors';

import { DefaultLibraryAdaptor } from 'src/services/LibraryAdaptorFactory'; 
import Compute from 'src/services/Ordering';
import { fromState } from 'src/utils/core';

export const dbFileChangedAction = (dbFile: File) => (dispatch: Dispatcher): void => {
  DefaultLibraryAdaptor.parseFile(dbFile).then(workbook => {
    dispatch({
      type: DB_FILE_CHANGE,
      payload: workbook
    });
  });
};

export const orderFileChangedAction = (orderFile: File) => (dispatch: Dispatcher): void => {
  DefaultLibraryAdaptor.parseFile(orderFile).then(workbook => {
    dispatch({
      type: ORDER_FILE_CHANGE,
      payload: workbook
    });
  });
};

export const customerSheetChangedAction = (customerSheetName?: string): Action => ({
  type: CUSTOMER_SHEET_CHANGE,
  payload: customerSheetName
});

export const providerSheetChangedAction = (providerSheetName?: string): Action => ({
  type: PROVIDER_SHEET_CHANGE,
  payload: providerSheetName
});

export const orderSheetChangedAction = (orderSheetName?: string): Action => ({
  type: ORDER_SHEET_CHANGE,
  payload: orderSheetName
});

export const customerIDCellChangedAction = (customerIDCell?: string): Action => ({
  type: CUSTOMER_ID_CELL_CHANGE,
  payload: customerIDCell
});

export const providerIDCellChangedAction = (providerIDCell?: string): Action => ({
  type: PROVIDER_ID_CELL_CHANGE,
  payload: providerIDCell
});

export const orderCustomerIDCellChangedAction = (orderCustomerIDCell?: string): Action => ({
  type: ORDER_CUSTOMER_ID_CELL_CHANGE,
  payload: orderCustomerIDCell
});

export const orderProviderIDCellChangedAction = (orderProviderIDCell?: string): Action => ({
  type: ORDER_PROVIDER_ID_CELL_CHANGE,
  payload: orderProviderIDCell
});

export const orderTypeCellChangedAction = (orderTypeCell?: string): Action => ({
  type: ORDER_TYPE_CELL_CHANGE,
  payload: orderTypeCell
});

export const orderLoadingDateCellChangedAction = (orderLoadingDateCell?: string): Action => ({
  type: ORDER_LOADING_DATE_CELL_CHANGE,
  payload: orderLoadingDateCell
});

export const orderShippingDateCellChangedAction = (orderShippingDateCell?: string): Action => ({
  type: ORDER_SHIPPING_DATE_CELL_CHANGE,
  payload: orderShippingDateCell
});

export const customerMarkCellChangedAction = (customerMarkCell?: string): Action => ({
  type: CUSTOMER_MARK_CELL_CHANGE,
  payload: customerMarkCell
});

export const providerMarkCellChangedAction = (providerMarkCell?: string): Action => ({
  type: PROVIDER_MARK_CELL_CHANGE,
  payload: providerMarkCell
});

export const customerMarkRateChangedAction = (customerMarkRate: string): Action => ({
  type: CUSTOMER_MARK_RATE_CHANGE,
  payload: customerMarkRate
});

export const providerMarkRateChangedAction = (providerMarkRate: string): Action => ({
  type: PROVIDER_MARK_RATE_CHANGE,
  payload: providerMarkRate
});

export const dateMarkRateChangedAction = (dateMarkRate: string): Action => ({
  type: DATE_MARK_RATE_CHANGE,
  payload: dateMarkRate
});

export const eventKeyToggledAction = (eventKey: string): Action => ({
  type: EVENT_KEY_TOGGLE,
  payload: eventKey
});

export const projectionAddedAction = (cell: string): Action => ({
  type: PROJECTION_ADD,
  payload: cell
});

export const projectionRemovedAction = (index: number): Action => ({
  type: PROJECTION_REMOVE,
  payload: index
});

export const projectionUppedAction = (index: number): Action => ({
  type: PROJECTION_UP,
  payload: index
});

export const projectionDownedAction = (index: number): Action => ({
  type: PROJECTION_DOWN,
  payload: index
});

export const projectionAddedAllAction = (): Action => ({
  type: PROJECTION_ADD_ALL,
  payload: undefined
});

export const projectionRemovedAllAction = (): Action => ({
  type: PROJECTION_REMOVE_ALL,
  payload: undefined
});

export const submit = () => (dispatch: Dispatcher, getState: StateGetter): void => {
  const state = getState();

  const customerMap = getCustomerMap(state);
  const providerMap = getProviderMap(state);
  const orderSheet = getOrderSheet(state);

  const compute = new Compute(customerMap, providerMap, state);
  const rankedOrders = compute.compute(orderSheet);

  dispatch({
    type: RESULTS_COMPUTED,
    payload: rankedOrders
  });
};

export const download = (headers: string[], rankedOrders: RankedOrder[]) => {
  DefaultLibraryAdaptor.createWorkbook(headers, rankedOrders).download();

  return {
    type: ''
  };
};
