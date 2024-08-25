import { API_TIMEOUT } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJsonResponseFromAPI = async function (url) {
  try {
    const resp = await Promise.race([fetch(url), timeout(API_TIMEOUT)]);

    if (!resp.ok) throw new Error(`Invalid Query for food recipe`);

    const respJson = await resp.json();

    return respJson.data;
  } catch (err) {
    throw new Error(err);
  }
};

// Method to POST data using fetch method. Here we need to pass an option object specifying some options
export const postDataToAPI = async function (url, data) {
  try {
    const resp = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
      timeout(API_TIMEOUT),
    ]);

    if (!resp.ok) throw new Error(`Invalid Query for food recipe`);

    const respJson = await resp.json();

    return respJson.data;
  } catch (err) {
    throw new Error(err);
  }
};
