const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getData = () => {
  return fetch(`${BASE_URL}/data`)
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    });
};

const sendData = (body) => {
  return fetch(BASE_URL, {
    method: 'POST',
    body,
  });
};

export { getData, sendData };
