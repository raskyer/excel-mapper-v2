import WorkBookAdaptor from './WorkBookAdaptor';
import RankedOrder from './RankedOrder';

interface LibraryAdaptor {
  parseFile(file: File): Promise<WorkBookAdaptor>;
  createWorkbook(headers: string[], rankedOrders: RankedOrder[]): WorkBookAdaptor;
}

export default LibraryAdaptor;
