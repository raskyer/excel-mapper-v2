interface WorkBookAdaptor {
  getSheetNames(): string[];
  getSheet(sheetName: string): any[][];
  download(fileName: string): void;
}

export default WorkBookAdaptor;
