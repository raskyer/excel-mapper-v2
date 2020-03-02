import { createSelector } from 'reselect';

import State from 'src/entities/State';

import * as Extractors from './extractors';

const getDbWorkbook = (state: State) => state.dbWorkbook;
const getOrderWorkbook = (state: State) => state.orderWorkbook;

const getCustomerSheet = (state: State) => state.customerSheet;
const getProviderSheet = (state: State) => state.providerSheet;
const getOrderSheet = (state: State) => state.orderSheet;

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
const getOrderLoadingDateCell = (state: State) => state.orderLoadingDateCell;
const getOrderShippingDateCell = (state: State) => state.orderShippingDateCell;

const getCustomerMarkRate = (state: State) => state.customerMarkRate;
const getProviderMarkRate = (state: State) => state.providerMarkRate;
const getDateMarkRate = (state: State) => state.dateMarkRate;

const getProjections = (state: State) => state.projections;

export const getDbSheetNames = createSelector(getDbWorkbook, Extractors.extractSheetNames());
export const getOrderSheetNames = createSelector(getOrderWorkbook, Extractors.extractSheetNames());

export const getCustomerCells = createSelector(getCustomerSheet, Extractors.extractCells());
export const getProviderCells = createSelector(getProviderSheet, Extractors.extractCells());
export const getOrderCells = createSelector(getOrderSheet, Extractors.extractCells());

export const getCustomerMap = createSelector([getCustomerSheet, getCustomerIDCell], Extractors.extractMap());
export const getProviderMap = createSelector([getProviderSheet, getProviderIDCell], Extractors.extractMap());
export const getOrderCustomerMap = createSelector([getOrderSheet, getOrderCustomerIDCell], Extractors.extractMap());
export const getOrderProviderMap = createSelector([getOrderSheet, getOrderProviderIDCell], Extractors.extractMap());
export const getCustomerDifference = createSelector([getCustomerMap, getOrderCustomerMap], Extractors.extractDifference());
export const getProviderDifference = createSelector([getProviderMap, getOrderProviderMap], Extractors.extractDifference());

export const getFileStatus = createSelector([getDbWorkbook, getOrderWorkbook], Extractors.extractFileStatus());
export const getSheetStatus = createSelector(
  [getDbSheetNames, getOrderSheetNames, getCustomerSheetName, getProviderSheetName, getOrderSheetName],
  Extractors.extractSheetStatus()
);

export const getCustomerIDCellStatus = createSelector([getCustomerCells, getCustomerIDCell], Extractors.extractCellStatus());
export const getProviderIDCellStatus = createSelector([getProviderCells, getProviderIDCell], Extractors.extractCellStatus());
export const getOrderCustomerIDCellStatus = createSelector([getOrderCells, getOrderCustomerIDCell], Extractors.extractCellStatus());
export const getOrderProviderIDCellStatus = createSelector([getOrderCells, getOrderProviderIDCell], Extractors.extractCellStatus());

export const getCustomerIDCellAggregateStatus = createSelector([getCustomerIDCellStatus, getOrderCustomerIDCellStatus], Extractors.extractCellAggregateStatus());
export const getProviderIDCellAggregateStatus = createSelector([getProviderIDCellStatus, getOrderProviderIDCellStatus], Extractors.extractCellAggregateStatus());

export const getCustomerIDStatus = createSelector([getCustomerMap, getOrderCustomerMap, getCustomerIDCellAggregateStatus], Extractors.extractIDStatus());
export const getProviderIDStatus = createSelector([getProviderMap, getOrderCustomerMap, getProviderIDCellAggregateStatus], Extractors.extractIDStatus());

export const getOptionsStatus = createSelector(
  [getCustomerMarkCell, getProviderMarkCell, getOrderTypeCell, getOrderLoadingDateCell, getOrderShippingDateCell],
  Extractors.extractOptionsStatus()
);

export const getRatesStatus = createSelector([getCustomerMarkRate, getProviderMarkRate, getDateMarkRate], Extractors.extractRatesStatus());

export const getProjectionsStatus = createSelector([getProjections, getOrderCells], Extractors.extractProjectionsStatus());

export const getOrderStatus = createSelector(
  [
    getOrderSheet,
    getOrderCustomerIDCell,
    getOrderProviderIDCell,
    getOrderTypeCell,
    getOrderLoadingDateCell,
    getOrderShippingDateCell
  ],
  Extractors.extractOrderStatus()
);

export const getCells = createSelector(
  [
    getCustomerMarkCell,
    getProviderMarkCell,
    getOrderCustomerIDCell,
    getOrderProviderIDCell,
    getOrderTypeCell,
    getOrderLoadingDateCell,
    getOrderShippingDateCell
  ],
  (...cells) => [...cells]
);
export const getRates = createSelector(
  [
    getCustomerMarkRate,
    getProviderMarkRate,
    getDateMarkRate
  ],
  (...rates) => [...rates]
);
export const getRankedOrders = createSelector(
  [
    getCustomerMap,
    getProviderMap,
    getCells,
    getRates,
    getOrderSheet,
    getProjections
  ],
  Extractors.extractRankedOrders()
);
