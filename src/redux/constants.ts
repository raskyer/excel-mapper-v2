export enum FILE_CHANGE {
  DB = 'change::file::db',
  ORDER = 'change::file::order'
}

export enum SHEET_NAME_CHANGE {
  CUSTOMER = 'change::sheet::customer',
  PROVIDER = 'change::sheet::provider',
  ORDER = 'change::sheet::order'
}

export enum CELL_CHANGE {
  CUSTOMER_ID = 'change::cell::id::customer',
  PROVIDER_ID = 'change::cell::id::provider',
  ORDER_CUSTOMER_ID = 'change::cell::id::customer::order',
  ORDER_PROVIDER_ID = 'change::cell::id::provider::order',
  ORDER_TYPE = 'change::cell::type::order',
  ORDER_LOADING_DATE = 'change::cell::date::loading::order',
  ORDER_SHIPPING_DATE = 'change::cell::date::shipping::order',
  CUSTOMER_MARK = 'change::cell::mark::customer',
  PROVIDER_MARK = 'change::cell::mark::provider'
}

export enum RATE_CHANGE {
  CUSTOMER = 'change::rate::mark::customer',
  PROVIDER = 'change::rate::mark::provider',
  DATE = 'change::rate::mark::date'
}

export enum PROJECTION {
  ADD = 'add::projection',
  REMOVE = 'remove::projection',
  UP = 'up::projection',
  DOWN = 'down::projection'
}

export const PROJECTION_ADD_ALL = 'add::all::projection';
export const PROJECTION_REMOVE_ALL = 'remove::all::projection';
