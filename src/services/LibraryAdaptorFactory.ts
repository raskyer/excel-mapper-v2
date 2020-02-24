import LibraryAdaptor from '../entities/LibraryAdaptor';

import ExceljsLibraryAdaptor from './Exceljs';

const createExceljs = (): LibraryAdaptor => new ExceljsLibraryAdaptor();

export const DefaultLibraryAdaptor = createExceljs();
