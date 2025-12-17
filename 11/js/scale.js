const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

let currentScale = DEFAULT_SCALE;

function getScaleElements() {
  return {
    scaleControl: document.querySelector('.scale__control--value'),
    scaleSmaller: document.querySelector('.scale__control--smaller'),
    scaleBigger: document.querySelector('.scale__control--bigger'),
    previewImage: document.querySelector('.img-upload__preview img')
  };
}

function updateScale(value) {
  currentScale = value;
  const elements = getScaleElements();

  if (elements.scaleControl) {
    elements.scaleControl.value = `${value}%`;
  }

  if (elements.previewImage) {
    elements.previewImage.style.transform = `scale(${value / 100})`;
  }
}

function onScaleSmallerClick() {
  let newScale = currentScale - SCALE_STEP;
  if (newScale < SCALE_MIN) {
    newScale = SCALE_MIN;
  }
  updateScale(newScale);
}

function onScaleBiggerClick() {
  let newScale = currentScale + SCALE_STEP;
  if (newScale > SCALE_MAX) {
    newScale = SCALE_MAX;
  }
  updateScale(newScale);
}

function addScaleListeners() {
  const elements = getScaleElements();

  if (elements.scaleSmaller) {
    elements.scaleSmaller.addEventListener('click', onScaleSmallerClick);
  }

  if (elements.scaleBigger) {
    elements.scaleBigger.addEventListener('click', onScaleBiggerClick);
  }
}

export function resetScale() {
  updateScale(DEFAULT_SCALE);
}

export function initScale() {
  updateScale(DEFAULT_SCALE);
  addScaleListeners();
}
