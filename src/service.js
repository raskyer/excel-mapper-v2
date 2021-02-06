import 'firebase/database';

import Bowser from 'bowser';
import firebase from 'firebase/app';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAF-s8W-zRrsKy2b5CO_MJTnGejvzmGjhs',
    authDomain: 'dianeetvincent-d891f.firebaseapp.com',
    projectId: 'dianeetvincent-d891f',
    storageBucket: 'dianeetvincent-d891f.appspot.com',
    messagingSenderId: '656100635792',
    appId: '1:656100635792:web:a5c9c95bbdcb927699d415',
    databaseURL: 'https://dianeetvincent-d891f-default-rtdb.firebaseio.com/',
  });
}
const database = firebase.database();

export function useTrackers(site) {
  const { user, uuid } = initUser();
  const userStr = user + '-' + uuid;

  useEffect(() => {
    trackBrowser(userStr, site);
    trackLocation(userStr, site);
    trackState(userStr, site);
    trackPosition(userStr, site);
  }, [userStr, site]);

  return { user, uuid };
}

function key(user, site) {
  return `users/${user}/${site}`;
}

function track(key, value) {
  database.ref(key).set(value);
}

function date() {
  return new Date().toLocaleString();
}

function dateKey() {
  const d = new Date();

  return (
    d.getFullYear().toString() +
    '-' +
    ((d.getMonth() + 1).toString().length === 2
      ? (d.getMonth() + 1).toString()
      : '0' + (d.getMonth() + 1).toString()) +
    '-' +
    (d.getDate().toString().length === 2
      ? d.getDate().toString()
      : '0' + d.getDate().toString()) +
    'T' +
    (d.getHours().toString().length === 2
      ? d.getHours().toString()
      : '0' + d.getHours().toString()) +
    ':' +
    (d.getMinutes().toString().length === 2
      ? d.getMinutes().toString()
      : '0' + d.getMinutes().toString()) +
    ':' +
    (d.getSeconds().toString().length === 2
      ? d.getSeconds().toString()
      : '0' + d.getSeconds().toString())
  );
}

function initUser() {
  const params = new URLSearchParams(window.location.search);
  const urlUser = params.get('u');
  const urlUuid = params.get('d');
  if (urlUser !== null) {
    localStorage.setItem('user', urlUser);
  }
  if (urlUuid !== null) {
    localStorage.setItem('uuid', urlUuid);
  }

  return getUser();
}

function getUser() {
  let localUser = localStorage.getItem('user');
  let localUuid = localStorage.getItem('uuid');

  if (localUser === null) {
    localUser = 'unknown';
    localStorage.setItem('user', localUser);
  }

  if (localUuid === null) {
    localUuid = uuidv4();
    localStorage.setItem('uuid', localUuid);
  }

  return {
    user: localUser,
    uuid: localUuid,
  };
}

function trackBrowser(user, site) {
  const browser = Bowser.getParser(window.navigator.userAgent).parsedResult;
  track(key(user, site) + '/browser', browser);
}

async function trackLocation(user, site) {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  if (!data) {
    return;
  }
  track(key(user, site) + '/location', {
    city: data.city,
    country: data.country,
    continent: data.continent_code,
    postal: data.postal,
    region: data.region,
    latitude: data.latitude,
    longitude: data.longitude,
  });
}

function trackState(user, site) {
  track(key(user, site) + '/update/load', date());
  window.addEventListener('beforeunload', () => {
    track(key(user, site) + '/update/close', date());
  });
  window.addEventListener('blur', () => {
    track(key(user, site) + '/update/blur', date());
  });
  window.addEventListener('focus', () => {
    track(key(user, site) + '/update/focus', date());
  });
  window.addEventListener('visibilitychange', () => {
    track(key(user, site) + '/update/visibility', date());
  });

  let run = false;
  window.addEventListener('scroll', () => {
    if (!run) {
      window.requestAnimationFrame(() => {
        track(key(user, site) + '/scroll/' + dateKey(), window.scrollY);
        run = false;
      });
    }
    run = true;
  });
}

function trackPosition(user, site) {
  if (!navigator.geolocation) {
    return;
  }
  navigator.geolocation.getCurrentPosition((position) => {
    track(key(user, site) + '/position', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
}
