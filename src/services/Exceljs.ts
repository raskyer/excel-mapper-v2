import Excel from 'exceljs';
import FileSaver from 'file-saver';

import LibraryAdaptor from 'src/entities/LibraryAdaptor';
import WorkBookAdaptor from 'src/entities/WorkBookAdaptor';
import RankedOrder from 'src/entities/RankedOrder';

const TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

class ExceljsWorkBookAdaptor implements WorkBookAdaptor {
  constructor(private readonly workbook: Excel.Workbook) {
    if (this.workbook === undefined) {
      throw new Error('Workbook is required');
    }
  }

  getSheetNames(): string[] {
    return this.workbook.worksheets.map(sheet => sheet.name);
  }
  
  getSheet(sheetName: string): any[][] {
    const sheet = this.workbook.getWorksheet(sheetName);
    if (sheet === undefined) {
      throw new Error(`Sheet with name ${sheetName} does not exist`);
    }
    const data: any[][] = [];
    sheet.eachRow(row => {
      const values = row.values as Excel.CellValue[];
      if (values.length > 1) {
        data.push(values.slice(1, values.length));
      }
    });
    return data;
  }

  download(fileName: string): void {
    this.workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: TYPE }); 
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
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
          resolve(new ExceljsWorkBookAdaptor(workbook));
        });
      };
    
      reader.readAsArrayBuffer(file);
    });
  }

  createWorkbook(headers: string[], rankedOrders: RankedOrder[]): WorkBookAdaptor {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Suivi');

    worksheet.columns = headers.map(header => ({
      header,
      key: header.trim().toLowerCase(),
      width: 30
    }));

    const headerRow = worksheet.getRow(1);
    for (let i = 1; i <= headers.length; i++) {
      const cell = headerRow.getCell(i);
      const border: Partial<Excel.Border> = {
        style: 'thin',
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
