# bijyou（ビジュー）

バレエを学ぶ人のための「バレエ上達サポートWebサイト」。

**知る → 見る → 練習する → 記録する → 復習する** という学習サイクルを、
1つのWebサイトで完結させることを目的としたアプリです。

## 主な機能

| 機能 | 内容 |
|---|---|
| パ辞書 | バレエの技（パ）の意味・動き方・注意点・使用場面を一覧表示 |
| お手本動画 | 各パに紐づく動画URLをiframeで表示 |
| レッスン日記 | 練習内容の記録・一覧・削除 |
| TODO | 次回の練習課題の追加・完了切替・削除 |
| クイズ | パの名前・意味をクイズ形式で復習、正誤判定とスコア表示 |

## 技術構成

- フロントエンド：Next.js（App Router） / React / TypeScript / Chakra UI v3
- バックエンド：Python / FastAPI / SQLModel
- データベース：PostgreSQL（Docker）

## ディレクトリ構成

```
bijyou-practice/
├─ frontend/          # Next.js アプリ
│  └─ app/
│     ├─ page.tsx           # パ辞書（トップページ）
│     ├─ layout.tsx
│     ├─ providers.tsx      # ChakraProvider
│     ├─ globals.css
│     ├─ components/
│     │  └─ SiteNav.tsx
│     ├─ lib/
│     │  └─ api.ts          # FastAPIとの通信をまとめたヘルパー
│     ├─ logs/page.tsx      # レッスン日記
│     ├─ todo/page.tsx      # TODO
│     └─ quiz/page.tsx      # クイズ
├─ backend/           # FastAPI アプリ
│  ├─ main.py         # エンドポイント定義
│  ├─ models.py       # SQLModelテーブル定義
│  ├─ database.py     # DB接続
│  ├─ seed.py         # 初期データ投入
│  ├─ requirements.txt
│  └─ .env.example
├─ docker-compose.yml # PostgreSQL
└─ .gitignore
```

## セットアップ・起動方法

### 1. PostgreSQLを起動（Docker）

```bash
docker compose up -d
```

### 2. FastAPIを起動

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windowsは .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # 必要に応じてDB接続情報を編集
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API本体: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

起動時にテーブルが自動作成され、パ辞書・クイズのサンプルデータが自動投入されます
（すでにデータがある場合は投入されません）。

WSL2上でFastAPIを動かし、Windows側のNext.jsから接続する場合は
`--host 0.0.0.0` の指定が必要です。

### 3. Next.jsを起動

```bash
cd frontend
npm install
npm run dev
```

- サイト: http://localhost:3000

## URL設計

| パス | 内容 |
|---|---|
| `/` | パ辞書 |
| `/logs` | レッスン日記 |
| `/todo` | TODO（APIは `/todos`） |
| `/quiz` | クイズ |

## API一覧

```
GET    /pas
GET    /logs
POST   /logs
DELETE /logs/{id}
GET    /todos
POST   /todos
PUT    /todos/{id}
DELETE /todos/{id}
GET    /quiz
POST   /quiz
```

## GitHubへのpush方法

```bash
cd bijyou-practice
git init
git add .
git commit -m "Initial commit: bijyou app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 今後の予定

- お手本動画と自分の練習動画を横並びで比較する機能
- クイズ問題の追加
