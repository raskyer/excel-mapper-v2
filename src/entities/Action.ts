import State from './State';

interface Action {
  type: string;
  payload: Partial<State>;
}

export default Action;
