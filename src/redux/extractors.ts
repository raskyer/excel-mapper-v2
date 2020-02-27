import WorkBookAdaptor from 'src/entities/WorkbookAdaptor';
import Status from 'src/entities/Status';
import CellMap from 'src/entities/CellMap';
import Projection from 'src/entities/Projection';

import RankedOrderService from 'src/services/RankedOrderService';
import { createMap, difference, diffPercentage, project } from 'src/utils/core';

export const extractSheetNames = () => (workbook?: WorkBookAdaptor): string[] => {
  return workbook ? workbook.getSheetNames() : [];
};

export const extractCells = () => (sheet: any[][]): string[] => {
  if (sheet.length === 0) return [];
  return sheet[0];
};

export const extractMap = () => (sheet: any[][], idCell?: number): CellMap => {
  if (sheet.length === 0 || idCell === undefined) return new Map();
  return createMap(sheet, idCell);
};

export const extractFileStatus = () => (dbWorkbook?: WorkBookAdaptor, orderWorkbook?: WorkBookAdaptor): Status => {
  if (dbWorkbook !== undefined && orderWorkbook !== undefined) {
    return 'success';
  }
  if (dbWorkbook === undefined && orderWorkbook === undefined) {
    return 'secondary';
  }
  return 'warning';
};

export const extractSheetStatus = () => (
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

export const extractCellStatus = () => (cells: string[], cell?: number): Status => {
  if (cells.length < 1) {
    return 'dark';
  }
  if (cell === undefined) {
    return 'danger';
  }
  return 'success';
};

export const extractCellAggregateStatus = () => (status1: Status, status2: Status): Status => {
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

export const extractIDStatus = () => (
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

  const { missing } = difference(orderMap, itemMap);
  const percentage = diffPercentage(orderMap.size, missing.length);

  if (percentage === 0) {
    return 'danger';
  }

  if (percentage < 50) {
    return 'warning';
  }

  return 'success';
};

export const extractOptionsStatus = () => (customerMarkCell?: number, providerMarkCell?: number, orderTypeCell?: number, orderLoadingDateCell?: number, orderShippingDateCell?: number): Status => {
  const sum = [customerMarkCell, providerMarkCell].reduce((p, n) => {
    if (p === undefined) return 1;
    if (n !== undefined) return p + 1;
    return p + 0;
  }, 0);

  const orderSum = [orderTypeCell, orderLoadingDateCell, orderShippingDateCell].reduce((p, n) => {
    if (p === undefined) return 1;
    if (n !== undefined) return p + 1;
    return p + 0;
  }, 0);

  if (sum === 0 && orderSum === 0) {
    return 'dark';
  }
  if (sum === 2 && orderSum === 3) {
    return 'success';
  }
  if (sum === 1 || orderSum === 1 || orderSum === 2) {
    return 'danger';
  }
  return 'warning';
};

export const extractRatesStatus = () => (customerMarkRate: number, providerMarkRate: number, dateMarkRate: number): Status => {
  if (customerMarkRate < 0 || providerMarkRate < 0 || dateMarkRate < 0) {
    return 'danger';
  }
  return 'success';
};

export const extractProjectionsStatus = () => (projection: Projection[], orderCells: string[]): Status => {
  if (orderCells.length < 1) {
    return 'dark';
  }
  if (projection.length < 1) {
    return 'danger';
  }
  return 'success';
};

export const extractRankedOrders = () => (
    customerMap: CellMap,
    providerMap: CellMap,
    cells: (number | undefined)[],
    rates: number[],
    orderSheet: any[][],
    projections: Projection[]
) => {
  if (orderSheet === undefined || orderSheet.length < 1) {
    return [];
  }

  const [
    customerMarkCell,
    providerMarkCell,
    orderCustomerIDCell,
    orderProviderIDCell,
    orderTypeCell,
    orderLoadingDateCell,
    orderShippingDateCell
  ] = cells;

  const [
    customerMarkRate,
    providerMarkRate,
    dateMarkRate
  ] = rates;

  const rankedOrderService = new RankedOrderService(
    customerMap,
    providerMap,
    customerMarkCell,
    providerMarkCell,
    orderCustomerIDCell,
    orderProviderIDCell,
    orderTypeCell,
    orderLoadingDateCell,
    orderShippingDateCell,
    customerMarkRate,
    providerMarkRate,
    dateMarkRate,
    console.log
  );

  const rankedOrders = rankedOrderService.build(orderSheet);
  return project(rankedOrders, projections);
};
