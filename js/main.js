import { api } from './api.js';
import { thumbnails } from './thumbnails.js';
import { debounce, isEscapeKey } from './util.js';
import './form.js';

const RANDOM_PHOTOS_COUNT = 10;

const Filter = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed',
};

let photos = [];
let currentFilter = Filter.DEFAULT;

const filtersContainer = document.querySelector('.img-filters');

let filterDefault;
let filterRandom;
let filterDiscussed;

if (filtersContainer) {
  filterDefault = filtersContainer.querySelector('#filter-default');
  filterRandom = filtersContainer.querySelector('#filter-random');
  filterDiscussed = filtersContainer.querySelector('#filter-discussed');
}

const getRandomPhotos = (photosArray) => {
  const shuffled = [...photosArray].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photosArray) =>
  [...photosArray].sort((a, b) => b.comments.length - a.comments.length);

const applyFilter = () => {
  let filteredPhotos = photos;

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

  thumbnails.render(filteredPhotos);
};

const debouncedApplyFilter = debounce(applyFilter, 500);

const setActiveFilterButton = (activeButton) => {
  if (!filtersContainer) {
    return;
  }

  const buttons = filtersContainer.querySelectorAll('.img-filters__button');
  buttons.forEach((button) =>
    button.classList.remove('img-filters__button--active')
  );

  activeButton.classList.add('img-filters__button--active');
};

const initFilters = () => {
  if (!filtersContainer) {
    return;
  }

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
  errorContainer.classList.add('data-error');

  Object.assign(errorContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    padding: '20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    textAlign: 'center',
    zIndex: '1000',
    cursor: 'pointer',
  });

  errorContainer.textContent =
    'Не удалось загрузить данные. Попробуйте позже.';
  document.body.append(errorContainer);

  const closeError = () => {
    errorContainer.remove();
    document.removeEventListener('keydown', onEscKeydown);
  };

  function onEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeError();
    }
  }

  errorContainer.addEventListener('click', closeError);
  document.addEventListener('keydown', onEscKeydown);
};

api.getData()
  .then((data) => {
    photos = data;
    thumbnails.render(photos);
    initFilters();
  })
  .catch(() => {
    showErrorMessage();
  });

export { photos };
