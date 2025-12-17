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

  if (!form || !fileInput || !overlay) {
    return;
  }

  const successTemplate = document.querySelector('#success');
  const errorTemplate = document.querySelector('#error');

  let currentMessageElement = null;
  let currentMessageDocumentClick = null;

  function closeMessage() {
    if (currentMessageElement) {
      currentMessageElement.remove();
      currentMessageElement = null;
      document.removeEventListener('keydown', onMessageKeydown);

      if (currentMessageDocumentClick) {
        document.removeEventListener('click', currentMessageDocumentClick);
        currentMessageDocumentClick = null;
      }
    }
  }

  function onMessageKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function showMessage(template) {
    closeMessage();

    const messageContent = template.content.cloneNode(true);
    const messageElement = messageContent.querySelector('.success, .error');

    if (messageElement) {
      document.body.appendChild(messageContent);
      currentMessageElement = messageElement;

      const button = messageElement.querySelector('.success__button, .error__button');
      if (button) {
        button.onclick = (evt) => {
          evt.stopPropagation();
          closeMessage();
        };
      }

      currentMessageDocumentClick = (evt) => {
        const clickedElement = evt.target;
        const isClickInsideMessage = currentMessageElement === clickedElement ||
                                  currentMessageElement.contains(clickedElement);

        if (!isClickInsideMessage) {
          closeMessage();
        }
      };

      setTimeout(() => {
        document.addEventListener('click', currentMessageDocumentClick);
      }, 10);

      document.addEventListener('keydown', onMessageKeydown);
    }
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
