import WorkBookAdaptor from '../entities/WorkbookAdaptor';
import State, { StateCell, StateRate } from '../entities/State';

import Locator, { LocatorKey } from '../services/Locator';

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
  getProjectionStatus
} from './selectors';

export const INITIAL_STATE: State = {
  customerMarkRate: Locator.findRate(LocatorKey.CUSTOMER_RATE),
  providerMarkRate: Locator.findRate(LocatorKey.PROVIDER_RATE),
  dateMarkRate: Locator.findRate(LocatorKey.DATE_RATE),
  activeKeys: new Set<string>().add('1'),
  projection: Locator.findArray(LocatorKey.PROJECTION)
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
    const orderCells = getOrderCells({ ...this.state });

    this.state.orderCustomerIDCell = Locator.findCell(orderCells, LocatorKey.ORDER_CUSTOMER_ID);
    this.state.orderProviderIDCell = Locator.findCell(orderCells, LocatorKey.ORDER_PROVIDER_ID);
    this.state.orderTypeCell = Locator.findCell(orderCells, LocatorKey.ORDER_TYPE);
    this.state.orderLoadingDateCell = Locator.findCell(orderCells, LocatorKey.ORDER_LOADING_DATE);
    this.state.orderShippingDateCell = Locator.findCell(orderCells, LocatorKey.ORDER_SHIPPING_DATE);
    this.state.projection = this.state.projection.length > 0 ? this.state.projection : [...orderCells];
    this.hasToCompute = true;

    return this;
  }

  setCustomerIDCell(str?: string): StateBuilder {
    return this.setCell('customerIDCell', LocatorKey.CUSTOMER_ID, getCustomerCells(this.state), str);
  }

  setProviderIDCell(str?: string): StateBuilder {
    return this.setCell('providerIDCell', LocatorKey.PROVIDER_ID, getProviderCells(this.state), str);
  }

  setOrderCustomerIDCell(str?: string): StateBuilder {
    return this.setCell('orderCustomerIDCell', LocatorKey.ORDER_CUSTOMER_ID, getOrderCells(this.state), str);
  }

  setOrderProviderIDCell(str?: string): StateBuilder {
    return this.setCell('orderProviderIDCell', LocatorKey.ORDER_PROVIDER_ID, getOrderCells(this.state), str);
  }

  setOrderTypeCell(str?: string): StateBuilder {
    return this.setCell('orderTypeCell', LocatorKey.ORDER_TYPE, getOrderCells(this.state), str);
  }

  setOrderLoadingDateCell(str?: string): StateBuilder {
    return this.setCell('orderLoadingDateCell', LocatorKey.ORDER_LOADING_DATE, getOrderCells(this.state), str);
  }

  setOrderShippingDateCell(str?: string): StateBuilder {
    return this.setCell('orderShippingDateCell', LocatorKey.ORDER_SHIPPING_DATE, getOrderCells(this.state), str);
  }

  setCustomerMarkCell(str?: string): StateBuilder {
    return this.setCell('customerMarkCell', LocatorKey.CUSTOMER_MARK, getCustomerCells(this.state), str);
  }

  setProviderMarkCell(str?: string): StateBuilder {
    return this.setCell('providerMarkCell', LocatorKey.PROVIDER_MARK, getProviderCells(this.state), str);
  }

  setCustomerMarkRate(str: string): StateBuilder {
    return this.setRate('customerMarkRate', LocatorKey.CUSTOMER_RATE, str);
  }

  setProviderMarkRate(str: string): StateBuilder {
    return this.setRate('providerMarkRate', LocatorKey.PROVIDER_RATE, str);
  }

  setDateMarkRate(str: string): StateBuilder {
    return this.setRate('dateMarkRate', LocatorKey.DATE_RATE, str);
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

  addProjection(projection: string): StateBuilder {
    this.state.projection = [...this.state.projection, projection];
    this.state.results = undefined;
    Locator.saveArray(LocatorKey.PROJECTION, this.state.projection);
    return this;
  }

  removeProjection(index: number): StateBuilder {
    this.state.projection = this.state.projection.filter((_, i) => i !== index);
    this.state.results = undefined;
    Locator.saveArray(LocatorKey.PROJECTION, this.state.projection);
    return this;
  }

  upProjection(index: number): StateBuilder {
    if (index === 0) return this;
    const copy = [...this.state.projection];
    const tmp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = tmp;
    this.state.projection = copy;
    this.state.results = undefined;
    Locator.saveArray(LocatorKey.PROJECTION, this.state.projection);
    return this;
  }

  downProjection(index: number): StateBuilder {
    if (index >= this.state.projection.length - 1) return this;
    const copy = [...this.state.projection];
    const tmp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = tmp;
    this.state.projection = copy;
    this.state.results = undefined;
    Locator.saveArray(LocatorKey.PROJECTION, this.state.projection);
    return this;
  }

  addAllProjection(): StateBuilder {
    this.state.projection = [...getOrderCells(this.state)];
    this.state.results = undefined;
    Locator.saveArray(LocatorKey.PROJECTION, this.state.projection);
    return this;
  }

  removeAllProjection(): StateBuilder {
    this.state.projection = [];
    this.state.results = undefined;
    Locator.saveArray(LocatorKey.PROJECTION, this.state.projection);
    return this;
  }

  build(): State {
    if (this.hasToCompute) {
      this.computeActiveKeys();
    }
    return this.state;
  }

  private setCell(key: keyof StateCell, locatorKey: LocatorKey, cells: string[], str?: string): StateBuilder {
    if (str === undefined) {
      this.state[key] = undefined;
      return this;
    }

    const index = parseInt(str, 10);
    this.state[key] = index;
    Locator.save(locatorKey, cells[index]);
    
    return this;
  }

  private setRate(key: keyof StateRate, locatorKey: LocatorKey, str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }

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
    this.state.customerIDCell = undefined;
    this.state.customerMarkCell = undefined;
    return this;
  }

  private resetProviderCells(): StateBuilder {
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

    if (getProjectionStatus(state) === 'danger') {
      set.add('7');
    }

    this.state.activeKeys = set;
  
    return this;
  }
}

export default StateBuilder;
