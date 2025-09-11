export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { token, mouseMoves, timeSinceShow } = req.body;

  // минимальные проверки для ботов
  const success = mouseMoves >= 5 && timeSinceShow >= 500; // 5 движений мыши, 0.5 сек

  res.status(200).json({ success });
}
