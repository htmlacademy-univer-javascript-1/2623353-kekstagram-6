const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';
const SUCCESS_STATUS = 200;

const request = (method, url, body = null) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.open(method, url);

    xhr.onload = () => {
      if (xhr.status === SUCCESS_STATUS) {
        resolve(xhr.response);
      } else {
        reject();
      }
    };

    xhr.onerror = () => reject();

    xhr.send(body);
  });

const getData = () => request('GET', `${BASE_URL}/data`);

const sendData = (body) => request('POST', `${BASE_URL}/`, body);

const api = {
  getData,
  sendData
};

export { api };
