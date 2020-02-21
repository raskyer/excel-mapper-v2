import CellMap from '../entities/CellMap';
import State from '../entities/State';
import FinalState from '../entities/FinalState';

import { getCustomerSheet, getProviderSheet, getOrderSheet } from '../redux/selectors';

export function createMap(sheet: any[][], idCell: number): CellMap {
  const map = new Map();
  for (let i = 1; i < sheet.length; i++) {
    let id = sheet[i][idCell];
    if (typeof id === 'string') {
      id = id.trim().toLowerCase();
    }
    if (id === undefined) {
      console.warn('CREATE MAP : try to create map with undefined key', i, idCell, sheet);
      continue;
    }
    map.set(id, sheet[i]);
  }
  return map;
}

export function difference(orderMap: CellMap, itemMap: CellMap): any[][] {
  const missing: any[][] = [];
  for (const [key, value] of orderMap.entries()) {
    if (!itemMap.has(key)) {
      missing.push(value);
    }
  }
  return missing;
}

export function diffPercentage(size: number, missingSize: number): number {
  const percentage = Math.round(((size - missingSize) / size) * 100);
  if (isNaN(percentage)) {
    return 0;
  }
  return percentage;
}

export function fromState(state: State): FinalState {
  const {
    dbWorkbook,
    orderWorkbook,
    customerSheetName,
    providerSheetName,
    orderSheetName,
    customerIDCell,
    providerIDCell,
    orderCustomerIDCell,
    orderProviderIDCell,
    customerMarkCell,
    providerMarkCell,
    orderTypeCell,
    orderShippingDateCell,
    orderLoadingDateCell,
    customerMarkRate,
    providerMarkRate,
    dateMarkRate,
    projection
  } = state;

  if (dbWorkbook === undefined || orderWorkbook === undefined) {
    throw new Error('undefined workbook');
  }

  if (customerSheetName === undefined || providerSheetName === undefined || orderSheetName === undefined) {
    throw new Error('undefined sheet name');
  }

  if (customerIDCell === undefined || providerIDCell === undefined || orderCustomerIDCell === undefined || orderProviderIDCell === undefined) {
    throw new Error('undefined id cell');
  }

  if (customerMarkCell === undefined || providerMarkCell === undefined) {
    throw new Error('undefined mark cell');
  }

  if (orderTypeCell === undefined || orderShippingDateCell === undefined || orderLoadingDateCell === undefined) {
    throw new Error('undefined order cell');
  }

  if (customerMarkRate === undefined || providerMarkRate === undefined || dateMarkRate === undefined) {
    throw new Error('undefined rate cell');
  }

  if (dbWorkbook.Sheets[customerSheetName] === undefined || dbWorkbook.Sheets[providerSheetName] === undefined) {
    throw new Error('sheet name does not exist in workbook');
  }

  if (orderWorkbook.Sheets[orderSheetName] === undefined) {
    throw new Error('sheet name does not exist in workbook');
  }

  const customerSheet = getCustomerSheet(state);
  const providerSheet = getProviderSheet(state);
  const orderSheet = getOrderSheet(state);

  if (customerSheet.length < 1 || providerSheet.length < 1 || orderSheet.length < 1) {
    throw new Error('sheet is empty');
  }

  if (typeof customerMarkRate !== 'number' || typeof providerMarkRate !== 'number' || typeof dateMarkRate !== 'number') {
    throw new Error('rate are not number');
  }

  return {
    dbWorkbook, // check
    orderWorkbook, // check

    customerSheetName, // check
    providerSheetName, // check
    orderSheetName, // check

    customerIDCell,
    providerIDCell,
    orderCustomerIDCell,
    orderProviderIDCell,
    customerMarkCell,
    providerMarkCell,

    orderTypeCell,
    orderShippingDateCell,
    orderLoadingDateCell,

    customerMarkRate, // check
    providerMarkRate, // check
    dateMarkRate, // check

    projection
  };
}
