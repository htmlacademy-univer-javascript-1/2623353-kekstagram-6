const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getData = () =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', `${BASE_URL}/data`);

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject();
      }
    };

    xhr.onerror = () => reject();

    xhr.send();
  });

const sendData = (body) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', `${BASE_URL}/`);

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject();
      }
    };

    xhr.onerror = () => reject();

    xhr.send(body);
  });

export { getData, sendData };
