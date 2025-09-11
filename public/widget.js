document.addEventListener('DOMContentLoaded', async () => {

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

  // Загружаем капчу
  let captchaData;
  try {
    const res = await fetch('/api/get-captcha');
    captchaData = await res.json();
  } catch (e) {
    console.error('Ошибка при загрузке капчи:', e);
    return;
  }

  // Создаём картинку
  const img = document.createElement('img');
  img.src = captchaData.captchaUrl;
  img.style.position = 'absolute';
  img.style.width = '150px';
  img.style.height = '150px';
  img.style.cursor = 'pointer';
  overlay.appendChild(img);

  // Перемещение картинки
  function moveImage() {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 150;
    img.style.left = Math.floor(Math.random() * maxX) + 'px';
    img.style.top = Math.floor(Math.random() * maxY) + 'px';
  }
  moveImage();
  const moveInterval = setInterval(moveImage, 1500);

  // Таймер и движение мыши
  let mouseMoves = 0;
  let startTime = Date.now();

  document.addEventListener('mousemove', () => { mouseMoves++; });

  // Клик по картинке
  img.addEventListener('click', async () => {
    const timeSinceShow = Date.now() - startTime;

    try {
      const res = await fetch('/api/validate-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaData.token, mouseMoves, timeSinceShow })
      });
      const data = await res.json();
      if (data.success) {
        clearInterval(moveInterval);
        overlay.remove();
      } else {
        alert('Капча не пройдена, попробуйте ещё раз.');
      }
    } catch (e) {
      console.error('Ошибка при проверке капчи:', e);
    }
  });

});
