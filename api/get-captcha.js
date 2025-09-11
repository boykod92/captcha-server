// api/get-captcha.js
export default function handler(req, res) {
  res.status(200).json({
    imageUrl: "https://i.ibb.co/3khQ9cK/captcha.png", // прямой URL картинки
    redirectUrl: "https://captcha11.tilda.ws/"       // куда вести после клика
  });
}
