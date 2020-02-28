import { FILE_CHANGE, SHEET_NAME_CHANGE, CELL_CHANGE, RATE_CHANGE, PROJECTION } from '../redux/constants';
import WorkBookAdaptor from './WorkbookAdaptor';

export interface ActionFile {
  type: FILE_CHANGE;
  payload: WorkBookAdaptor;
}

export interface ActionString {
  type: SHEET_NAME_CHANGE | PROJECTION.ADD;
  payload: string;
}

export interface ActionNumber {
  type: CELL_CHANGE | RATE_CHANGE | Omit<PROJECTION, PROJECTION.ADD>;
  payload: number; 
}

type Action = ActionFile | ActionString | ActionNumber;

export default Action;
