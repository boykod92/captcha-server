(async function () {
  try {
    // 1. Получаем данные с сервера
    const res = await fetch("https://captcha-server-snowy.vercel.app/api/get-captcha");
    const data = await res.json();

    // 2. Создаём оверлей
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

    // 3. Вставляем картинку
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.style.position = "absolute";
    img.style.width = "150px";
    img.style.cursor = "pointer";

    // Случайное место
    const randX = Math.random() * (window.innerWidth - 160);
    const randY = Math.random() * (window.innerHeight - 160);
    img.style.left = randX + "px";
    img.style.top = randY + "px";

    overlay.appendChild(img);

    // 4. Обработка клика
    img.addEventListener("click", async () => {
      overlay.remove(); // убираем блюр

      // (опционально) валидация
      try {
        const validateRes = await fetch("https://captcha-server-snowy.vercel.app/api/validate-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: "prj_PdKIsJzxmXqfuFk2Xq6OLfUtrj1Z",
            mousePath: [
              { x: 0, y: 0, t: Date.now() },
              { x: 50, y: 50, t: Date.now() + 500 }
            ],
            time: 2500
          }),
        });

        const result = await validateRes.json();
        console.log("Validate result:", result);
      } catch (err) {
        console.error("Ошибка валидации:", err);
      }

      // Переход
      if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank");
      }
    });
  } catch (err) {
    console.error("Ошибка в widget.js:", err);
  }
})();
