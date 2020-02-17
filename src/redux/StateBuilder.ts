import { WorkBook } from "xlsx";

import State from "../entities/State";
import Locator from '../utils/locator';

import { getCustomerCells, getProviderCells, getFileStatus, getSheetStatus, getOrderSheetNames, getDbSheetNames, getOrderCells } from "./selector";

class StateBuilder {
  private state: State;

  constructor(state: State) {
    this.state = {
      ...state
    };
  }

  setWorkbook(workbook?: WorkBook): StateBuilder {
    this.state.dbWorkbook = workbook;

    if (workbook === undefined) {
      return this.resetDb();
    }
    
    const sheetsNames = getDbSheetNames(this.state);
    const customerSheetName = Locator.findSheet(sheetsNames, Locator.CUSTOMER_SHEET);
    const providerSheetName = Locator.findSheet(sheetsNames, Locator.PROVIDER_SHEET);

    this.setCustomerSheetName(customerSheetName);
    this.setProviderSheetName(providerSheetName);

    return this;
  }

  setOrderWorkbook(workbook?: WorkBook): StateBuilder {
    this.state.orderWorkbook = workbook;

    if (workbook === undefined) {
      return this.resetOrder();
    }

    const sheetsNames = getOrderSheetNames(this.state);
    const orderSheetName = Locator.findSheet(sheetsNames, Locator.ORDER_SHEET);

    this.setOrderSheetName(orderSheetName);

    return this;
  }

  setCustomerSheetName(customerSheetName?: string): StateBuilder {
    this.state.customerSheetName = customerSheetName;

    if (customerSheetName === undefined) {
      return this.resetCustomerCells();
    }

    const customerCells = getCustomerCells(this.state);

    this.state.customerIDCell = Locator.findCell(customerCells, Locator.CUSTOMER_ID);
    this.state.customerMarkCell = Locator.findCell(customerCells, Locator.CUSTOMER_MARK);

    return this;
  }

  setProviderSheetName(providerSheetName?: string): StateBuilder {
    this.state.providerSheetName = providerSheetName;

    if (providerSheetName === undefined) {
      return this.resetProviderCells();
    }

    const providerCells = getProviderCells(this.state);

    this.state.providerIDCell = Locator.findCell(providerCells, Locator.PROVIDER_ID);
    this.state.providerMarkCell = Locator.findCell(providerCells, Locator.PROVIDER_MARK);

    return this;
  }

  setOrderSheetName(orderSheetName?: string): StateBuilder {
    this.state.orderSheetName = orderSheetName;

    if (orderSheetName === undefined) {
      return this.resetOrderCells();
    }

    const orderCells = getOrderCells(this.state);

    this.state.orderCustomerIDCell = Locator.findCell(orderCells, Locator.ORDER_CUSTOMER_ID);
    this.state.orderProviderIDCell = Locator.findCell(orderCells, Locator.ORDER_PROVIDER_ID);
    this.state.orderTypeCell = Locator.findCell(orderCells, Locator.ORDER_TYPE);
    this.state.orderShippingDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_SHIPPING);
    this.state.orderDeliveryDateCell = Locator.findCell(orderCells, Locator.ORDER_DATE_DELIVERY);

    return this;
  }

  setCustomerIDCell(str: string): StateBuilder {
    this.state.customerIDCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setProviderIDCell(str: string): StateBuilder {
    this.state.providerIDCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setOrderCustomerIDCell(str: string): StateBuilder {
    this.state.orderCustomerIDCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setOrderProviderIDCell(str: string): StateBuilder {
    this.state.orderProviderIDCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setOrderTypeCell(str: string): StateBuilder {
    this.state.orderTypeCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setOrderShippingDateCell(str: string): StateBuilder {
    this.state.orderShippingDateCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setOrderDeliveryDateCell(str: string): StateBuilder {
    this.state.orderDeliveryDateCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setCustomerMarkCell(str: string): StateBuilder {
    this.state.customerMarkCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setProviderMarkCell(str: string): StateBuilder {
    this.state.providerMarkCell = parseInt(str, 10);
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setCustomerMarkRate(str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }
    this.state.customerMarkRate = rate;
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setProviderMarkRate(str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }
    this.state.providerMarkRate = rate;
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
    return this;
  }

  setDateMarkRate(str: string): StateBuilder {
    let rate = parseInt(str, 10);
    if (isNaN(rate)) {
      rate = 0;
    }
    this.state.dateMarkRate = rate;
    //Locator.save(Locator.CUSTOMER_ID, this.state.customerIDCell);
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

  build(): State {
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
    const fileStatus = getFileStatus(this.state);
    if (fileStatus !== 'success') {
      this.state.activeKeys = new Set<string>().add('1');
    }
  
    const sheetStatus = getSheetStatus(this.state);
    if (sheetStatus !== 'success') {
      this.state.activeKeys = new Set<string>().add('2');
    }
  
    return this;
  }
}

export default StateBuilder;
