import { createSelector } from 'reselect';

import State from '../entities/State';

import {
  extractSheetNames,
  extractSheet,
  extractCells,
  extractMap,
  extractFileStatus,
  extractSheetStatus,
  extractIDStatus,
  extractOptionsStatus,
  extractCellStatus,
  extractCellAggregateStatus
} from './extractors';

const getDbWorkbook = (state: State) => state.dbWorkbook;
const getOrderWorkbook = (state: State) => state.orderWorkbook;

const getCustomerSheetName = (state: State) => state.customerSheetName;
const getProviderSheetName = (state: State) => state.providerSheetName;
const getOrderSheetName = (state: State) => state.orderSheetName;

const getCustomerIDCell = (state: State) => state.customerIDCell;
const getProviderIDCell = (state: State) => state.providerIDCell;
const getOrderCustomerIDCell = (state: State) => state.orderCustomerIDCell;
const getOrderProviderIDCell = (state: State) => state.orderProviderIDCell;

const getCustomerMarkCell = (state: State) => state.customerMarkCell;
const getProviderMarkCell = (state: State) => state.providerMarkCell;
const getOrderTypeCell = (state: State) => state.orderTypeCell;
const getOrderShippingDateCell = (state: State) => state.orderShippingDateCell;
const getOrderDeliveryDateCell = (state: State) => state.orderDeliveryDateCell;

export const getDbSheetNames = createSelector(getDbWorkbook, extractSheetNames);
export const getOrderSheetNames = createSelector(getOrderWorkbook, extractSheetNames);

export const getCustomerSheet = createSelector([getCustomerSheetName, getDbWorkbook], extractSheet);
export const getProviderSheet = createSelector([getProviderSheetName, getDbWorkbook], extractSheet);
export const getOrderSheet = createSelector([getOrderSheetName, getOrderWorkbook], extractSheet);

export const getCustomerCells = createSelector(getCustomerSheet, extractCells);
export const getProviderCells = createSelector(getProviderSheet, extractCells);
export const getOrderCells = createSelector(getOrderSheet, extractCells);

export const getCustomerMap = createSelector([getCustomerSheet, getCustomerIDCell], extractMap);
export const getProviderMap = createSelector([getProviderSheet, getProviderIDCell], extractMap);
export const getOrderCustomerMap = createSelector([getOrderSheet, getOrderCustomerIDCell], extractMap);
export const getOrderProviderMap = createSelector([getOrderSheet, getOrderProviderIDCell], extractMap);

export const getFileStatus = createSelector([getDbWorkbook, getOrderWorkbook], extractFileStatus);
export const getSheetStatus = createSelector(
  [getDbSheetNames, getOrderSheetNames, getCustomerSheetName, getProviderSheetName, getOrderSheetName],
  extractSheetStatus
);

export const getCustomerIDCellStatus = createSelector([getCustomerCells, getCustomerIDCell], extractCellStatus);
export const getProviderIDCellStatus = createSelector([getProviderCells, getProviderIDCell], extractCellStatus);
export const getOrderCustomerIDCellStatus = createSelector([getOrderCells, getOrderCustomerIDCell], extractCellStatus);
export const getOrderProviderIDCellStatus = createSelector([getOrderCells, getOrderProviderIDCell], extractCellStatus);

export const getCustomerIDCellAggregateStatus = createSelector([getCustomerIDCellStatus, getOrderCustomerIDCellStatus], extractCellAggregateStatus);
export const getProviderIDCellAggregateStatus = createSelector([getProviderIDCellStatus, getOrderProviderIDCellStatus], extractCellAggregateStatus);

export const getCustomerIDStatus = createSelector([getCustomerMap, getOrderCustomerMap, getCustomerIDCellAggregateStatus], extractIDStatus);
export const getProviderIDStatus = createSelector([getProviderMap, getOrderCustomerMap, getProviderIDCellAggregateStatus], extractIDStatus);

export const getOptionsStatus = createSelector(
  [getCustomerMarkCell, getProviderMarkCell, getOrderTypeCell, getOrderShippingDateCell, getOrderDeliveryDateCell],
  extractOptionsStatus
);

export const getProjectionStatus = createSelector([], () => {});
