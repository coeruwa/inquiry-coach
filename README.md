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

## 📁 ファイル構成

```
inquiry-coach/
├── api/
│   └── chat.js        # Claude API プロキシ（Edge Function）
├── public/
│   └── index.html     # フロントエンド
├── vercel.json        # Vercel設定
├── package.json
└── README.md
```

## 🔒 セキュリティ

- APIキーはVercelの環境変数で管理（コードには含まれない）
- Edge Functionがプロキシとして動作し、クライアントにAPIキーを露出しない

## 📝 カスタマイズ

### テーマ・デザイン変更
`public/index.html` の CSS変数（`:root`）を編集

### プロンプト変更
`public/index.html` の `callClaude()` 関数内の `system` プロンプトを編集

---

Made with ❤️ for 探究学習
