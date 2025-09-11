(async function () {
  try {
    // Загружаем данные с API
    const res = await fetch("/api/get-captcha");
    const data = await res.json();

    // Создаем оверлей
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(255,255,255,0.7)";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);

    // Картинка
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.style.position = "absolute";
    img.style.width = "150px";
    img.style.cursor = "pointer";

    // Рандомное место
    const randX = Math.random() * (window.innerWidth - 160);
    const randY = Math.random() * (window.innerHeight - 160);
    img.style.left = randX + "px";
    img.style.top = randY + "px";

    overlay.appendChild(img);

    // Клик: снимаем оверлей и ведём на ссылку
    img.addEventListener("click", () => {
      overlay.remove();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank");
      }
    });
  } catch (err) {
    console.error("Ошибка в widget.js:", err);
  }
})();
