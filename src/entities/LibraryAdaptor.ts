import WorkBookAdaptor from './WorkbookAdaptor';
import RankedOrder from './RankedOrder';

interface LibraryAdaptor {
  parseFile(file: File): Promise<WorkBookAdaptor>;
  createWorkbook(headers: string[], rankedOrder: RankedOrder[]): WorkBookAdaptor;
}

export default LibraryAdaptor;
