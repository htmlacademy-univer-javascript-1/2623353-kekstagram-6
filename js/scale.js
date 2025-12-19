const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

let currentScale = DEFAULT_SCALE;

const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');

function updateScale(value) {
  currentScale = value;

  if (scaleControl) {
    scaleControl.value = `${value}%`;
  }

  if (previewImage) {
    previewImage.style.transform = `scale(${value / 100})`;
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

export function resetScale() {
  updateScale(DEFAULT_SCALE);
}

export function initScale() {
  if (!scaleControl || !scaleSmaller || !scaleBigger || !previewImage) {
    return;
  }

  updateScale(DEFAULT_SCALE);

  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
}
