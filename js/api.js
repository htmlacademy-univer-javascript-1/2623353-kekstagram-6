const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getData = () => fetch(`${BASE_URL}/data`)
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  });

const sendData = (body) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', BASE_URL);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject();
      }
    });

    xhr.addEventListener('error', () => reject());

    xhr.send(body);
  });

export { getData, sendData };
