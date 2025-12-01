// hashtags.js
const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]+$/i;

export function validateHashtags(value) {
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

export function getHashtagErrorMessage(value) {
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
