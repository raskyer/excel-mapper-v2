import State from 'src/entities/State';
import Action from 'src/entities/Action';

import * as C from './constants';
import StateBuilder, { INITIAL_STATE } from './StateBuilder';

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case C.DB_FILE_CHANGE:
      return new StateBuilder(state)
        .setWorkbook(action.payload)
        .build();
    case C.ORDER_FILE_CHANGE:
      return new StateBuilder(state)
        .setOrderWorkbook(action.payload)
        .build();
    case C.CUSTOMER_SHEET_CHANGE:
      return new StateBuilder(state)
        .setCustomerSheetName(action.payload)
        .build();
    case C.PROVIDER_SHEET_CHANGE:
      return new StateBuilder(state)
        .setProviderSheetName(action.payload)
        .build();
    case C.ORDER_SHEET_CHANGE:
      return new StateBuilder(state)
        .setOrderSheetName(action.payload)
        .build();
    case C.CUSTOMER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setCustomerIDCell(action.payload)
        .build();
    case C.PROVIDER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setProviderIDCell(action.payload)
        .build();
    case C.ORDER_CUSTOMER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderCustomerIDCell(action.payload)
        .build();
    case C.ORDER_PROVIDER_ID_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderProviderIDCell(action.payload)
        .build();
    case C.ORDER_TYPE_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderTypeCell(action.payload)
        .build();
    case C.ORDER_LOADING_DATE_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderLoadingDateCell(action.payload)
        .build();
    case C.ORDER_SHIPPING_DATE_CELL_CHANGE:
      return new StateBuilder(state)
        .setOrderShippingDateCell(action.payload)
        .build();
    case C.CUSTOMER_MARK_CELL_CHANGE:
      return new StateBuilder(state)
        .setCustomerMarkCell(action.payload)
        .build();
    case C.PROVIDER_MARK_CELL_CHANGE:
      return new StateBuilder(state)
        .setProviderMarkCell(action.payload)
        .build();
    case C.CUSTOMER_MARK_RATE_CHANGE:
      return new StateBuilder(state)
        .setCustomerMarkRate(action.payload)
        .build();
    case C.PROVIDER_MARK_RATE_CHANGE:
      return new StateBuilder(state)
        .setProviderMarkRate(action.payload)
        .build();
    case C.DATE_MARK_RATE_CHANGE:
      return new StateBuilder(state)
        .setDateMarkRate(action.payload)
        .build();
    case C.EVENT_KEY_TOGGLE:
      return new StateBuilder(state)
        .toggleEventKey(action.payload)
        .build();
    case C.PROJECTION_ADD:
      return new StateBuilder(state)
        .addProjection(action.payload)
        .build();
    case C.PROJECTION_REMOVE:
      return new StateBuilder(state)
        .removeProjection(action.payload)
        .build();
    case C.PROJECTION_UP:
      return new StateBuilder(state)
        .upProjection(action.payload)
        .build();
    case C.PROJECTION_DOWN:
      return new StateBuilder(state)
        .downProjection(action.payload)
        .build();
    case C.PROJECTION_ADD_ALL:
      return new StateBuilder(state)
        .addAllProjection()
        .build();
    case C.PROJECTION_REMOVE_ALL:
      return new StateBuilder(state)
        .removeAllProjection()
        .build();
    default:
      return state;
  }
};

export default AppReducer;
