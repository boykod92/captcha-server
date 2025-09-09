module.exports = async (req, res) => {
  console.log('API hit:', req.method, req.url);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const body = req.body || {};
  console.log('Body:', body);

  const { fingerprint, mousePath, time, api_key, honeypot } = body;

  if (!api_key || !mousePath || !time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const apiKeys = new Map([
    ['test_key_123', { expires: Infinity, limits: 10000 }]
  ]);

  if (!apiKeys.has(api_key)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (honeypot) {
    return res.status(403).json({ error: 'Honeypot triggered' });
  }

  if (mousePath.length < 10 || time < 2000) {
    return res.status(403).json({ error: 'Bot detected' });
  }

  let totalDist = 0, totalTime = 0;
  for (let i = 1; i < mousePath.length; i++) {
    const dx = mousePath[i].x - mousePath[i - 1].x;
    const dy = mousePath[i].y - mousePath[i - 1].y;
    totalDist += Math.sqrt(dx * dx + dy * dy);
    totalTime += (mousePath[i].t - mousePath[i - 1].t) || 1;
  }

  const avgSpeed = totalDist / (totalTime / 1000);
  if (avgSpeed > 500 || avgSpeed === 0) {
    return res.status(403).json({ error: 'Suspicious mouse behavior' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.json({ status: 'OK', human_score: 0.9 });
};
