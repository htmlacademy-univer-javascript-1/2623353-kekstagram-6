import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import './form.js';

let photos = [];

const showErrorMessage = () => {
  const errorContainer = document.createElement('div');
  errorContainer.textContent = 'Не удалось загрузить данные. Пожалуйста, обновите страницу';
  document.body.appendChild(errorContainer);
};

getData()
  .then((data) => {
    photos = data;
    renderThumbnails(photos);
  })
  .catch(() => {
    showErrorMessage();
  });

export { photos };
