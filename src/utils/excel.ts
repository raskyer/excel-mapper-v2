import XLSX from 'xlsx';

export function parseFile(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      resolve(workbook);
    };
  
    reader.readAsArrayBuffer(file);
  });
}

export function parseSheet(sheet: XLSX.WorkSheet): any[] {
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

export function createWorkbook(data: any[]) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille 1');
  return workbook;
}

export function downloadWorkbook(workbook: XLSX.WorkBook) {
  XLSX.writeFile(workbook, 'out.xlsx', { bookType:'xlsx', bookSST:false, type:'array' });
}
