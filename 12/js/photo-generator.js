import {
  getRandomArrayElement,
  getRandomInteger,
  createIdGenerator
} from './util.js';

import {
  NAMES,
  MESSAGES,
  DESCRIPTIONS,
  AVATAR_COUNT,
  MIN_COMMENTS,
  MAX_COMMENTS,
  MIN_LIKES,
  MAX_LIKES,
  PHOTOS_COUNT
} from './data.js';

const generateCommentId = createIdGenerator();

const createComment = () => {
  const avatarNumber = getRandomInteger(1, AVATAR_COUNT);

  return {
    id: generateCommentId(),
    avatar: `img/avatar-${avatarNumber}.svg`,
    message: getRandomArrayElement(MESSAGES),
    name: getRandomArrayElement(NAMES)
  };
};

const createComments = () => {
  const commentsCount = getRandomInteger(MIN_COMMENTS, MAX_COMMENTS);
  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(createComment());
  }

  return comments;
};

export const createPhoto = (id) => ({
  id: id,
  url: `photos/${id}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: createComments()
});

export const generatePhotos = () => {
  const photos = [];

  for (let i = 1; i <= PHOTOS_COUNT; i++) {
    photos.push(createPhoto(i));
  }

  return photos;
};
