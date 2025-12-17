import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { initScale, resetScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';
import { sendData } from './api.js';

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

  const successTemplate = document.querySelector('#success');
  const errorTemplate = document.querySelector('#error');

  let currentMessage = null;

  function closeMessage() {
    if (currentMessage) {
      currentMessage.remove();
      currentMessage = null;
      document.removeEventListener('keydown', onMessageKeydown);
      document.removeEventListener('click', onMessageClick);
    }
  }

  function onMessageKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function onMessageClick(evt) {
    if (!evt.target.closest('.success__inner') && !evt.target.closest('.error__inner')) {
      closeMessage();
    }
  }

  function showMessage(template) {
    currentMessage = template.content.cloneNode(true);
    document.body.appendChild(currentMessage);

    const button = document.querySelector('.success__button, .error__button');
    if (button) {
      button.addEventListener('click', closeMessage);
    }

    document.addEventListener('keydown', onMessageKeydown);
    document.addEventListener('click', onMessageClick);
  }

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

    setTimeout(() => {
      initScale();
      initEffects();
    }, 10);
  }

  function closeForm() {
    overlay.classList.add('hidden');
    body.classList.remove('modal-open');
    isFormOpen = false;

    resetScale();
    resetEffects();

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

  function resetForm() {
    closeForm();
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
      resetForm();
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

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    try {
      const formData = new FormData(form);
      await sendData(formData);

      resetForm();
      showMessage(successTemplate);
    } catch (error) {
      showMessage(errorTemplate);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});
