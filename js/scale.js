const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

let currentScale = DEFAULT_SCALE;

let scaleContainer;
let scaleControl;
let scaleSmaller;
let scaleBigger;
let previewImage;

const updateScale = (value) => {
  currentScale = value;

  if (scaleControl) {
    scaleControl.value = `${value}%`;
  }

  if (previewImage) {
    previewImage.style.transform = `scale(${value / 100})`;
  }
};

const onScaleSmallerClick = () => {
  updateScale(Math.max(currentScale - SCALE_STEP, SCALE_MIN));
};

const onScaleBiggerClick = () => {
  updateScale(Math.min(currentScale + SCALE_STEP, SCALE_MAX));
};

const resetScale = () => {
  updateScale(DEFAULT_SCALE);
};

const initScale = () => {
  scaleContainer = document.querySelector('.scale');
  previewImage = document.querySelector('.img-upload__preview img');

  if (!scaleContainer || !previewImage) {
    return;
  }

  scaleControl = scaleContainer.querySelector('.scale__control--value');
  scaleSmaller = scaleContainer.querySelector('.scale__control--smaller');
  scaleBigger = scaleContainer.querySelector('.scale__control--bigger');

  if (!scaleControl || !scaleSmaller || !scaleBigger) {
    return;
  }

  updateScale(DEFAULT_SCALE);

  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
};

const scale = {
  init: initScale,
  reset: resetScale,
};

export { scale };
