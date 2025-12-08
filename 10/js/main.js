import { generatePhotos } from './photo-generator.js';
import { renderThumbnails } from './thumbnails.js';
import './form.js';
import './scale-and-effects.js';

const photos = generatePhotos();

renderThumbnails(photos);

export { photos };
