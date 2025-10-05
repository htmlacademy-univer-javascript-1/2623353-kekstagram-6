const checkLength = function (line, maxLength) {
  return line.length <= maxLength;
};

console.log('Тест функции checkLength');
console.log(checkLength('проверяемая строка', 20));
console.log(checkLength('проверяемая строка', 18));
console.log(checkLength('проверяемая строка', 10));


const isPalindrome = function (line) {
  const normalizedLine = line.replaceAll(' ', '').toLowerCase();
  let reversedLine = '';
  for (let i = normalizedLine.length - 1; i >= 0; i--) {
    reversedLine += normalizedLine[i];
  }

  return normalizedLine === reversedLine;
};

console.log(isPalindrome('Лёша на полке клопа нашёл '));
