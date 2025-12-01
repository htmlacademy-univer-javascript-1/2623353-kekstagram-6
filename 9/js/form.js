import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';

const Pristine = window.Pristine;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;
const submitButton = document.querySelector('.img-upload__submit');

// Устанавливаем атрибуты формы
form.action = 'https://29.javascript.htmlacademy.pro/kekstagram';
form.method = 'POST';
form.enctype = 'multipart/form-data';

// Открытие формы
function openForm() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentEscKey);
}

// Закрытие формы
function closeForm() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  form.reset();
  fileInput.value = '';
  document.removeEventListener('keydown', onDocumentEscKey);
}

// Обработчик Esc
function onDocumentEscKey(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
  }
}

// Блокируем Esc в полях ввода
[hashtagInput, commentInput].forEach((field) => {
  field.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  });
});

// Открываем форму при выборе файла
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    openForm();
  }
});

// Закрываем форму по кнопке
cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// Инициализация Pristine
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error'
}, true);

// Добавляем валидаторы
pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  commentInput,
  (value) => value.length <= 140,
  'Комментарий не может быть длиннее 140 символов'
);

// Обработчик отправки формы
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
