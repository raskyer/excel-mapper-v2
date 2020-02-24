import Excel from 'exceljs';
import FileSaver from 'file-saver';

import LibraryAdaptor from "../entities/LibraryAdaptor";
import WorkBookAdaptor from "../entities/WorkbookAdaptor";
import RankedOrder from '../entities/RankedOrder';

const TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

class ExceljsWorkBookAdaptor implements WorkBookAdaptor {
  constructor(private readonly workbook: Excel.Workbook) {}

  getSheetNames(): string[] {
    return this.workbook.worksheets.map(sheet => sheet.name);
  }
  
  getSheet(sheetName: string): any[][] {
    const sheet = this.workbook.getWorksheet(sheetName);
    if (sheet === undefined) {
      throw new Error(`Sheet with name ${sheetName} does not exist`);
    }
    const values: any[] = [];
    sheet.eachRow(row => values.push(row.values));
    return values;
  }

  download(): void {
    this.workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: TYPE }); 
      FileSaver.saveAs(blob, 'test.xlsx');
    });
  }
}

class ExceljsLibraryAdaptor implements LibraryAdaptor {
  parseFile(file: File): Promise<WorkBookAdaptor> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const workbook = new Excel.Workbook();
        workbook.xlsx.load(e.target.result).then(() => {
          resolve(new ExceljsWorkBookAdaptor(workbook)); // TODO : Handle dates
        });
      };
    
      reader.readAsArrayBuffer(file);
    });
  }

  createWorkbook(headers: string[], rankedOrders: RankedOrder[]): WorkBookAdaptor {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('test');

    worksheet.columns = headers.map(header => ({
      header,
      key: header.trim().toLowerCase(),
      width: 30
    }));

    // TODO : only take appropriate cell
    const headerRow = worksheet.getRow(1);
    headerRow.font = {
      color: {
        argb: 'FFFFFFFF'
      }
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FFFF0000'
      }
    };
    headerRow.border = {
      top: {
        style: 'double',
        color: {
          argb: 'FF000000'
        }
      },
      bottom: {
        style: 'double',
        color: {
          argb: 'FF000000'
        }
      },
      left: {
        style: 'double',
        color: {
          argb: 'FF000000'
        }
      },
      right: {
        style: 'double',
        color: {
          argb: 'FF000000'
        }
      }
    };

    rankedOrders.forEach(rankedOrder => {
      worksheet.addRow(rankedOrder.order);
    });

    return new ExceljsWorkBookAdaptor(workbook);
  }
}

export default ExceljsLibraryAdaptor;
