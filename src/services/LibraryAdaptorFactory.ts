import LibraryAdaptor from 'src/entities/LibraryAdaptor';

import ExceljsLibraryAdaptor from './Exceljs';

const createExceljs = (): LibraryAdaptor => new ExceljsLibraryAdaptor();

export const DefaultLibraryAdaptor = createExceljs();
