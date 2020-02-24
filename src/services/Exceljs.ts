import Excel from 'exceljs';
import FileSaver from 'file-saver';

import LibraryAdaptor from 'src/entities/LibraryAdaptor';
import WorkBookAdaptor from 'src/entities/WorkbookAdaptor';
import RankedOrder from 'src/entities/RankedOrder';

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
    sheet.eachRow(row => {
      if (row.values instanceof Array && row.values.length > 1) {
        values.push(row.values.slice(1, row.values.length));
      }
    });
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

    const headerRow = worksheet.getRow(1);
    for (let i = 1; i <= headers.length; i++) {
      const cell = headerRow.getCell(i);
      const border: any = {
        style: 'medium',
        color: {
          argb: 'FF000000'
        }
      };
      cell.font = {
        color: {
          argb: 'FFFFFFFF'
        }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFFF0000'
        }
      };
      cell.border = {
        top: border,
        bottom: border,
        left: border,
        right: border
      };
    }

    rankedOrders.forEach(rankedOrder => {
      worksheet.addRow(rankedOrder.projection);
    });

    return new ExceljsWorkBookAdaptor(workbook);
  }
}

export default ExceljsLibraryAdaptor;
