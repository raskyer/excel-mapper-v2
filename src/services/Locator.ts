interface LocatorEntity {
  element: string;
  index: number;
}

export enum LocatorKey {
  CUSTOMER_SHEET = 'sheet::customer',
  CUSTOMER_ID = 'cell::id::customer',
  CUSTOMER_MARK = 'cell::mark::customer',
  PROVIDER_SHEET = 'sheet::provider',
  PROVIDER_ID = 'cell::id::provider',
  PROVIDER_MARK = 'cell::mark::provider',
  ORDER_SHEET = 'sheet::order',
  ORDER_TYPE = 'cell::type::order',
  ORDER_CUSTOMER_ID = 'cell::id::customer::order',
  ORDER_PROVIDER_ID = 'cell::id::provider::order',
  ORDER_LOADING_DATE = 'cell::date::loading::order',
  ORDER_SHIPPING_DATE = 'cell::date::shipping::order',
  CUSTOMER_RATE = 'rate::customer',
  PROVIDER_RATE = 'rate::provider',
  DATE_RATE = 'rate::date',
  PROJECTIONS = 'projections',
  LOCAL_CUSTOMER_SHEET = 'local::sheet::customer',
  LOCAL_PROVIDER_SHEET = 'local::sheet::provider'
}

class Locator {
  private readonly defaultKeys: Map<LocatorKey, string> = new Map();
  
  constructor() {
    this.defaultKeys.set(LocatorKey.CUSTOMER_SHEET, 'Client');
    this.defaultKeys.set(LocatorKey.CUSTOMER_ID, 'ID');
    this.defaultKeys.set(LocatorKey.CUSTOMER_MARK, 'Niveau');
    this.defaultKeys.set(LocatorKey.PROVIDER_SHEET, 'Transporteur');
    this.defaultKeys.set(LocatorKey.PROVIDER_ID, 'ID');
    this.defaultKeys.set(LocatorKey.PROVIDER_MARK, 'Note');
    this.defaultKeys.set(LocatorKey.ORDER_SHEET, '');
    this.defaultKeys.set(LocatorKey.ORDER_TYPE, 'Type');
    this.defaultKeys.set(LocatorKey.ORDER_CUSTOMER_ID, 'N° Client');
    this.defaultKeys.set(LocatorKey.ORDER_PROVIDER_ID, 'N° Four');
    this.defaultKeys.set(LocatorKey.ORDER_LOADING_DATE, 'Date Charg.');
    this.defaultKeys.set(LocatorKey.ORDER_SHIPPING_DATE, 'Date Livr.');
    this.defaultKeys.set(LocatorKey.CUSTOMER_RATE, '1');
    this.defaultKeys.set(LocatorKey.PROVIDER_RATE, '1');
    this.defaultKeys.set(LocatorKey.DATE_RATE, '1');
    this.defaultKeys.set(LocatorKey.PROJECTIONS, '[]');
    this.defaultKeys.set(LocatorKey.LOCAL_CUSTOMER_SHEET, '[]');
    this.defaultKeys.set(LocatorKey.LOCAL_PROVIDER_SHEET, '[]');
  }

  findSheet(arr: string[], key: LocatorKey): string | undefined {
    return this._findElement(arr, key);
  }

  findCell(arr: string[], key: LocatorKey): number | undefined {
    return this._findIndex(arr, key);
  }

  findRate(key: LocatorKey): number {
    return parseInt(this._getString(key), 10);
  }

  findArray<T>(key: LocatorKey): T[] {
    const token = this._getString(key);
    return JSON.parse(token);
  }

  save(key: LocatorKey, value: string): void {
    localStorage.setItem(key.toString(), value);
  }

  saveArray<T>(key: LocatorKey, value: T[]): void {
    this.save(key, JSON.stringify(value));
  }

  private _getString(key: LocatorKey): string {
    const token = localStorage.getItem(key.toString());
    if (token !== null) {
      return token;
    }
    const value = this.defaultKeys.get(key);
    if (value === undefined) {
      throw new Error('No default key for key ' + key);
    }
    this.save(key, value);
    return value;
  }

  private _findElement(arr: string[], key: LocatorKey): string | undefined {
    const match = this._findKey(arr, key);
    return match !== undefined ? match.element : undefined;
  }

  private _findIndex(arr: string[], key: LocatorKey): number | undefined {
    const match = this._findKey(arr, key);
    return match !== undefined ? match.index : undefined;
  }

  private _findKey(arr: string[], key: LocatorKey): LocatorEntity | undefined {
    const token = this._getString(key);
    return this._find(arr, token);
  }

  private _find(arr: string[], dict: string): LocatorEntity | undefined {
    return arr.reduce((p: LocatorEntity | undefined, c, i) => {
      if (p !== undefined) return p;
      if (c.indexOf(dict) !== -1) return { element: c, index: i };
      return undefined;
    }, undefined);
  }
}

export default new Locator();
