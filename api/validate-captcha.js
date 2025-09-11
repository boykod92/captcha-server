export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { clickX, clickY, token } = req.body;

  // проверяем токен и координаты
  // здесь пример, реально нужно сопоставлять token с zone на сервере
  const zone = { x: 100, y: 100, width: 100, height: 100 }; // пример, замените на реальные

  const hit =
    clickX >= zone.x &&
    clickX <= zone.x + zone.width &&
    clickY >= zone.y &&
    clickY <= zone.y + zone.height;

  res.status(200).json({ success: hit });
}
