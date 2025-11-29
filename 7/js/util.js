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
