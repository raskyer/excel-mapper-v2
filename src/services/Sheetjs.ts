import XLSX from 'xlsx';

import LibraryAdaptor from "../entities/LibraryAdaptor";
import WorkBookAdaptor from "../entities/WorkbookAdaptor";
import RankedOrder from '../entities/RankedOrder';

class SheetjsWorkBookAdaptor implements WorkBookAdaptor {
  constructor(private readonly workbook: XLSX.WorkBook) {}

  getSheetNames(): string[] {
    return this.workbook.SheetNames;
  }
  
  getSheet(sheetName: string): any[][] {
    const sheet = this.workbook.Sheets[sheetName];
    if (sheet === undefined) {
      throw new Error(`Sheet with name ${sheetName} does not exist`);
    }
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
  }

  download(): void {
    XLSX.writeFile(this.workbook, 'out.xlsx', {
      bookType:'xlsx',
      bookSST:false,
      type:'array'
    });
  }
}

class SheetjsLibraryAdaptor implements LibraryAdaptor {
  parseFile(file: File): Promise<WorkBookAdaptor> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        resolve(new SheetjsWorkBookAdaptor(workbook));
      };
    
      reader.readAsArrayBuffer(file);
    });
  }

  createWorkbook(headers: string[], rankedOrders: RankedOrder[]): WorkBookAdaptor {
    const data = rankedOrders.map(ro => ro.order);
    data.unshift(headers);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille 1');

    return new SheetjsWorkBookAdaptor(workbook);
  }
}

export default SheetjsLibraryAdaptor;
