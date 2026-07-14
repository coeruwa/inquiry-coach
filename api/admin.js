import { getSql, ensureTable, setCors } from '../lib/db.js';

// 先生用API: 生徒一覧 / 生徒詳細 / 生徒削除
// 認証: X-Admin-Password ヘッダーを環境変数 ADMIN_PASSWORD と照合
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD が未設定です。Vercelの環境変数に追加してください。' });
  }
  if ((req.headers['x-admin-password'] || '') !== pass) {
    return res.status(401).json({ error: 'パスワードが違います' });
  }

  try {
    const sql = getSql();
    await ensureTable(sql);
    const id = req.query && req.query.id ? String(req.query.id) : null;

    if (req.method === 'GET' && !id) {
      const rows = await sql`
        SELECT id, name, class_name, topic, step, turn_count, research_count,
               (theme_card IS NOT NULL) AS has_theme, created_at, updated_at
        FROM students
        ORDER BY updated_at DESC
      `;
      return res.status(200).json({ students: rows });
    }

    if (req.method === 'GET' && id) {
      const rows = await sql`SELECT * FROM students WHERE id = ${id}`;
      if (rows.length === 0) return res.status(404).json({ error: '生徒が見つかりません' });
      return res.status(200).json({ student: rows[0] });
    }

    if (req.method === 'DELETE' && id) {
      await sql`DELETE FROM students WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
