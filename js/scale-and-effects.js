import noUiSlider from 'nouislider';

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;
const DEFAULT_EFFECT = 'none';

const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

let currentScale = DEFAULT_SCALE;
let currentEffect = DEFAULT_EFFECT;

const effects = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    filter: '',
    unit: ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'grayscale',
    unit: ''
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'sepia',
    unit: ''
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: 'invert',
    unit: '%'
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px'
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: 'brightness',
    unit: ''
  }
};

function initSlider() {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        return value;
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  hideSlider();
}

function updateScale(value) {
  currentScale = value;
  scaleControl.value = `${value}%`;
  previewImage.style.transform = `scale(${value / 100})`;
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

function showSlider() {
  effectLevelContainer.classList.remove('hidden');
}

function hideSlider() {
  effectLevelContainer.classList.add('hidden');
}

function updateSlider(effectName) {
  const effect = effects[effectName];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max
    },
    start: effect.max,
    step: effect.step
  });
}

function applyEffect(effectName, value) {
  const effect = effects[effectName];

  if (effectName === 'none') {
    previewImage.style.filter = '';
    effectLevelValue.value = '';
    return;
  }

  const filterValue = `${effect.filter}(${value}${effect.unit})`;
  previewImage.style.filter = filterValue;
  effectLevelValue.value = value;
}

function onSliderUpdate() {
  const value = effectLevelSlider.noUiSlider.get();
  applyEffect(currentEffect, value);
}

function onEffectChange(evt) {
  if (evt.target.type !== 'radio') {
    return;
  }

  currentEffect = evt.target.value;

  updateScale(DEFAULT_SCALE);

  if (currentEffect === 'none') {
    hideSlider();
    applyEffect('none', '');
  } else {
    showSlider();
    updateSlider(currentEffect);
    applyEffect(currentEffect, effects[currentEffect].max);
  }
}

export function resetScaleAndEffects() {
  updateScale(DEFAULT_SCALE);

  const noneEffectRadio = document.querySelector('#effect-none');
  noneEffectRadio.checked = true;
  currentEffect = DEFAULT_EFFECT;

  previewImage.style.transform = '';
  previewImage.style.filter = '';

  hideSlider();

  effectLevelValue.value = '';
}

export function initScaleAndEffects() {

  updateScale(DEFAULT_SCALE);

  initSlider();

  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);

  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);

  effectsList.addEventListener('change', onEffectChange);

  hideSlider();
}
