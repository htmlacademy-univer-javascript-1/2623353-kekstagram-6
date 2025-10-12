const NAMES = [
  'Артём',
  'Мария',
  'Дмитрий',
  'Анна',
  'Сергей',
  'Елена',
  'Алексей',
  'Ольга',
  'Иван',
  'Наталья'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const DESCRIPTIONS = [
  'Красивый закат на море',
  'Городские огни ночью',
  'Природа в её лучшем проявлении',
  'Момент из путешествия',
  'Уютный домашний вечер',
  'Уличное искусство',
  'Вкусный ужин',
  'Спортивные достижения',
  'Утренний кофе',
  'Зимняя сказка'
];

const AVATAR_COUNT = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 30;
const PHOTOS_COUNT = 25;

const getRandomArrayElement = (elements) => elements[Math.floor(Math.random() * elements.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createIdGenerator = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

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

const createPhoto = (id) => ({
  id: id,
  url: `photos/${id}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: createComments()
});

const generatePhotos = () => {
  const photos = [];

  for (let i = 1; i <= PHOTOS_COUNT; i++) {
    photos.push(createPhoto(i));
  }

  return photos;
};

generatePhotos();
