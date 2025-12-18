export const getRandomArrayElement = (elements) =>
  elements[Math.floor(Math.random() * elements.length)];

export const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const createIdGenerator = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

export function debounce(callback, timeoutDelay = 500) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}
