interface LocatorEntity {
  element: string;
  index: number;
}

enum LocatorKey {
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
  ORDER_DATE_LOADING = 'cell::date::loading::order',
  ORDER_DATE_SHIPPING = 'cell::date::shipping::order',
  CUSTOMER_RATE = 'rate::customer',
  PROVIDER_RATE = 'rate::provider',
  DATE_RATE = 'rate::date',
}

class Locator {
  public readonly CUSTOMER_SHEET = LocatorKey.CUSTOMER_SHEET;
  public readonly CUSTOMER_ID = LocatorKey.CUSTOMER_ID;
  public readonly CUSTOMER_MARK = LocatorKey.CUSTOMER_MARK;
  public readonly PROVIDER_SHEET = LocatorKey.PROVIDER_SHEET;
  public readonly PROVIDER_ID = LocatorKey.PROVIDER_ID;
  public readonly PROVIDER_MARK = LocatorKey.PROVIDER_MARK;
  public readonly ORDER_SHEET = LocatorKey.ORDER_SHEET;
  public readonly ORDER_TYPE = LocatorKey.ORDER_TYPE;
  public readonly ORDER_CUSTOMER_ID = LocatorKey.ORDER_CUSTOMER_ID;
  public readonly ORDER_PROVIDER_ID = LocatorKey.ORDER_PROVIDER_ID;
  public readonly ORDER_DATE_LOADING = LocatorKey.ORDER_DATE_LOADING;
  public readonly ORDER_DATE_SHIPPING = LocatorKey.ORDER_DATE_SHIPPING;

  public readonly CUSTOMER_RATE = LocatorKey.CUSTOMER_RATE;
  public readonly PROVIDER_RATE = LocatorKey.PROVIDER_RATE;
  public readonly DATE_RATE = LocatorKey.DATE_RATE;

  private readonly defaultKeys: Map<LocatorKey, string> = new Map();
  private readonly defaultRates: Map<LocatorKey, number> = new Map();
  
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
    this.defaultKeys.set(LocatorKey.ORDER_DATE_LOADING, 'Date Charg.');
    this.defaultKeys.set(LocatorKey.ORDER_DATE_SHIPPING, 'Date Livr.');

    this.defaultRates.set(LocatorKey.CUSTOMER_RATE, 1);
    this.defaultRates.set(LocatorKey.PROVIDER_RATE, 1);
    this.defaultRates.set(LocatorKey.DATE_RATE, 1);
  }

  findSheet(arr: string[], key: LocatorKey): string | undefined {
    return this._findElement(arr, key);
  }

  findCell(arr: string[], key: LocatorKey): number | undefined {
    return this._findIndex(arr, key);
  }

  findRate(key: LocatorKey): number {
    return this._getNumber(key);
  }

  save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private _getNumber(key: LocatorKey): number {
    const token = localStorage.getItem(key.toString());
    if (token !== null) {
      return parseInt(token, 10);
    }
    const value = this.defaultRates.get(key);
    if (value === undefined) {
      throw new Error('No default rate for key ' + key);
    }
    this.save(key, value.toString());
    return value;
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
