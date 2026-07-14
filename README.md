# 探究コーチ (Inquiry Coach)

中学・高校生が自分だけの「探究テーマ（問い）」を見つけるための対話型AIコーチシステム。

## 🚀 Vercelへのデプロイ手順

### 1. GitHubリポジトリを作成

```bash
# このフォルダで
git init
git add .
git commit -m "Initial commit"

# GitHubでリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/inquiry-coach.git
git push -u origin main
```

### 2. Vercelでデプロイ

1. [Vercel](https://vercel.com/) にログイン（GitHubアカウントで可）
2. 「Add New Project」をクリック
3. 作成したGitHubリポジトリを選択
4. 「Deploy」をクリック

### 3. 環境変数を設定

デプロイ後、Vercelのプロジェクト設定で：

1. 「Settings」→「Environment Variables」
2. 以下を追加：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api03-...`（AnthropicのAPIキー）
3. 「Save」をクリック
4. 「Deployments」→ 最新のデプロイで「Redeploy」

### 4. 完了！

`https://your-project-name.vercel.app` でアクセス可能になります。

---

## 👩‍🏫 先生用ダッシュボード（管理者ページ）のセットアップ

生徒の進捗（テーマ・ステップ・会話ログ・リサーチ履歴）を一覧できる管理者ページが
`https://your-project-name.vercel.app/admin` にあります。利用にはDBと環境変数の設定が必要です。

### 1. データベース（Neon Postgres）を接続

1. Vercelのプロジェクトを開き「**Storage**」タブへ
2. 「Create Database」→ **Neon (Postgres)** を選択（無料プランでOK）
3. 「Connect」でこのプロジェクトに接続 → `DATABASE_URL` などの環境変数が自動追加される

※ テーブルは初回アクセス時に自動作成されるので、SQLを実行する必要はありません。

### 2. 管理者パスワードを設定

1. 「Settings」→「Environment Variables」
2. 以下を追加：
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: 先生だけが知るパスワード（十分に長いものを推奨）

### 3. 再デプロイ

「Deployments」→ 最新のデプロイで「Redeploy」。
その後 `/admin` を開き、設定したパスワードでログインできれば完了です。

### 仕組み

- 生徒は初回アクセス時に「クラス・名前」を入力（ブラウザに保存され、次回からは不要）
- 会話やリサーチのたびに進捗が自動でDBへ送信される
- 会話内容はブラウザにも保存されるため、リロードしても続きから再開できる
- ヘッダー右上の「↺」ボタンで会話をリセット可能

---

## 📁 ファイル構成

```
inquiry-coach/
├── api/
│   ├── chat.js        # Claude API プロキシ
│   ├── progress.js    # 生徒の進捗を保存（生徒アプリ → DB）
│   └── admin.js       # 先生用API（一覧・詳細・削除、パスワード認証）
├── lib/
│   └── db.js          # Neon Postgres 接続・テーブル定義
├── public/
│   ├── index.html     # 生徒用フロントエンド
│   └── admin.html     # 先生用ダッシュボード（/admin）
├── vercel.json        # Vercel設定
├── package.json
└── README.md
```

## 🔒 セキュリティ

- APIキーはVercelの環境変数で管理（コードには含まれない）
- Edge Functionがプロキシとして動作し、クライアントにAPIキーを露出しない
- 先生用API（/api/admin）は `ADMIN_PASSWORD` によるパスワード認証つき
- 生徒データはNeon (Postgres) に保存。保存するのは名前・クラス・会話ログ・リサーチキーワードのみ

## 📝 カスタマイズ

### テーマ・デザイン変更
`public/index.html` の CSS変数（`:root`）を編集

### プロンプト変更
`public/index.html` の `callClaude()` 関数内の `system` プロンプトを編集

---

Made with ❤️ for 探究学習
