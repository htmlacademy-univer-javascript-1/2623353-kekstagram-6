function checkLength(line, maxLength) {
  return line.length <= maxLength;
}

function isPalindrome(line) {
  const normalizedLine = line.replaceAll(' ', '').toLowerCase();
  let reversedLine = '';
  for (let i = normalizedLine.length - 1; i >= 0; i--) {
    reversedLine += normalizedLine[i];
  }
  return normalizedLine === reversedLine;
}


