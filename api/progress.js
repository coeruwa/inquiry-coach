import { getSql, ensureTable, setCors } from '../lib/db.js';

const MAX_HISTORY = 100;
const MAX_TEXT = 4000;

// 生徒アプリから進捗スナップショットを受け取り upsert する
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const b = req.body || {};
    const id = String(b.studentId || '').slice(0, 64);
    const name = String(b.name || '').trim().slice(0, 50);
    if (!id || !name) {
      return res.status(400).json({ error: 'studentId と name は必須です' });
    }

    const className = String(b.className || '').trim().slice(0, 30);
    const topic = b.topic ? String(b.topic).slice(0, 200) : null;
    const step = Math.min(Math.max(parseInt(b.step, 10) || 0, 0), 4);
    const turnCount = Math.max(parseInt(b.turnCount, 10) || 0, 0);
    const researchCount = Math.max(parseInt(b.researchCount, 10) || 0, 0);
    const themeCard = b.themeCard && typeof b.themeCard === 'object' ? b.themeCard : null;

    const history = Array.isArray(b.history)
      ? b.history.slice(-MAX_HISTORY).map(m => ({
          role: m && m.role === 'user' ? 'user' : 'assistant',
          content: String((m && m.content) || '').slice(0, MAX_TEXT),
        }))
      : [];

    const researchHistory = Array.isArray(b.researchHistory)
      ? b.researchHistory.slice(0, 50).map(r => ({
          keyword: String((r && r.keyword) || '').slice(0, 200),
          at: r && r.at ? r.at : null,
        }))
      : [];

    const sql = getSql();
    await ensureTable(sql);

    await sql`
      INSERT INTO students
        (id, name, class_name, topic, step, turn_count, research_count,
         theme_card, history, research_history, updated_at)
      VALUES
        (${id}, ${name}, ${className}, ${topic}, ${step}, ${turnCount}, ${researchCount},
         ${themeCard ? JSON.stringify(themeCard) : null}::jsonb,
         ${JSON.stringify(history)}::jsonb,
         ${JSON.stringify(researchHistory)}::jsonb,
         now())
      ON CONFLICT (id) DO UPDATE SET
        name             = EXCLUDED.name,
        class_name       = EXCLUDED.class_name,
        topic            = EXCLUDED.topic,
        step             = EXCLUDED.step,
        turn_count       = EXCLUDED.turn_count,
        research_count   = EXCLUDED.research_count,
        theme_card       = EXCLUDED.theme_card,
        history          = EXCLUDED.history,
        research_history = EXCLUDED.research_history,
        updated_at       = now()
    `;

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
