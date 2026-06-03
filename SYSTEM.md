# Amazon Research OS｜ナレッジ管理システム

> BabyGoo / fungoo｜株式会社ASAGIRI｜社内限定

---

## システム概要

分析レポートを自動生成・永久保存・公開するための仕組みです。

```
分析依頼（Claude）
    ↓
HTMLレポート生成 → reports/YYYY-MM/商品名.html
    ↓
ナレッジポータル更新 → reports/index.html
    ↓
publish.bat で GitHub Pages へ公開（永久URL）
```

---

## フォルダ構造

```
Amazon Research OS/
├── reports/                    ← 公開されるナレッジ（Git管理）
│   ├── index.html              ← ナレッジポータル（全レポート一覧）
│   └── YYYY-MM/                ← 年月別フォルダ
│       └── 商品名.html          ← 個別レポート
│
├── data/                       ← 元データ（Git管理・非公開可）
│   └── YYYY-MM/
│       ├── Amazon日報_商品名.csv
│       └── 楽天日報_商品名.csv
│
├── publish.bat                 ← ワンクリック公開スクリプト
└── SYSTEM.md                   ← このファイル
```

---

## 通常の使い方（毎回）

### Step 1｜データを準備する
```
data/YYYY-MM/ フォルダに CSVファイルを入れる
例: data/2026-07/Amazon日報_ベビーバスローブ.csv
```

### Step 2｜Claudeに分析を依頼する
```
「〇〇の分析をしてください。CSVは data/2026-07/ にあります」
```
Claude が自動で：
- データを読み込み・分析
- `reports/YYYY-MM/商品名.html` にレポートを生成
- `reports/index.html` のREPORTS配列に1行追加

### Step 3｜公開する（30秒）
```
publish.bat をダブルクリック
```
→ GitHub Pages に自動デプロイ  
→ 永久URLが発行される

---

## 初回のみ｜GitHub Pages セットアップ

GitHub Pages を使うと **無料・永久・アカウント不要** で公開できます。

### 1. GitHubでリポジトリを作成
1. https://github.com/new を開く
2. Repository name: `amazon-research-os`
3. **Private**（社内限定の場合）または Public を選択
4. 「Create repository」をクリック

### 2. リモートを設定（一度だけ）
```bash
git remote add origin https://github.com/YOUR_USERNAME/amazon-research-os.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pages を有効化
1. リポジトリ → Settings → Pages
2. Source: `main` ブランチ、`/ (root)` フォルダ
3. Save → URLが発行される（例: `https://YOUR_USER.github.io/amazon-research-os/`）

### 4. publish.bat のURL欄を修正
```batch
echo  URL: https://YOUR_USER.github.io/amazon-research-os/reports/
```
→ `YOUR_USER` を実際のGitHubユーザー名に変更

---

## ナレッジポータル（reports/index.html）の見方

| 機能 | 操作 |
|------|------|
| 全レポート一覧 | トップページに自動表示 |
| モール別絞り込み | ツールバーの「Amazon」「楽天」ボタン |
| 商品検索 | 検索バーに商品名・ASIN・タグを入力 |
| レポートを開く | カード右下の「レポートを開く →」ボタン |

---

## Claudeへの依頼テンプレート

### 新規分析依頼
```
以下のデータを分析してレポートを作成してください。
- データ: data/YYYY-MM/ のCSVファイル
- 対象商品: 〇〇
- 分析期間: YYYY年M〜M月
- 注目ポイント: （あれば）

作成後、reports/index.html のREPORTS配列にも追加してください。
```

### 既存レポートの更新
```
reports/YYYY-MM/商品名.html を更新してください。
新しいデータ: data/YYYY-MM/...csv
```

---

## ファイル命名規則

| 対象 | 命名規則 | 例 |
|------|----------|-----|
| レポートHTML | `商品名-略称.html`（英数小文字） | `babyrobe.html` |
| CSVデータ | `モール日報_商品名.csv` | `Amazon日報_ベビーバスローブ.csv` |
| フォルダ | `YYYY-MM` | `2026-07` |

---

## 現在のレポート一覧

| 日付 | 商品 | 期間 | モール | ファイル |
|------|------|------|--------|----------|
| 2026-06-03 | ベビーバスローブ | 2026年3〜5月 | Amazon・楽天 | reports/2026-06/babyrobe.html |

---

*このファイルはClaudeが新規レポート追加時に自動更新します。*
