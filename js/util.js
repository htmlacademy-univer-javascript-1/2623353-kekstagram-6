const ESCAPE_KEY = 'Escape';

const isEscapeKey = (evt) => evt.key === ESCAPE_KEY;

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, timeoutDelay);
  };
};

export { debounce, isEscapeKey };
