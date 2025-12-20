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
  const submitButton = document.querySelector('.img-upload__submit');

  const previewImage = overlay.querySelector('.img-upload__preview img');
  const effectPreviews = overlay.querySelectorAll('.effects__preview');

  const FILE_TYPES = ['jpg', 'jpeg', 'png'];

  if (!form || !fileInput || !overlay) {
    return;
  }

  const successTemplate = document.querySelector('#success');
  const errorTemplate = document.querySelector('#error');

  let currentMessageElement = null;
  let currentMessageDocumentClick = null;

  function closeMessage() {
    if (!currentMessageElement) {
      return;
    }

    currentMessageElement.remove();
    currentMessageElement = null;
    body.classList.remove('has-message');

    document.removeEventListener('keydown', onMessageKeydown);

    if (currentMessageDocumentClick) {
      document.removeEventListener('click', currentMessageDocumentClick);
      currentMessageDocumentClick = null;
    }

    overlay.classList.remove('hidden');
    body.classList.add('modal-open');
  }

  function onMessageKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function showMessage(template) {
    closeMessage();

    overlay.classList.add('hidden');
    body.classList.remove('modal-open');

    const messageContent = template.content.cloneNode(true);
    const messageElement = messageContent.querySelector('.success, .error');

    if (!messageElement) {
      return;
    }

    document.body.appendChild(messageContent);
    currentMessageElement = messageElement;
    body.classList.add('has-message');

    const button = messageElement.querySelector('.success__button, .error__button');
    if (button) {
      button.addEventListener('click', closeMessage);
    }

    currentMessageDocumentClick = (evt) => {
      if (evt.target === currentMessageElement) {
        closeMessage();
      }
    };

    document.addEventListener('click', currentMessageDocumentClick);
    document.addEventListener('keydown', onMessageKeydown);
  }

  function onDocumentEscKey(evt) {
    if (!isFormOpen) {
      return;
    }

    const isFocusInInput =
      document.activeElement === hashtagsInput ||
      document.activeElement === commentInput;

    if (evt.key === 'Escape' && !isFocusInInput) {
      evt.preventDefault();
      closeForm();
    }
  }

  function openForm() {
    overlay.classList.remove('hidden');
    body.classList.add('modal-open');
    isFormOpen = true;

    document.addEventListener('keydown', onDocumentEscKey);

    initScale();
    initEffects();
  }

  function closeForm() {
    overlay.classList.add('hidden');
    body.classList.remove('modal-open');
    isFormOpen = false;

    document.removeEventListener('keydown', onDocumentEscKey);

    resetScale();
    resetEffects();

    form.reset();
    fileInput.value = '';

    if (pristine) {
      pristine.reset();
    }
  }

  [hashtagsInput, commentInput].forEach((field) => {
    field.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });
  });


  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const isValidType = FILE_TYPES.some((type) => fileName.endsWith(type));
    if (!isValidType) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;

    effectPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${imageUrl})`;
    });

    openForm();
  });

  cancelButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    closeForm();
  });

  if (typeof Pristine === 'undefined') {
    return;
  }

  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__error',
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

    if (!pristine.validate()) {
      return;
    }

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    try {
      const formData = new FormData(form);
      await sendData(formData);

      closeForm();
      showMessage(successTemplate);
    } catch (error) {
      showMessage(errorTemplate);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});
