const DEFAULT_EFFECT = 'none';

const uploadOverlay = document.querySelector('.img-upload__overlay');

const previewImage = uploadOverlay.querySelector('.img-upload__preview img');
const effectsList = uploadOverlay.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

let currentEffect = DEFAULT_EFFECT;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
  }
};

function formatValue(value, effect) {
  if (effect === 'chrome' || effect === 'sepia' || effect === 'phobos' || effect === 'heat') {
    return value.toFixed(1);
  }
  if (effect === 'marvin') {
    return Math.round(value);
  }
  return value;
}

function applyEffect(effect, value) {
  let filter = '';

  switch (effect) {
    case 'chrome':
      filter = `grayscale(${value})`;
      break;
    case 'sepia':
      filter = `sepia(${value})`;
      break;
    case 'marvin':
      filter = `invert(${value}%)`;
      break;
    case 'phobos':
      filter = `blur(${value}px)`;
      break;
    case 'heat':
      filter = `brightness(${value})`;
      break;
    case 'none':
      filter = '';
      break;
  }

  previewImage.style.filter = filter;

  if (effectLevelValue) {
    effectLevelValue.value = value;
  }
}

function initSlider() {
  if (typeof noUiSlider === 'undefined') {
    return;
  }

  if (effectLevelSlider.noUiSlider) {
    return;
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = parseFloat(values[0]);
    applyEffect(currentEffect, value);
  });
}

function updateSlider(effect) {
  if (!effectLevelSlider.noUiSlider) {
    return;
  }

  const config = EFFECTS[effect];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: config.min,
      max: config.max
    },
    start: config.max,
    step: config.step,
    format: {
      to: function(value) {
        return formatValue(value, effect);
      },
      from: function(value) {
        return parseFloat(value);
      }
    }
  });
}

function toggleSlider(show) {
  if (show) {
    effectLevelContainer.classList.remove('hidden');
  } else {
    effectLevelContainer.classList.add('hidden');
  }
}

function onEffectChange(evt) {
  if (evt.target.type !== 'radio') {
    return;
  }

  currentEffect = evt.target.value;

  if (currentEffect === 'none') {
    toggleSlider(false);
    applyEffect('none', '');
  } else {
    toggleSlider(true);
    updateSlider(currentEffect);
    applyEffect(currentEffect, EFFECTS[currentEffect].max);
  }
}

function resetEffects() {
  const noneRadio = document.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }

  currentEffect = DEFAULT_EFFECT;

  if (previewImage) {
    previewImage.style.filter = '';
  }

  if (effectLevelValue) {
    effectLevelValue.value = '';
  }

  toggleSlider(false);
}

function initEffects() {
  initSlider();

  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  resetEffects();
}

const effects = {
  init: initEffects,
  reset: resetEffects
};

export { effects };
