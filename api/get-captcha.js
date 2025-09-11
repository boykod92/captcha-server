export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // картинка капчи
  const captchaUrl = 'https://i.ibb.co/s9CtxcVd/your-image.png';

  // случайная правильная зона
  const zone = {
    x: Math.floor(Math.random() * 200 + 50),  // пример
    y: Math.floor(Math.random() * 200 + 50),
    width: 100,
    height: 100
  };

  // токен сессии для защиты
  const token = Math.random().toString(36).substring(2, 15);

  // можно хранить токен и zone в памяти или базе на сервере

  res.status(200).json({ captchaUrl, zone, token });
}
