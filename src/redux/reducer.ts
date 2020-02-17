import State from '../entities/State';
import Action from '../entities/Action';

import {
  DB_FILE_CHANGE,
  ORDER_FILE_CHANGE,
  CUSTOMER_SHEET_CHANGE,
  PROVIDER_SHEET_CHANGE,
  ORDER_SHEET_CHANGE,
  CUSTOMER_ID_CELL_CHANGE,
  PROVIDER_ID_CELL_CHANGE,
  ORDER_CUSTOMER_ID_CELL_CHANGE,
  ORDER_PROVIDER_ID_CELL_CHANGE,
  ORDER_TYPE_CELL_CHANGE,
  ORDER_SHIPPING_DATE_CELL_CHANGE,
  ORDER_DELIVERY_DATE_CELL_CHANGE,
  CUSTOMER_MARK_CELL_CHANGE,
  PROVIDER_MARK_CELL_CHANGE,
  CUSTOMER_MARK_RATE_CHANGE,
  PROVIDER_MARK_RATE_CHANGE,
  DATE_MARK_RATE_CHANGE,
  EVENT_KEY_TOGGLE
} from './constants';

import StateBuilder from './StateBuilder';

const INITIAL_STATE: State = {
  customerMarkRate: 1,
  providerMarkRate: 1,
  dateMarkRate: 1,
  activeKeys: new Set<string>().add('1')
};

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case DB_FILE_CHANGE:
      return new StateBuilder(state)
        .setWorkbook(action.payload)
        .build();
    case ORDER_FILE_CHANGE:
      return new StateBuilder(state)
        .setOrderWorkbook(action.payload)
        .build();
    case CUSTOMER_SHEET_CHANGE:
      return new StateBuilder(state)
        .setCustomerSheetName(action.payload)
        .build();
    case PROVIDER_SHEET_CHANGE:
      return new StateBuilder(state)
        .setProviderSheetName(action.payload)
        .build();
    case ORDER_SHEET_CHANGE:
      return new StateBuilder(state)
        .setOrderSheetName(action.payload)
        .build();
    case CUSTOMER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setCustomerIDCell(action.payload)
        .build();
    case PROVIDER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setProviderIDCell(action.payload)
        .build();
    case ORDER_CUSTOMER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderCustomerIDCell(action.payload)
        .build();
    case ORDER_PROVIDER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderProviderIDCell(action.payload)
        .build();
    case ORDER_TYPE_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderTypeCell(action.payload)
        .build();
    case ORDER_SHIPPING_DATE_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderShippingDateCell(action.payload)
        .build();
    case ORDER_DELIVERY_DATE_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderDeliveryDateCell(action.payload)
        .build();
    case CUSTOMER_MARK_CELL_CHANGE:
      return new StateBuilder(state)
        .setCustomerMarkCell(action.payload)
        .build();
    case PROVIDER_MARK_CELL_CHANGE:
      return new StateBuilder(state)
        .setProviderMarkCell(action.payload)
        .build();
    case CUSTOMER_MARK_RATE_CHANGE:
      return new StateBuilder(state)
        .setCustomerMarkRate(action.payload)
        .build();
    case PROVIDER_MARK_RATE_CHANGE:
      return new StateBuilder(state)
        .setProviderMarkRate(action.payload)
        .build();
    case DATE_MARK_RATE_CHANGE:
      return new StateBuilder(state)
        .setDateMarkRate(action.payload)
        .build();
    case EVENT_KEY_TOGGLE:
      return new StateBuilder(state)
        .toggleEventKey(action.payload)
        .build();
    default:
      return state;
  }
};

export default AppReducer;
