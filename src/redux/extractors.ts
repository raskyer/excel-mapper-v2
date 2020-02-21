import { WorkBook } from 'xlsx/types';

import Status from '../entities/Status';
import CellMap from '../entities/CellMap';

import { parseSheet } from '../utils/excel';
import { createMap, difference, diffPercentage } from '../utils/core';

export const extractSheetNames = (workbook?: WorkBook): string[] => {
  return workbook ? workbook.SheetNames : [];
};

export const extractSheet = (sheetName?: string, workbook?: WorkBook): any[][] => {
  if (workbook === undefined || sheetName === undefined || workbook.Sheets[sheetName] === undefined) return [];
  return parseSheet(workbook.Sheets[sheetName]);
};

export const extractCells = (sheet: any[][]): string[] => {
  if (sheet.length === 0) return [];
  return sheet[0];
};

export const extractMap = (sheet: any[][], idCell?: number): CellMap => {
  if (sheet.length === 0 || idCell === undefined) return new Map();
  return createMap(sheet, idCell);
};

export const extractFileStatus = (dbWorkbook?: WorkBook, orderWorkbook?: WorkBook): Status => {
  if (dbWorkbook !== undefined && orderWorkbook !== undefined) {
    return 'success';
  }
  if (dbWorkbook === undefined && orderWorkbook === undefined) {
    return 'secondary';
  }
  return 'warning';
};

export const extractSheetStatus = (
  sheetNames: string[],
  orderSheetNames: string[],
  customerSheetName?: string,
  providerSheetName?: string,
  orderSheetName?: string
): Status => {
  if (customerSheetName !== undefined && providerSheetName !== undefined && orderSheetName !== undefined) {
    return 'success';
  }
  if (sheetNames.length < 1 && orderSheetNames.length < 1) {
    return 'dark';
  }
  if (sheetNames.length > 0 && (customerSheetName === undefined || providerSheetName === undefined)) {
    return 'danger';
  }
  if (orderSheetNames.length > 0 && orderSheetName === undefined) {
    return 'danger';
  }
  return 'warning';
};

export const extractCellStatus = (cells: string[], cell?: number): Status => {
  if (cells.length < 1) {
    return 'dark';
  }
  if (cell === undefined) {
    return 'danger';
  }
  return 'success';
};

export const extractCellAggregateStatus = (status1: Status, status2: Status): Status => {
  if (status1 === 'danger' || status2 === 'danger') {
    return 'danger';
  }
  if (status1 === 'dark' && status2 === 'dark') {
    return 'dark';
  }
  if (status1 === 'dark' || status2 === 'dark') {
    return 'warning';
  }
  return 'success';
};

export const extractIDStatus = (
  itemMap: CellMap,
  orderMap: CellMap,
  cellStatus: Status
): Status => {
  if (cellStatus === 'danger') {
    return 'danger';
  }
  if (itemMap.size < 1 && orderMap.size < 1) {
    return 'dark';
  }
  if (itemMap.size < 1 || orderMap.size < 1) {
    return 'warning';
  }

  const missing = difference(orderMap, itemMap);
  const percentage = diffPercentage(orderMap.size, missing.length);

  if (percentage < 50) {
    return 'danger';
  }

  return 'success';
};

export const extractOptionsStatus = (customerMarkCell?: number, providerMarkCell?: number, orderTypeCell?: number, orderLoadingDateCell?: number, orderShippingDateCell?: number): Status => {
  const arr = [customerMarkCell, providerMarkCell, orderTypeCell, orderLoadingDateCell, orderShippingDateCell];
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
};

export const extractRateStatus = (customerMarkRate: number, providerMarkRate: number, dateMarkRate: number): Status => {
  if (customerMarkRate < 0 || providerMarkRate < 0 || dateMarkRate < 0) {
    return 'danger';
  }
  return 'success';
};

export const extractProjectionStatus = (projection: string[], orderCells: string[]): Status => {
  if (orderCells.length < 1) {
    return 'dark';
  }
  if (projection.length < 1) {
    return 'danger';
  }
  return 'success';
};
