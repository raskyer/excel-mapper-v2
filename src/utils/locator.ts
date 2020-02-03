interface LocatorEntity {
  element: string;
  index: number;
}

class Locator {
  CUSTOMER_SHEET = 'customerSheet';
  CUSTOMER_ID = 'customerID';
  CUSTOMER_RATING = 'customerRating';

  PROVIDER_SHEET = 'providerSheet';
  PROVIDER_ID = 'providerID';
  PROVIDER_RATING = 'providerRating';

  ORDER_SHEET = 'orderSheet';
  ORDER_TYPE = 'orderType';
  ORDER_CUSTOMER_ID = 'orderCustomerID';
  ORDER_PROVIDER_ID = 'orderProviderID';
  ORDER_DATE_SHIPPING = 'orderDateShipping';
  ORDER_DATE_DELIVERY = 'orderDateDelivery';

  PROVIDER_RATE = 'providerRate';
  DATE_RATE = 'dateRate';
  CUSTOMER_RATE = 'customerRate';

  DEFAULT_KEYS = {
    [this.CUSTOMER_SHEET]: 'Client',
    [this.CUSTOMER_ID]: 'ID',
    [this.CUSTOMER_RATING]: 'Niveau',
    [this.PROVIDER_SHEET]: 'Transporteur',
    [this.PROVIDER_ID]: 'ID',
    [this.PROVIDER_RATING]: 'Note',
    [this.ORDER_SHEET]: '',
    [this.ORDER_TYPE]: 'Type',
    [this.ORDER_CUSTOMER_ID]: 'N° Client',
    [this.ORDER_PROVIDER_ID]: 'N° Four',
    [this.ORDER_DATE_SHIPPING]: 'Date Charg.',
    [this.ORDER_DATE_DELIVERY]: 'Date Livr.'
  };

  findSheet(arr: string[], key: string): string | undefined {
    return this._findElement(arr, key);
  }

  findCell(arr: string[], key: string): number | undefined {
    return this._findIndex(arr, key);
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
