(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.webkitBackdropFilter = 'blur(8px)';
    overlay.style.zIndex = 9999;
    document.body.appendChild(overlay);

    const img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.cursor = 'pointer';
    img.style.maxWidth = '150px';
    img.style.maxHeight = '150px';
    overlay.appendChild(img);

    let captchaData;

    // получаем капчу с сервера
    fetch('https://captcha-server-snowy.vercel.app/api/get-captcha')
      .then(res => res.json())
      .then(data => {
        captchaData = data;
        img.src = data.captchaUrl;
        moveImageRandom();
        // меняем позицию каждые 1.5 секунды
        setInterval(moveImageRandom, 1500);
      });

    function moveImageRandom() {
      const padding = 20;
      const maxX = window.innerWidth - img.width - padding;
      const maxY = window.innerHeight - img.height - padding;
      img.style.left = Math.floor(Math.random() * maxX + padding) + 'px';
      img.style.top = Math.floor(Math.random() * maxY + padding) + 'px';
    }

    img.addEventListener('click', () => {
      const rect = img.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      // отправляем на сервер проверку
      fetch('https://captcha-server-snowy.vercel.app/api/validate-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clickX,
          clickY,
          token: captchaData.token
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) overlay.remove();
          else alert('Не попали в правильную зону! Попробуйте снова.');
        });
    });
  });
})();
