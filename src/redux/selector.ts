import { createSelector } from 'reselect';
import State from '../entities/State';
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
