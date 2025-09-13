document.addEventListener('DOMContentLoaded', () => {

  // Создаём оверлей
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  });
  document.body.appendChild(overlay);

  // Картинка капчи
  const img = document.createElement('img');
  img.src = 'https://i.imgur.com/CPWtQC9.png'; // твоя картинка
  img.style.position = 'absolute';
  img.style.width = '20vw';      // 20% ширины экрана
  img.style.maxWidth = '200px';  // не больше 200px
  img.style.minWidth = '100px';  // не меньше 100px
  img.style.height = 'auto';     // сохраняем пропорции
  img.style.cursor = 'pointer';
  overlay.appendChild(img);

  // Функция для вычисления актуального размера картинки
  function getImgSize() {
    return img.getBoundingClientRect().width;
  }

  // Перемещение картинки случайным образом
  function moveImage() {
    const size = getImgSize();
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    img.style.left = Math.floor(Math.random() * maxX) + 'px';
    img.style.top = Math.floor(Math.random() * maxY) + 'px';
  }
  moveImage();
  const moveInterval = setInterval(moveImage, 2000);

  // Таймер и движение мыши / тача
  let mouseMoves = 0;
  let startTime = Date.now();

  // Порог движений: на мобильных меньше
  const minMoves = /Mobi|Android/i.test(navigator.userAgent) ? 1 : 5;

  document.addEventListener('mousemove', () => { mouseMoves++; });
  document.addEventListener('touchmove', () => { mouseMoves++; });

  // Клик по картинке
  img.addEventListener('click', () => {
    const timeSinceShow = Date.now() - startTime;

    if (mouseMoves >= minMoves && timeSinceShow >= 500) {
      clearInterval(moveInterval);
      overlay.remove();

      // --- Добавляем событие в Яндекс.Метрику ---
      if (typeof ym === 'function') {
        ym(83703373, 'reachGoal', 'valid_user');
      }
    } else {
      alert('Капча не пройдена, попробуйте ещё раз.');
    }
  });

});
