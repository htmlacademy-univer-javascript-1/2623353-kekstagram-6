import { generatePhotos } from './photo-generator.js';
import { renderThumbnails } from './thumbnails.js';

const photos = generatePhotos();

document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails(photos);
});

export { photos };
