const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('#upload-file');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('#upload-cancel');
const body = document.body;

const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

form.action = 'https://29.javascript.htmlacademy.pro/kekstagram';
form.method = 'POST';
form.enctype = 'multipart/form-data';

function openForm() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentEscKey);
}

function closeForm() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  form.reset();
  fileInput.value = '';
  document.removeEventListener('keydown', onDocumentEscKey);
}

function onDocumentEscKey(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
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
  if (fileInput.files.length > 0) {
    openForm();
  }
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error'
}, true);

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]+$/i;

function validateHashtags(value) {
  if (!value.trim()) {
    return true;
  }

  const tags = value.trim().split(/\s+/);

  if (tags.length > MAX_HASHTAGS) {
    return false;
  }

  const lowerTags = tags.map((t) => t.toLowerCase());
  const uniqueTags = new Set(lowerTags);

  if (uniqueTags.size !== lowerTags.length) {
    return false;
  }

  return tags.every((tag) =>
    HASHTAG_REGEX.test(tag) &&
    tag.length <= MAX_HASHTAG_LENGTH &&
    tag !== '#'
  );
}

function hashtagsErrorMessage(value) {
  const tags = value.trim().split(/\s+/);

  if (tags.length > MAX_HASHTAGS) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  if (new Set(tags.map((t) => t.toLowerCase())).size !== tags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  for (const tag of tags) {
    if (tag === '#') {
      return 'Хэш-тег не может состоять из одной решётки';
    }

    if (!HASHTAG_REGEX.test(tag)) {
      return 'Неверный формат хэш-тега';
    }

    if (tag.length > MAX_HASHTAG_LENGTH) {
      return 'Максимальная длина 20 символов';
    }
  }

  return 'Ошибка в хэш-тегах';
}

pristine.addValidator(
  hashtagsInput,
  validateHashtags,
  hashtagsErrorMessage
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

  } catch {

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});
