import LibraryAdaptor from '../entities/LibraryAdaptor';

import SheetjsLibraryAdaptor from './Sheetjs';
import ExceljsLibraryAdaptor from './Exceljs';

const createSheetjs = (): LibraryAdaptor => new SheetjsLibraryAdaptor();
const createExceljs = (): LibraryAdaptor => new ExceljsLibraryAdaptor();

export const DefaultLibraryAdaptor = createExceljs();
