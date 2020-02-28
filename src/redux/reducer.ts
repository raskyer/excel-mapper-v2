import State from 'src/entities/State';
import Action, { ActionFile, ActionString, ActionNumber } from 'src/entities/Action';

import * as C from './constants';
import StateBuilder, { INITIAL_STATE } from './StateBuilder';

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case C.FILE_CHANGE.DB:
      return new StateBuilder(state)
        .setWorkbook((action as ActionFile).payload)
        .build();
    case C.FILE_CHANGE.ORDER:
      return new StateBuilder(state)
        .setOrderWorkbook((action as ActionFile).payload)
        .build();
    case C.SHEET_NAME_CHANGE.CUSTOMER:
      return new StateBuilder(state)
        .setCustomerSheetName((action as ActionString).payload)
        .build();
    case C.SHEET_NAME_CHANGE.PROVIDER:
      return new StateBuilder(state)
        .setProviderSheetName((action as ActionString).payload)
        .build();
    case C.SHEET_NAME_CHANGE.ORDER:
      return new StateBuilder(state)
        .setOrderSheetName((action as ActionString).payload)
        .build();
    case C.CELL_CHANGE.CUSTOMER_ID:
      return new StateBuilder(state)
        .setCustomerIDCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.PROVIDER_ID:
      return new StateBuilder(state)
        .setProviderIDCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.ORDER_CUSTOMER_ID:
      return new StateBuilder(state)
        .setOrderCustomerIDCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.ORDER_PROVIDER_ID:
      return new StateBuilder(state)
        .setOrderProviderIDCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.ORDER_TYPE:
      return new StateBuilder(state)
        .setOrderTypeCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.ORDER_LOADING_DATE:
      return new StateBuilder(state)
        .setOrderLoadingDateCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.ORDER_SHIPPING_DATE:
      return new StateBuilder(state)
        .setOrderShippingDateCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.CUSTOMER_MARK:
      return new StateBuilder(state)
        .setCustomerMarkCell((action as ActionNumber).payload)
        .build();
    case C.CELL_CHANGE.PROVIDER_MARK:
      return new StateBuilder(state)
        .setProviderMarkCell((action as ActionNumber).payload)
        .build();
    case C.RATE_CHANGE.CUSTOMER:
      return new StateBuilder(state)
        .setCustomerMarkRate((action as ActionNumber).payload)
        .build();
    case C.RATE_CHANGE.PROVIDER:
      return new StateBuilder(state)
        .setProviderMarkRate((action as ActionNumber).payload)
        .build();
    case C.RATE_CHANGE.DATE:
      return new StateBuilder(state)
        .setDateMarkRate((action as ActionNumber).payload)
        .build();
    case C.PROJECTION.ADD:
      return new StateBuilder(state)
        .addProjection((action as ActionString).payload)
        .build();
    case C.PROJECTION.REMOVE:
      return new StateBuilder(state)
        .removeProjection((action as ActionNumber).payload)
        .build();
    case C.PROJECTION.UP:
      return new StateBuilder(state)
        .upProjection((action as ActionNumber).payload)
        .build();
    case C.PROJECTION.DOWN:
      return new StateBuilder(state)
        .downProjection((action as ActionNumber).payload)
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
