import State from '../entities/State';
import Action from '../entities/Action';

import { MERGE } from './constants';

const INITIAL_STATE: State = {
  customerMarkRate: 1,
  providerMarkRate: 1,
  dateMarkRate: 1,
  activeKeys: new Set<string>().add('1')
};

const AppReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case MERGE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
};

export default AppReducer;
