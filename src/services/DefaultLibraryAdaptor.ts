import LibraryAdaptor from 'src/entities/LibraryAdaptor';
import ExceljsLibraryAdaptor from './Exceljs';

const DefaultLibraryAdaptor: LibraryAdaptor = new ExceljsLibraryAdaptor();

export const parseFile = DefaultLibraryAdaptor.parseFile;
export const createWorkBook = DefaultLibraryAdaptor.createWorkbook;
