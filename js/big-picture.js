const bigPicture = document.querySelector('.big-picture');
const body = document.body;

const imgElement = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const caption = bigPicture.querySelector('.social__caption');
const commentsList = bigPicture.querySelector('.social__comments');
const totalCommentsCount = bigPicture.querySelector('.comments-count');
const shownCommentsCountElement = bigPicture.querySelector('.social__comment-shown-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const COMMENTS_PER_PAGE = 5;

let currentComments = [];
let shownCommentsCount = 0;

const createCommentElement = ({ avatar, name, message }) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = avatar;
  img.alt = name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = message;

  li.append(img, text);
  return li;
};

const renderComments = () => {
  const nextCount = Math.min(
    shownCommentsCount + COMMENTS_PER_PAGE,
    currentComments.length
  );

  for (let i = shownCommentsCount; i < nextCount; i++) {
    commentsList.appendChild(createCommentElement(currentComments[i]));
  }

  shownCommentsCount = nextCount;

  if (shownCommentsCountElement) {
    shownCommentsCountElement.textContent = shownCommentsCount;
  }
  if (totalCommentsCount) {
    totalCommentsCount.textContent = currentComments.length;
  }

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

export function openBigPicture(photo) {
  imgElement.src = photo.url;
  imgElement.alt = photo.description;
  likesCount.textContent = photo.likes;
  caption.textContent = photo.description;

  currentComments = photo.comments;
  shownCommentsCount = 0;

  commentsList.innerHTML = '';

  if (totalCommentsCount) {
    totalCommentsCount.textContent = currentComments.length;
  }
  if (shownCommentsCountElement) {
    shownCommentsCountElement.textContent = 0;
  }

  commentsLoader.classList.remove('hidden');
  renderComments();

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKey);
}

export function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscKey);
}

function onEscKey(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

closeButton.addEventListener('click', closeBigPicture);
commentsLoader.addEventListener('click', renderComments);
