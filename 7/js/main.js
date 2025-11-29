import { generatePhotos } from './photo-generator.js';
import { renderThumbnails } from './thumbnails.js';
import './big-picture.js';

const photos = generatePhotos();

document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});

export { photos };
