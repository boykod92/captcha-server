module.exports = async (req, res) => {
  console.log('API called: Method', req.method, 'URL', req.url); // Дебаг в Vercel Logs

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  let body;
  try {
    body = req.body || {}; // Vercel парсит JSON автоматически
    console.log('Body received:', body); // Дебаг
  } catch (e) {
    console.error('Parse error:', e);
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const { fingerprint, mousePath, time, api_key, honeypot } = body;

  if (!api_key || !mousePath || !time) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const apiKeys = new Map([
    ['test_key_123', { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), limits: 10000 }]
  ]);
  const blockedFingerprints = new Set();

  if (!apiKeys.has(api_key)) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  if (honeypot) {
    res.status(403).json({ error: 'Honeypot triggered' });
    return;
  }
  if (mousePath.length < 10 || time < 2000) {
    res.status(403).json({ error: 'Bot detected' });
    return;
  }

  // Анализ траектории
  let totalDist = 0, totalTime = 0;
  for (let i = 1; i < mousePath.length; i++) {
    const dx = mousePath[i].x - mousePath[i - 1].x;
    const dy = mousePath[i].y - mousePath[i - 1].y;
    totalDist += Math.sqrt(dx * dx + dy * dy);
    totalTime += (mousePath[i].t - mousePath[i - 1].t) || 1;
  }
  const avgSpeed = totalDist / (totalTime / 1000);
  if (avgSpeed > 500 || avgSpeed === 0) {
    res.status(403).json({ error: 'Suspicious mouse behavior' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'OK', human_score: 0.9 });
};
