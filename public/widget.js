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
    img.src = 'https://i.ibb.co/s9CtxcVd/your-image.png';
    img.style.position = 'absolute';
    img.style.cursor = 'pointer';
    img.style.maxWidth = '150px';
    img.style.maxHeight = '150px';
    overlay.appendChild(img);

    function setRandomPosition() {
      const padding = 20;
      const maxX = window.innerWidth - img.width - padding;
      const maxY = window.innerHeight - img.height - padding;
      img.style.left = Math.floor(Math.random() * maxX + padding) + 'px';
      img.style.top = Math.floor(Math.random() * maxY + padding) + 'px';
    }

    img.onload = setRandomPosition;

    function removeOverlay() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    img.addEventListener('click', removeOverlay);
    img.addEventListener('touchstart', removeOverlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) removeOverlay();
    });
    overlay.addEventListener('touchstart', (e) => {
      if (e.target === overlay) removeOverlay();
    });
  });
})();
