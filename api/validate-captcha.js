// Нет нужды в express/body-parser — Vercel обрабатывает req.body для POST
module.exports = async (req, res) => {
  // Парсинг body (Vercel делает автоматически)
  let body;
  try {
    body = await req.json(); // Для POST JSON
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  const { fingerprint, mousePath, time, api_key, honeypot } = body;

  // Временная база ключей
  const apiKeys = new Map([
    ['test_key_123', { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), limits: 10000 }]
  ]);
  const blockedFingerprints = new Set();

  if (!apiKeys.has(api_key) || apiKeys.get(api_key).expires < new Date()) {
    return res.status(401).json({ error: 'Invalid or expired API key' });
  }
  if (blockedFingerprints.has(fingerprint)) {
    return res.status(403).json({ error: 'Blocked fingerprint' });
  }
  if (honeypot) {
    return res.status(403).json({ error: 'Honeypot triggered' });
  }
  if (mousePath.length < 10 || time < 2000) {
    return res.status(403).json({ error: 'Bot detected' });
  }

  // Анализ траектории мыши
  let totalDist = 0, totalTime = 0;
  for (let i = 1; i < mousePath.length; i++) {
    const dx = mousePath[i].x - mousePath[i - 1].x;
    const dy = mousePath[i].y - mousePath[i - 1].y;
    totalDist += Math.sqrt(dx * dx + dy * dy);
    totalTime += mousePath[i].t - mousePath[i - 1].t;
  }
  const avgSpeed = totalTime > 0 ? totalDist / (totalTime / 1000) : 0;
  if (avgSpeed > 500 || avgSpeed === 0) {
    return res.status(403).json({ error: 'Suspicious mouse behavior' });
  }

  res.json({ status: 'OK', human_score: 0.9 });
};
