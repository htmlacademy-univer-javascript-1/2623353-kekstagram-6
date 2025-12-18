import { openBigPicture } from './big-picture.js';

const template = document.querySelector('#picture');
const container = document.querySelector('.pictures');

const createThumbnail = (photo) => {
  const thumb = template.content.querySelector('.picture').cloneNode(true);

  const img = thumb.querySelector('.picture__img');
  const comments = thumb.querySelector('.picture__comments');
  const likes = thumb.querySelector('.picture__likes');

  img.src = photo.url;
  img.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;

  thumb.dataset.id = photo.id;

  return thumb;
};

export function renderThumbnails(photos) {
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumb = createThumbnail(photo);

    thumb.addEventListener('click', (evt) => {
      evt.preventDefault();
      openBigPicture(photo);
    });

    fragment.appendChild(thumb);
  });

  container.appendChild(fragment);
}
