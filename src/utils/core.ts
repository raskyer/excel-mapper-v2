import { parseSheet } from './excel';

const DEFAULT_PROJECTION = {
  'Type': 'Type',
  'Nom Client': 'Nom Client',
  'Nom Fourn.': 'Nom Transporteur',
  'Date Charg.': 'Date Chargement',
  'Date Livr.': 'Date Livraison',
  'CP Charg.': 'CP Chargement',
  'Ville Charg.': 'Ville Chargement',
  'CP Livr.': 'CP Livraison',
  'Ville Livr.': 'Ville Livraison',
  'État': 'Etat',
  'Dossier': 'Dossier',
  'Commentaires': 'Commentaires'
};

export function compute(settings, dbWorkbook, orderWorkbook) {
  const customerSheet = parseSheet(dbWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = parseSheet(dbWorkbook.Sheets[settings.providerSheet]);
  const orderSheet    = parseSheet(orderWorkbook.Sheets[settings.orderSheet]);

  const customerMap = createMap(customerSheet, settings.customerID);
  const providerMap = createMap(providerSheet, settings.providerID);

  const orders = createOrderRanking(customerMap, providerMap, orderSheet, settings);

  return createProjection(orders, orderSheet[0], DEFAULT_PROJECTION);
}

export function createMap(sheet: any[][], idCell: number): Map<string | number, any[]> {
  const map = new Map();
  for (let i = 1; i < sheet.length; i++) {
    let id = sheet[i][idCell];
    if (typeof id === 'string') {
      id = id.trim().toLowerCase();
    }
    if (id === undefined) {
      console.warn('CREATE MAP : try to create map with undefined key', i, idCell, sheet);
      continue;
    }
    map.set(id, sheet[i]);
  }
  return map;
}

function createOrderRanking(customerMap, providerMap, orderSheet, settings) {
  const orders = [];
  for (let i = 1; i < orderSheet.length; i++) {
    const o = orderSheet[i];
    const ranking = getRanking(o, customerMap, providerMap, settings);
    
    orders.push({ order: o, ranking })
  }
  return orders.sort((a, b) => {
    if (a.order[settings.orderType] !== b.order[settings.orderType]) {
      return a.order[settings.orderType].localeCompare(b.order[settings.orderType]);
    }
    return b.ranking - a.ranking
  });
}

function getRanking(o, customerMap, providerMap, settings) {
  const customerRanking = getCustomerRanking(o[settings.orderCustomerID], customerMap, settings);
  const providerRanking = getProviderRanking(o[settings.orderProviderID], providerMap, settings);
  const dateRanking     = getDateRanking(o, settings);

  return providerRanking + dateRanking + customerRanking;
}

function getCustomerRanking(customerKey, customerMap, settings) {
  if (customerKey === undefined || customerKey === null || customerKey === '') {
    console.error('GET CUSTOMER RANKING : customer key is empty', customerKey);
    return 0;
  }

  if (typeof customerKey !== 'string' && typeof customerKey !== 'number') {
    console.error('GET CUSTOMER RANKING : customer key is of invalid type', typeof customerKey);
    return 0;
  }

  if (typeof customerKey === 'string') {
    customerKey = customerKey.trim().toLowerCase();
  }

  const customer = customerMap.get(customerKey);

  if (customer === undefined) {
    console.warn('GET CUSTOMER RANKING : unknown key in customer map', customerKey, customerMap);
    return 0;
  }

  if (typeof customer[settings.customerRating] !== 'string') {
    console.warn('GET CUSTOMER RANKING : customer rating is not a string', typeof customer[settings.customerRating]);
    return 0;
  }

  if (typeof settings.customerRate !== 'number') {
    console.warn('GET CUSTOMER RANKING : customer rate is not a number', typeof settings.customerRate);
  }

  const coef = typeof settings.customerRate === 'number' ? settings.customerRate : 1;
  const rating = customer[settings.customerRating].toLowerCase().trim();
  switch (rating) {
    case 'sensible':
      return 5 * coef;
    default:
      return 1 * coef;
  }
}

function getProviderRanking(providerKey, providerMap, settings) {
  if (providerKey === undefined || providerKey === null || providerKey === '') {
    console.error('GET PROVIDER RANKING : provider key is empty', providerKey);
    return 0;
  }

  if (typeof providerKey !== 'string' && typeof providerKey !== 'number') {
    console.error('GET PROVIDER RANKING : provider key is of invalid type', typeof providerKey);
    return 0;
  }

  if (typeof providerKey === 'string') {
    providerKey = providerKey.trim().toLowerCase();
  }

  const provider = providerMap.get(providerKey);

  if (provider === undefined) {
    console.warn('GET PROVIDER RANKING : unknown key in provider map', providerKey, providerMap);
    return 0;
  }

  const providerRating = provider[settings.providerRating];

  if (typeof providerRating !== 'number') {
    console.warn('GET PROVIDER RANKING : provider rating is not a number', typeof providerRating);
    return 0;
  }

  if (providerRating > 5 || providerRating < 0) {
    console.warn('GET PROVIDER RANKING : invalid provider mark range', providerRating);
  }

  if (typeof settings.providerRate !== 'number') {
    console.warn('GET PROVIDER RANKING : provider rate is not a number', typeof settings.providerRate);
  }

  const mark = 6 - providerRating;
  const coef = typeof settings.providerRate === 'number' ? settings.providerRate : 1;

  return mark * coef;
}

function getDateRanking(o, settings) {
  const type = o[settings.orderType];

  if (type === undefined || type === null || type === '') {
    console.error('GET DATE RANKING : type is empty', o, settings.orderType);
    return 0;
  }

  if (typeof type !== 'string') {
    console.error('GET DATE RANKING : type is not a string', typeof type);
    return 0;
  }

  const trimType = type.trim().toLowerCase();

  if (trimType !== 'chargement' && trimType !== 'livraison') {
    console.error('GET DATE RANKING : type is not valid, await "chargement" or "livraison"', trimType);
    return 0;
  }

  const date = trimType === 'chargement' ?
    o[settings.orderDateShipping] : o[settings.orderDateDelivery];

  if (date === undefined || typeof date !== 'object') {
    console.log('GET DATE RANKING : date undefined or invalid', date);
    return 0;
  }

  const rate = 24 - date.getHours();
  const mark = (rate / 24) * 5
  const coef = typeof settings.dateRate === 'number' ? settings.dateRate : 1;

  return mark * coef;
}

function createProjection(orders, headers, projection) {
  const newHeaders = Object
    .keys(projection)
    .map(key => ({
      index: headers.indexOf(key),
      name: projection[key]
    }));

  const mapped = orders
    .map(({ order }) => 
      newHeaders
        .map(({ index }) => index !== -1 ? order[index] : '')
        .map(value => value !== undefined && value !== null ? value : '')
    );

  // insert headers at first line
  mapped.unshift(newHeaders.map(({ name }) => name));

  return mapped;
}
