export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const captchaUrl = 'https://i.ibb.co/s9CtxcVd/your-image.png';

  // генерируем токен сессии
  const token = Math.random().toString(36).substring(2, 15);

  // в этой версии зона = вся картинка, защита через движение мыши и таймер
  res.status(200).json({ captchaUrl, token });
}
