interface LocatorEntity {
  element: string;
  index: number;
}

class Locator {
  CUSTOMER_SHEET = 'sheet::customer';
  CUSTOMER_ID = 'cell::id::customer';
  CUSTOMER_MARK = 'cell::mark::customer';

  PROVIDER_SHEET = 'sheet::provider';
  PROVIDER_ID = 'cell::id::provider';
  PROVIDER_MARK = 'cell::mark::provider';

  ORDER_SHEET = 'sheet::order';
  ORDER_TYPE = 'cell::type::order';
  ORDER_CUSTOMER_ID = 'cell::id::customer::order';
  ORDER_PROVIDER_ID = 'cell::id::provider::order';
  ORDER_DATE_SHIPPING = 'cell::date::shipping::order';
  ORDER_DATE_DELIVERY = 'cell::date::delivery::order';

  CUSTOMER_RATE = 'rate::customer';
  PROVIDER_RATE = 'rate::provider';
  DATE_RATE = 'rate::date';

  DEFAULT_KEYS = {
    [this.CUSTOMER_SHEET]: 'Client',
    [this.CUSTOMER_ID]: 'ID',
    [this.CUSTOMER_MARK]: 'Niveau',
    [this.PROVIDER_SHEET]: 'Transporteur',
    [this.PROVIDER_ID]: 'ID',
    [this.PROVIDER_MARK]: 'Note',
    [this.ORDER_SHEET]: '',
    [this.ORDER_TYPE]: 'Type',
    [this.ORDER_CUSTOMER_ID]: 'N° Client',
    [this.ORDER_PROVIDER_ID]: 'N° Four',
    [this.ORDER_DATE_SHIPPING]: 'Date Charg.',
    [this.ORDER_DATE_DELIVERY]: 'Date Livr.'
  };

  DEFAULT_RATES = {
    [this.CUSTOMER_RATE]: 1,
    [this.PROVIDER_RATE]: 1,
    [this.DATE_RATE]: 1
  };

  findSheet(arr: string[], key: string): string | undefined {
    return this._findElement(arr, key);
  }

  findCell(arr: string[], key: string): number | undefined {
    return this._findIndex(arr, key);
  }

  findRate(key: string): number {
    const token = localStorage.getItem(key);
    if (!token) {
      this.save(key, this.DEFAULT_KEYS[key]);
      return this.DEFAULT_RATES[key];
    }
    return parseInt(token, 10);
  }

  save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  get(key: string): string | undefined {
    const token = localStorage.getItem(key);
    if (!token) {
      this.save(key, this.DEFAULT_KEYS[key]);
      return this.DEFAULT_KEYS[key];
    }
    return token;
  }

  find(arr: string[], dict: string): LocatorEntity | undefined {
    return arr.reduce((p: LocatorEntity | undefined, c, i) => {
      if (p !== undefined) return p;
      if (c.indexOf(dict) !== -1) return { element: c, index: i };
      return undefined;
    }, undefined);
  }

  private _findElement(arr: string[], key: string): string | undefined {
    const match = this._findKey(arr, key);
    return match !== undefined ? match.element : undefined;
  }

  private _findIndex(arr: string[], key: string): number | undefined {
    const match = this._findKey(arr, key);
    return match !== undefined ? match.index : undefined;
  }

  private _findKey(arr: string[], key: string): LocatorEntity | undefined {
    const token = this.get(key);
    if (token === undefined) {
      return undefined;
    }
    return this.find(arr, token);
  }
}

export default new Locator();
