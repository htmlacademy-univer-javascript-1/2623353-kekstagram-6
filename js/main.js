import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { debounce } from './util.js';
import './form.js';

const RANDOM_PHOTOS_COUNT = 10;
const Filter = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

let photos = [];
let currentFilter = Filter.DEFAULT;

const filtersContainer = document.querySelector('.img-filters');
const filterDefault = document.querySelector('#filter-default');
const filterRandom = document.querySelector('#filter-random');
const filterDiscussed = document.querySelector('#filter-discussed');

const getRandomPhotos = (photosArray) => {
  const shuffled = [...photosArray].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photosArray) => {
  const photosCopy = photosArray.slice();
  return photosCopy.sort((a, b) => b.comments.length - a.comments.length);
};

const applyFilter = () => {
  let filteredPhotos;

  switch (currentFilter) {
    case Filter.RANDOM:
      filteredPhotos = getRandomPhotos(photos);
      break;
    case Filter.DISCUSSED:
      filteredPhotos = getDiscussedPhotos(photos);
      break;
    case Filter.DEFAULT:
    default:
      filteredPhotos = photos;
  }

  renderThumbnails(filteredPhotos);
};

const debouncedApplyFilter = debounce(applyFilter, 500);

const setActiveFilterButton = (activeButton) => {
  const buttons = filtersContainer.querySelectorAll('.img-filters__button');
  buttons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  activeButton.classList.add('img-filters__button--active');
};

const initFilters = () => {
  filtersContainer.classList.remove('img-filters--inactive');

  filterDefault.addEventListener('click', () => {
    currentFilter = Filter.DEFAULT;
    setActiveFilterButton(filterDefault);
    debouncedApplyFilter();
  });

  filterRandom.addEventListener('click', () => {
    currentFilter = Filter.RANDOM;
    setActiveFilterButton(filterRandom);
    debouncedApplyFilter();
  });

  filterDiscussed.addEventListener('click', () => {
    currentFilter = Filter.DISCUSSED;
    setActiveFilterButton(filterDiscussed);
    debouncedApplyFilter();
  });
};

const showErrorMessage = () => {
  const errorContainer = document.createElement('div');
  errorContainer.textContent = 'Не удалось загрузить данные. Пожалуйста, обновите страницу';
  document.body.appendChild(errorContainer);
};

getData()
  .then((data) => {
    photos = data;
    renderThumbnails(photos);
    initFilters();
  })
  .catch(() => {
    showErrorMessage();
  });

export { photos };
