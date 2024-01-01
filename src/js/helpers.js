// fro functions which we will be using again and again
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    // promise that will reject after certain number of seconds
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // this data will be resolved value of the promise
  } catch (err) {
    // console.log(err);//we don't want the error to be handled here, but instead in model.js, so we will rethrow the error
    throw err; // and with the promise returned by json will get rejected, before the promise was still being fulfilled
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // this data will be resolved value of the promise
  } catch (err) {
    // console.log(err);//we don't want the error to be handled here, but instead in model.js, so we will rethrow the error
    throw err; // and with the promise returned by json will get rejected, before the promise was still being fulfilled
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // this data will be resolved value of the promise
  } catch (err) {
    // console.log(err);//we don't want the error to be handled here, but instead in model.js, so we will rethrow the error
    throw err; // and with the promise returned by json will get rejected, before the promise was still being fulfilled
  }
};
*/
