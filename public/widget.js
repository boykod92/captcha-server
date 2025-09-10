// public/widget.js
(async () => {
  try {
    const response = await fetch("/api/get-captcha");
    const { imageUrl, redirectUrl } = await response.json();

    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.position = "absolute";
    img.style.left = Math.random() * (window.innerWidth - 150) + "px";
    img.style.top = Math.random() * (window.innerHeight - 150) + "px";
    img.style.cursor = "pointer";
    img.style.width = "150px";

    img.onclick = () => window.open(redirectUrl, "_blank");

    document.body.appendChild(img);
  } catch (e) {
    console.error("Widget error:", e);
  }
})();
