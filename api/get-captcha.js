// api/get-captcha.js
export default function handler(req, res) {
  res.status(200).json({
    imageUrl: "https://captcha-server-snowy.vercel.app/captcha.png", // заменишь на свой путь
    redirectUrl: "https://example.com", // ссылка, куда клик ведёт
  });
}
