import { WorkBook } from 'xlsx';

import State from '../entities/State';
import Locator from '../utils/locator';

import {
  getDbSheetNames,
  getOrderSheetNames,
  getCustomerCells,
  getProviderCells,
  getOrderCells,
  getFileStatus,
  getSheetStatus,
  getCustomerIDStatus,
  getProviderIDStatus
} from './selectors';

class StateBuilder {
  private state: State;
  private hasToCompute: boolean;

  constructor(state: State) {
    this.state = {
      ...state
    };
    this.hasToCompute = false;
  }

  setWorkbook(workbook?: WorkBook): StateBuilder {
    this.state.dbWorkbook = workbook;

    if (workbook === undefined) {
      return this.resetDb();
    }
    
    const sheetsNames = getDbSheetNames({ ...this.state });
    const customerSheetName = Locator.findSheet(sheetsNames, Locator.CUSTOMER_SHEET);
    const providerSheetName = Locator.findSheet(sheetsNames, Locator.PROVIDER_SHEET);

    this.setCustomerSheetName(customerSheetName);
    this.setProviderSheetName(providerSheetName);
    this.hasToCompute = true;

    return this;
  }

  setOrderWorkbook(workbook?: WorkBook): StateBuilder {
    this.state.orderWorkbook = workbook;

    if (workbook === undefined) {
      return this.resetOrder();
    }

    const sheetsNames = getOrderSheetNames({ ...this.state });
    const orderSheetName = Locator.findSheet(sheetsNames, Locator.ORDER_SHEET);

    this.setOrderSheetName(orderSheetName);
    this.hasToCompute = true;

    return this;
  }

  setCustomerSheetName(customerSheetName?: string): StateBuilder {
    this.state.customerSheetName = customerSheetName;

    if (customerSheetName === undefined) {
      return this.resetCustomerCells();
    }

    Locator.save(Locator.CUSTOMER_SHEET, customerSheetName);
    const customerCells = getCustomerCells({ ...this.state });

    this.state.customerIDCell = Locator.findCell(customerCells, Locator.CUSTOMER_ID);
    this.state.customerMarkCell = Locator.findCell(customerCells, Locator.CUSTOMER_MARK);
    this.hasToCompute = true;

    return this;
  }

  setProviderSheetName(providerSheetName?: string): StateBuilder {
    this.state.providerSheetName = providerSheetName;

    if (providerSheetName === undefined) {
      return this.resetProviderCells();
    }

    Locator.save(Locator.PROVIDER_SHEET, providerSheetName);
    const providerCells = getProviderCells({ ...this.state });

    this.state.providerIDCell = Locator.findCell(providerCells, Locator.PROVIDER_ID);
    this.state.providerMarkCell = Locator.findCell(providerCells, Locator.PROVIDER_MARK);
    this.hasToCompute = true;

    return this;
  }

  setOrderSheetName(orderSheetName?: string): StateBuilder {
    this.state.orderSheetName = orderSheetName;

    if (orderSheetName === undefined) {
      return this.resetOrderCells();
    }

    Locator.save(Locator.ORDER_SHEET, orderSheetName);
    const orderCells = getOrderCells({ ...this.state });

    this.state.orderCustomerIDCell = Locator.findCell(orderCells, Locator.ORDER_CUSTOMER_ID);
    this.state.orderProviderIDCell = Locator.findCell(orderCells, Locator.ORDER_PROVIDER_ID);
    this.state.orderTypeCell = Locator.findCell(orderCells, Locator.ORDER_TYPE);
    this.state.orderShippingDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_SHIPPING);
    this.state.orderDeliveryDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_DELIVERY);
    this.state.projection = new Set<string>(orderCells);
    this.hasToCompute = true;

    return this;
  }

  setCustomerIDCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.customerIDCell = undefined;
      return this;
    }
    this.state.customerIDCell = parseInt(str, 10);
    const cells = getCustomerCells(this.state);
    Locator.save(Locator.CUSTOMER_ID, cells[this.state.customerIDCell]);
    return this;
  }

  setProviderIDCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.providerIDCell = undefined;
      return this;
    }
    this.state.providerIDCell = parseInt(str, 10);
    const cells = getProviderCells(this.state);
    Locator.save(Locator.PROVIDER_ID, cells[this.state.providerIDCell]);
    return this;
  }

  setOrderCustomerIDCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.orderCustomerIDCell = undefined;
      return this;
    }
    this.state.orderCustomerIDCell = parseInt(str, 10);
    const cells = getOrderCells(this.state);
    Locator.save(Locator.ORDER_CUSTOMER_ID, cells[this.state.orderCustomerIDCell]);
    return this;
  }

  setOrderProviderIDCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.orderProviderIDCell = undefined;
      return this;
    }
    this.state.orderProviderIDCell = parseInt(str, 10);
    const cells = getOrderCells(this.state);
    Locator.save(Locator.ORDER_PROVIDER_ID, cells[this.state.orderProviderIDCell]);
    return this;
  }

  setOrderTypeCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.orderTypeCell = undefined;
      return this;
    }
    this.state.orderTypeCell = parseInt(str, 10);
    const cells = getOrderCells(this.state);
    Locator.save(Locator.ORDER_TYPE, cells[this.state.orderTypeCell]);
    return this;
  }

  setOrderShippingDateCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.orderShippingDateCell = undefined;
      return this;
    }
    this.state.orderShippingDateCell = parseInt(str, 10);
    const cells = getOrderCells(this.state);
    Locator.save(Locator.CUSTOMER_ID, cells[this.state.orderShippingDateCell]);
    return this;
  }

  setOrderDeliveryDateCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.orderDeliveryDateCell = undefined;
      return this;
    }
    this.state.orderDeliveryDateCell = parseInt(str, 10);
    const cells = getOrderCells(this.state);
    Locator.save(Locator.CUSTOMER_ID, cells[this.state.orderDeliveryDateCell]);
    return this;
  }

  setCustomerMarkCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.customerMarkCell = undefined;
      return this;
    }
    this.state.customerMarkCell = parseInt(str, 10);
    const cells = getCustomerCells(this.state);
    Locator.save(Locator.CUSTOMER_ID, cells[this.state.customerMarkCell]);
    return this;
  }

  setProviderMarkCell(str?: string): StateBuilder {
    if (str === undefined) {
      this.state.providerMarkCell = undefined;
      return this;
    }
    this.state.providerMarkCell = parseInt(str, 10);
    const cells = getProviderCells(this.state);
    Locator.save(Locator.CUSTOMER_ID, cells[this.state.providerMarkCell]);
    return this;
  }

  setCustomerMarkRate(str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }
    this.state.customerMarkRate = rate;
    Locator.save(Locator.CUSTOMER_RATE, rate.toString());
    return this;
  }

  setProviderMarkRate(str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }
    this.state.providerMarkRate = rate;
    Locator.save(Locator.PROVIDER_RATE, rate.toString());
    return this;
  }

  setDateMarkRate(str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }
    this.state.dateMarkRate = rate;
    Locator.save(Locator.DATE_RATE, rate.toString());
    return this;
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

  toggleProjectionCell(cell: string): StateBuilder {
    const projection = new Set(this.state.projection);
    if (projection.has(cell)) {
      projection.delete(cell);
    } else {
      projection.add(cell);
    }
    this.state.projection = projection;
    return this;
  }

  build(): State {
    if (this.hasToCompute) {
      this.computeActiveKeys();
    }
    return this.state;
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
    this.state.orderShippingDateCell = undefined;
    this.state.orderDeliveryDateCell = undefined;
    return this;
  }

  private computeActiveKeys(): StateBuilder {
    const set = new Set<string>();

    if (getFileStatus({ ...this.state }) !== 'success') {
      set.add('1');
    }
  
    if (getSheetStatus({ ...this.state }) === 'danger') {
      set.add('2');
    }

    if (getCustomerIDStatus(this.state) === 'danger') {
      set.add('3');
    }

    if (getProviderIDStatus(this.state) === 'danger') {
      set.add('4');
    }

    this.state.activeKeys = set;
  
    return this;
  }
}

export default StateBuilder;
