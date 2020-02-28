import State, { StateCell, StateRate } from 'src/entities/State';
import WorkBookAdaptor from 'src/entities/WorkbookAdaptor';
import Projection from 'src/entities/Projection';

import {
  getDbSheetNames,
  getOrderSheetNames,
  getCustomerCells,
  getProviderCells,
  getOrderCells,
  getFileStatus,
  getSheetStatus,
  getCustomerIDStatus,
  getProviderIDStatus,
  getOptionsStatus,
  getProjectionsStatus
} from './selectors';

import Locator, { LocatorKey } from 'src/services/Locator';
import { extractCells } from './extractors';

const customerSheet: any[][] = Locator.findArray(LocatorKey.LOCAL_CUSTOMER_SHEET);
const providerSheet: any[][] = Locator.findArray(LocatorKey.LOCAL_PROVIDER_SHEET);
const customerCells = extractCells()(customerSheet);
const providerCells = extractCells()(providerSheet);

export const INITIAL_STATE: State = {
  // DATA
  customerSheet,
  providerSheet,
  orderSheet: [],
  // CELL
  customerIDCell: Locator.findCell(customerCells, LocatorKey.CUSTOMER_ID),
  providerIDCell: Locator.findCell(providerCells, LocatorKey.PROVIDER_ID),
  customerMarkCell: Locator.findCell(customerCells, LocatorKey.CUSTOMER_MARK),
  providerMarkCell: Locator.findCell(providerCells, LocatorKey.PROVIDER_MARK),
  // RATE
  customerMarkRate: Locator.findRate(LocatorKey.CUSTOMER_RATE),
  providerMarkRate: Locator.findRate(LocatorKey.PROVIDER_RATE),
  dateMarkRate: Locator.findRate(LocatorKey.DATE_RATE),
  // UI
  activeKeys: new Set<string>().add('1'),
  projections: Locator.findArray(LocatorKey.PROJECTIONS)
};

class StateBuilder {
  private state: State;
  private hasToCompute: boolean;

  constructor(state: State) {
    this.state = {
      ...state
    };
    this.hasToCompute = false;
  }

  setWorkbook(workbook?: WorkBookAdaptor): StateBuilder {
    this.state.dbWorkbook = workbook;

    if (workbook === undefined) {
      return this.resetDb();
    }
    
    const sheetsNames = getDbSheetNames({ ...this.state });
    const customerSheetName = Locator.findSheet(sheetsNames, LocatorKey.CUSTOMER_SHEET);
    const providerSheetName = Locator.findSheet(sheetsNames, LocatorKey.PROVIDER_SHEET);

    this.setCustomerSheetName(customerSheetName);
    this.setProviderSheetName(providerSheetName);
    this.hasToCompute = true;

    return this;
  }

  setOrderWorkbook(workbook?: WorkBookAdaptor): StateBuilder {
    this.state.orderWorkbook = workbook;

    if (workbook === undefined) {
      return this.resetOrder();
    }

    const sheetsNames = getOrderSheetNames({ ...this.state });
    const orderSheetName = Locator.findSheet(sheetsNames, LocatorKey.ORDER_SHEET);

    this.setOrderSheetName(orderSheetName);
    this.hasToCompute = true;

    return this;
  }

  setCustomerSheetName(customerSheetName?: string): StateBuilder {
    this.state.customerSheetName = customerSheetName;

    if (customerSheetName === undefined) {
      return this.resetCustomerCells();
    }

    Locator.save(LocatorKey.CUSTOMER_SHEET, customerSheetName);
    this.state.customerSheet = this.getSheet(this.state.dbWorkbook, customerSheetName);
    Locator.saveArray(LocatorKey.LOCAL_CUSTOMER_SHEET, this.state.customerSheet);

    const customerCells = getCustomerCells({ ...this.state });
    this.state.customerIDCell = Locator.findCell(customerCells, LocatorKey.CUSTOMER_ID);
    this.state.customerMarkCell = Locator.findCell(customerCells, LocatorKey.CUSTOMER_MARK);
    this.hasToCompute = true;

    return this;
  }

  setProviderSheetName(providerSheetName?: string): StateBuilder {
    this.state.providerSheetName = providerSheetName;

    if (providerSheetName === undefined) {
      return this.resetProviderCells();
    }

    Locator.save(LocatorKey.PROVIDER_SHEET, providerSheetName);
    this.state.providerSheet = this.getSheet(this.state.dbWorkbook, providerSheetName);
    Locator.saveArray(LocatorKey.LOCAL_PROVIDER_SHEET, this.state.providerSheet);
  
    const providerCells = getProviderCells({ ...this.state });
    this.state.providerIDCell = Locator.findCell(providerCells, LocatorKey.PROVIDER_ID);
    this.state.providerMarkCell = Locator.findCell(providerCells, LocatorKey.PROVIDER_MARK);
    this.hasToCompute = true;

    return this;
  }

  setOrderSheetName(orderSheetName?: string): StateBuilder {
    this.state.orderSheetName = orderSheetName;

    if (orderSheetName === undefined) {
      return this.resetOrderCells();
    }

    Locator.save(LocatorKey.ORDER_SHEET, orderSheetName);
    this.state.orderSheet = this.getSheet(this.state.orderWorkbook, orderSheetName);

    const orderCells = getOrderCells({ ...this.state });
    this.state.orderCustomerIDCell = Locator.findCell(orderCells, LocatorKey.ORDER_CUSTOMER_ID);
    this.state.orderProviderIDCell = Locator.findCell(orderCells, LocatorKey.ORDER_PROVIDER_ID);
    this.state.orderTypeCell = Locator.findCell(orderCells, LocatorKey.ORDER_TYPE);
    this.state.orderLoadingDateCell = Locator.findCell(orderCells, LocatorKey.ORDER_LOADING_DATE);
    this.state.orderShippingDateCell = Locator.findCell(orderCells, LocatorKey.ORDER_SHIPPING_DATE);
    this.state.projections = this.state.projections.length > 0 ? this.state.projections : this.orderCellsToProjections(orderCells); 
    this.hasToCompute = true;

    return this;
  }

  setCustomerIDCell(cell: number): StateBuilder {
    return this.setCell('customerIDCell', LocatorKey.CUSTOMER_ID, getCustomerCells(this.state), cell);
  }

  setProviderIDCell(cell: number): StateBuilder {
    return this.setCell('providerIDCell', LocatorKey.PROVIDER_ID, getProviderCells(this.state), cell);
  }

  setOrderCustomerIDCell(cell: number): StateBuilder {
    return this.setCell('orderCustomerIDCell', LocatorKey.ORDER_CUSTOMER_ID, getOrderCells(this.state), cell);
  }

  setOrderProviderIDCell(cell: number): StateBuilder {
    return this.setCell('orderProviderIDCell', LocatorKey.ORDER_PROVIDER_ID, getOrderCells(this.state), cell);
  }

  setOrderTypeCell(cell: number): StateBuilder {
    return this.setCell('orderTypeCell', LocatorKey.ORDER_TYPE, getOrderCells(this.state), cell);
  }

  setOrderLoadingDateCell(cell: number): StateBuilder {
    return this.setCell('orderLoadingDateCell', LocatorKey.ORDER_LOADING_DATE, getOrderCells(this.state), cell);
  }

  setOrderShippingDateCell(cell: number): StateBuilder {
    return this.setCell('orderShippingDateCell', LocatorKey.ORDER_SHIPPING_DATE, getOrderCells(this.state), cell);
  }

  setCustomerMarkCell(cell: number): StateBuilder {
    return this.setCell('customerMarkCell', LocatorKey.CUSTOMER_MARK, getCustomerCells(this.state), cell);
  }

  setProviderMarkCell(cell: number): StateBuilder {
    return this.setCell('providerMarkCell', LocatorKey.PROVIDER_MARK, getProviderCells(this.state), cell);
  }

  setCustomerMarkRate(rate: number): StateBuilder {
    return this.setRate('customerMarkRate', LocatorKey.CUSTOMER_RATE, rate);
  }

  setProviderMarkRate(rate: number): StateBuilder {
    return this.setRate('providerMarkRate', LocatorKey.PROVIDER_RATE, rate);
  }

  setDateMarkRate(rate: number): StateBuilder {
    return this.setRate('dateMarkRate', LocatorKey.DATE_RATE, rate);
  }

  toggleEventKey(eventKey: string): StateBuilder {
    const activeKeys = new Set(this.state.activeKeys);
    if (activeKeys.has(eventKey)) {
      activeKeys.delete(eventKey);
    } else {
      activeKeys.add(eventKey);
    }
    this.state.activeKeys = activeKeys;
    return this;
  }

  addProjection(cell: string): StateBuilder {
    const projection: Projection = {
      type: 'text',
      name: cell,
      index: getOrderCells(this.state).indexOf(cell)
    };
    this.state.projections = [...this.state.projections, projection];
    Locator.saveArray(LocatorKey.PROJECTIONS, this.state.projections);
    return this;
  }

  removeProjection(index: number): StateBuilder {
    this.state.projections = this.state.projections.filter((_, i) => i !== index);
    Locator.saveArray(LocatorKey.PROJECTIONS, this.state.projections);
    return this;
  }

  upProjection(index: number): StateBuilder {
    if (index === 0) return this;
    const copy = [...this.state.projections];
    const tmp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = tmp;
    this.state.projections = copy;
    Locator.saveArray(LocatorKey.PROJECTIONS, this.state.projections);
    return this;
  }

  downProjection(index: number): StateBuilder {
    if (index >= this.state.projections.length - 1) return this;
    const copy = [...this.state.projections];
    const tmp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = tmp;
    this.state.projections = copy;
    Locator.saveArray(LocatorKey.PROJECTIONS, this.state.projections);
    return this;
  }

  addAllProjection(): StateBuilder {
    this.state.projections = this.orderCellsToProjections(getOrderCells(this.state));
    Locator.saveArray(LocatorKey.PROJECTIONS, this.state.projections);
    return this;
  }

  removeAllProjection(): StateBuilder {
    this.state.projections = [];
    Locator.saveArray(LocatorKey.PROJECTIONS, this.state.projections);
    return this;
  }

  build(): State {
    if (this.hasToCompute) {
      this.computeActiveKeys();
    }
    return this.state;
  }

  private getSheet(workbook?: WorkBookAdaptor, sheetName?: string) {
    if (workbook === undefined || sheetName === undefined) return [];
    return workbook.getSheet(sheetName);
  }

  private setCell(key: keyof StateCell, locatorKey: LocatorKey, cells: string[], cell: number): StateBuilder {
    this.state[key] = cell;
    Locator.save(locatorKey, cells[cell]);
    return this;
  }

  private setRate(key: keyof StateRate, locatorKey: LocatorKey, rate: number): StateBuilder {
    this.state[key] = rate;
    Locator.save(locatorKey, rate.toString());
    return this;
  }

  private resetDb(): StateBuilder {
    this.resetDbSheets();
    this.resetCustomerCells();
    this.resetProviderCells();
    return this;
  }

  private resetDbSheets(): StateBuilder {
    this.state.customerSheetName = undefined;
    this.state.providerSheetName = undefined;
    return this;
  }

  private resetCustomerCells(): StateBuilder {
    this.state.customerSheet = [];
    this.state.customerIDCell = undefined;
    this.state.customerMarkCell = undefined;
    return this;
  }

  private resetProviderCells(): StateBuilder {
    this.state.providerSheet = [];
    this.state.providerIDCell = undefined;
    this.state.providerMarkCell = undefined;
    return this;
  }

  private resetOrder(): StateBuilder {
    this.resetOrderSheet();
    this.resetOrderCells();
    return this;
  }

  private resetOrderSheet(): StateBuilder {
    this.state.orderSheetName = undefined;
    return this;
  }

  private resetOrderCells(): StateBuilder {
    this.state.orderSheet = [];
    this.state.orderCustomerIDCell = undefined;
    this.state.orderProviderIDCell = undefined;
    this.state.orderTypeCell = undefined;
    this.state.orderLoadingDateCell = undefined;
    this.state.orderShippingDateCell = undefined;
    return this;
  }

  private computeActiveKeys(): StateBuilder {
    const set = new Set<string>();
    const state = { ...this.state };

    if (getFileStatus(state) !== 'success') {
      set.add('1');
    }
  
    if (getSheetStatus(state) === 'danger') {
      set.add('2');
    }

    if (getCustomerIDStatus(state) === 'danger') {
      set.add('3');
    }

    if (getProviderIDStatus(state) === 'danger') {
      set.add('4');
    }

    if (getOptionsStatus(state) === 'danger') {
      set.add('5');
    }

    if (getProjectionsStatus(state) === 'danger') {
      set.add('7');
    }

    this.state.activeKeys = set;
  
    return this;
  }

  private orderCellsToProjections(cells: string[]): Projection[] {
    return cells.map((name, index) => ({
      name,
      type: 'text',
      index
    }));
  }
}

export default StateBuilder;
