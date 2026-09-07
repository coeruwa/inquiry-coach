export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-5',
        max_tokens: body.max_tokens || 1000,
        system: body.system || '',
        messages: body.messages || [],
        // 明示的に無効化しないと、Claude Sonnet 5系は非表示のthinkingブロックに
        // 出力トークンを消費することがある。このアプリは深い推論が不要なため常時オフ。
        thinking: body.thinking || { type: 'disabled' },
        ...(body.tools ? { tools: body.tools } : {}),
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
