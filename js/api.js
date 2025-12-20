const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getData = () =>
  fetch(`${BASE_URL}/data`)
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

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response); // ← ВАЖНО
      } else {
        reject();
      }
    };

    xhr.onerror = () => reject();

    xhr.send(body);
  });

export { getData, sendData };
