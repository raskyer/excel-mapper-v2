import { createSelector } from 'reselect';

import State from '../entities/State';
import Status from '../entities/Status';
import { parseSheet } from '../utils/excel';
import { createMap } from '../utils/core';

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

type ID = string | number;

export const getDbSheetNames = createSelector(getDbWorkbook, (workbook): string[] => {
  return workbook ? workbook.SheetNames : [];
});

export const getOrderSheetNames = createSelector(getOrderWorkbook, (workbook): string[] => {
  return workbook ? workbook.SheetNames : [];
});

export const getCustomerSheet = createSelector([getDbWorkbook, getCustomerSheetName], (workbook, sheetName): any[][] => {
  if (workbook === undefined || sheetName === undefined || workbook.Sheets[sheetName] === undefined) return [];
  return parseSheet(workbook.Sheets[sheetName]);
});

export const getProviderSheet = createSelector([getDbWorkbook, getProviderSheetName], (workbook, sheetName): any[][] => {
  if (workbook === undefined || sheetName === undefined || workbook.Sheets[sheetName] === undefined) return [];
  return parseSheet(workbook.Sheets[sheetName]);
});

export const getOrderSheet = createSelector([getOrderWorkbook, getOrderSheetName], (workbook, sheetName): any[][] => {
  if (workbook === undefined || sheetName === undefined || workbook.Sheets[sheetName] === undefined) return [];
  return parseSheet(workbook.Sheets[sheetName]);
});

export const getCustomerCells = createSelector(getCustomerSheet, (sheet): string[] => {
  if (sheet.length === 0) return [];
  return sheet[0];
});

export const getProviderCells = createSelector(getProviderSheet, (sheet): string[] => {
  if (sheet.length === 0) return [];
  return sheet[0];
});

export const getOrderCells = createSelector(getOrderSheet, (sheet): string[] => {
  if (sheet.length === 0) return [];
  return sheet[0];
});

export const getCustomerMap = createSelector([getCustomerSheet, getCustomerIDCell], (sheet, idCell): Map<ID, any[]> => {
  if (sheet.length === 0 || idCell === undefined) return new Map();
  return createMap(sheet, idCell);
});

export const getProviderMap = createSelector([getProviderSheet, getProviderIDCell], (sheet, idCell): Map<ID, any[]> => {
  if (sheet.length === 0 || idCell === undefined) return new Map();
  return createMap(sheet, idCell);
});

export const getOrderCustomerMap = createSelector([getOrderSheet, getOrderCustomerIDCell], (sheet, idCell): Map<ID, any[]> => {
  if (sheet.length === 0 || idCell === undefined) return new Map();
  return createMap(sheet, idCell);
});

export const getOrderProviderMap = createSelector([getOrderSheet, getOrderProviderIDCell], (sheet, idCell): Map<ID, any[]> => {
  if (sheet.length === 0 || idCell === undefined) return new Map();
  return createMap(sheet, idCell);
});

export const getFileStatus = createSelector([getDbWorkbook, getOrderWorkbook], (dbWorkbook, orderWorkbook): Status => {
  if (dbWorkbook !== undefined && orderWorkbook !== undefined) {
    return 'success';
  }
  if (dbWorkbook === undefined && orderWorkbook === undefined) {
    return 'dark';
  }
  return 'warning';
});

export const getSheetStatus = createSelector(
  [getCustomerSheetName, getProviderSheetName, getOrderSheetName],
  (customerSheetName, providerSheetName, orderSheetName): Status => {
    if (customerSheetName !== undefined && providerSheetName !== undefined && orderSheetName !== undefined) {
      return 'success';
    }
    if (customerSheetName === undefined && providerSheetName === undefined && orderSheetName === undefined) {
      return 'dark';
    }
    return 'warning';
  }
);

export const getCustomerIDStatus = createSelector([getCustomerMap, getOrderCustomerMap], (customerMap, orderMap): Status => {
  if (customerMap.size < 1 && orderMap.size < 1) {
    return 'dark';
  }
  if (customerMap.size < 1 || orderMap.size < 1) {
    return 'warning';
  }
  return 'success';
});

export const getProviderIDStatus = createSelector([getProviderMap, getOrderCustomerMap], (providerMap, orderMap): Status => {
  if (providerMap.size < 1 && orderMap.size < 1) {
    return 'dark';
  }
  if (providerMap.size < 1 || orderMap.size < 1) {
    return 'warning';
  }
  return 'success';
});

export const getOptionsStatus = createSelector(
  [getCustomerMarkCell, getProviderMarkCell, getOrderTypeCell, getOrderShippingDateCell, getOrderDeliveryDateCell],
  (customerMarkCell, providerMarkCell, orderTypeCell, orderShippingDateCell, orderDeliveryDateCell): Status => {
    const arr = [customerMarkCell, providerMarkCell, orderTypeCell, orderShippingDateCell, orderDeliveryDateCell];
    const sum = arr.reduce((p, n) => {
      if (p === undefined) return 1;
      if (n !== undefined) return p + 1;
      return p + 0;
    }, 0);

    if (sum === 0) {
      return 'dark';
    }
    if (sum === 5) {
      return 'success';
    }
    return 'warning';
  }
);
