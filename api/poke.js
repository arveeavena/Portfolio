/* global process */
// Poke counter. GET returns the total, POST adds one and returns the new total.
// Stored in Upstash Redis through its REST API (env vars come from the Vercel
// Upstash integration). Each IP gets a small per-minute budget so the count
// can't be spammed with a script.

const ALLOWED_ORIGINS = [
  'https://arveeavena.site',
  'https://www.arveeavena.site',
  'https://arveeavena.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

const KEY = 'pokes:total';
const PER_MINUTE = 30;

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(commands) {
  const r = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()).map((x) => x.result);
}

function getIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0] : req.socket?.remoteAddress ?? 'unknown').trim();
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  const origin = req.headers.origin ?? '';
  if (origin) {
    const allowed = ALLOWED_ORIGINS.includes(origin);
    res.setHeader('Access-Control-Allow-Origin', allowed ? origin : 'null');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!REDIS_URL || !REDIS_TOKEN) return res.status(503).json({ error: 'Counter not configured' });

  try {
    if (req.method === 'GET') {
      const [total] = await redis([['GET', KEY]]);
      return res.status(200).json({ total: Number(total) || 0 });
    }

    const minute = Math.floor(Date.now() / 60000);
    const rlKey = `pokes:rl:${getIp(req)}:${minute}`;
    const [used] = await redis([['INCR', rlKey], ['EXPIRE', rlKey, 70]]);
    if (used > PER_MINUTE) {
      const [total] = await redis([['GET', KEY]]);
      return res.status(429).json({ total: Number(total) || 0, error: 'Slow down' });
    }
    const [total] = await redis([['INCR', KEY]]);
    return res.status(200).json({ total });
  } catch {
    return res.status(502).json({ error: 'Counter unavailable' });
  }
}
