import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { initScaleAndEffects, resetScaleAndEffects } from './scale-and-effects.js';

let pristine;
let isFormOpen = false;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.img-upload__form');
  const fileInput = document.querySelector('#upload-file');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = document.querySelector('#upload-cancel');
  const body = document.body;
  const hashtagsInput = form.querySelector('.text__hashtags');
  const commentInput = form.querySelector('.text__description');
  const submitButton = form.querySelector('.img-upload__submit');

  if (!form || !fileInput || !overlay) {
    return;
  }

  form.action = 'https://29.javascript.htmlacademy.pro/kekstagram';
  form.method = 'POST';
  form.enctype = 'multipart/form-data';

  function onDocumentEscKey(evt) {
    if (!isFormOpen) {
      return;
    }

    const isFocusInInput = document.activeElement === hashtagsInput ||
                          document.activeElement === commentInput;

    if (evt.key === 'Escape' && !isFocusInInput) {
      evt.preventDefault();
      evt.stopPropagation();
      closeForm();
    }
  }

  document.addEventListener('keydown', onDocumentEscKey);

  function openForm() {
    overlay.classList.remove('hidden');
    body.classList.add('modal-open');
    isFormOpen = true;

    initScaleAndEffects();
  }

  function closeForm() {
    overlay.classList.add('hidden');
    body.classList.remove('modal-open');
    isFormOpen = false;

    resetScaleAndEffects();

    form.reset();
    fileInput.value = '';

    if (pristine) {
      pristine.reset();
    }

    if (hashtagsInput) {
      hashtagsInput.value = '';
    }
    if (commentInput) {
      commentInput.value = '';
    }
  }

  if (hashtagsInput && commentInput) {
    [hashtagsInput, commentInput].forEach((field) => {
      field.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
          evt.stopPropagation();
        }
      });
    });
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      openForm();
    }
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      closeForm();
    });
  }

  if (typeof Pristine === 'undefined') {
    return;
  }

  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__error'
  }, true);

  pristine.addValidator(
    hashtagsInput,
    validateHashtags,
    getHashtagErrorMessage
  );

  pristine.addValidator(
    commentInput,
    (value) => value.length <= 140,
    'Комментарий не может быть длиннее 140 символов'
  );

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (!isValid) {
      return;
    }

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';

    try {
      const formData = new FormData(form);

      await fetch(form.action, {
        method: form.method,
        body: formData
      });

      closeForm();

    } catch (error) {
      // Игнорируем ошибки
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});
