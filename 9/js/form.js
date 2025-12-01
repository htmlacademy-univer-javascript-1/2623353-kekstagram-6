
document.addEventListener('DOMContentLoaded', () => {

  const testButton = document.createElement('button');
  testButton.textContent = 'ТЕСТ: Открыть форму';
  testButton.style.position = 'fixed';
  testButton.style.top = '10px';
  testButton.style.left = '10px';
  testButton.style.zIndex = '9999';
  document.body.appendChild(testButton);

  testButton.addEventListener('click', () => {
    console.log('Тестовая кнопка нажата');
    const overlay = document.querySelector('.img-upload__overlay');
    if (overlay) {
      console.log('Overlay найден, удаляю класс hidden');
      overlay.classList.remove('hidden');
      console.log('Теперь классы overlay:', overlay.classList);
    } else {
      console.error('Overlay не найден!');
    }
  });

  console.log('Тестовая кнопка добавлена');
});
