// api/get-captcha.js
export default function handler(req, res) {
  res.status(200).json({
    imageUrl: "https://github.com/boykod92/captcha-server/blob/main/20b509d9-4e79-4f24-abef-3e5d3a8a31bc.png", // заменишь на свой путь
    redirectUrl: "https://captcha11.tilda.ws/", // ссылка, куда клик ведёт
  });
}
