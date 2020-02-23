interface WorkBookAdaptor {
  getSheetNames(): string[];
  getSheet(sheetName: string): any[][];
  download(): void;
}

export default WorkBookAdaptor;
