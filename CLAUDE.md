# Amazon Research OS — プロジェクト指示

## 月次販売分析レポートのフォーマット

**販売データ（CSV）を受け取って月次分析レポートを作成するときは、必ず `prompts/monthly-analysis-report.txt` の指示に従うこと。**

### ワークフロー（3フェーズ制・厳守）

```
PHASE 1: テキスト分析レポートを出力 → ユーザーに確認を求める
PHASE 2: ユーザー承認後に HTML ファイルを生成する
PHASE 3: ユーザー承認後に GitHub Pages へ公開する
```

- **各フェーズを連続実行しないこと。** 必ず各フェーズ後に次の確認を取ること。
  - PHASE 1 末尾: 「HTMLを作成してよいですか？」
  - PHASE 2 末尾: 「GitHub Pages に公開しますか？」
- PHASE 1 出力形式: Markdown テキスト（チャット上に表示）
- PHASE 2 出力形式: HTML（`babyrobe_report.html` と同一のCSSデザインシステムを使用）
  - 一時出力先: `outputs/reports/[商品名]_analysis_[YYYYMM].html`
- PHASE 3（GitHub Pages 公開）の手順:
  1. `outputs/reports/[ファイル名].html` を `reports/2026-06/[ascii名].html` にコピー
  2. `reports/index.html` の `REPORTS` 配列に新エントリを追加（id / createdAt / period / product / category / brand / asin / platforms / summary / kpi[] / tags[] / file）
  3. 変更をコミット＆プッシュ（`git add reports/ && git commit -m "docs: add [商品名] report [YYYYMM]" && git push origin master`）
  4. 公開 URL を案内: `https://yukiura-code.github.io/amazon-research-os/reports/`
- 構成: 月次サマリー / チャネル構成 / モール別総括 / ユニットエコノミクス / 顧客インサイト / アクション案（6セクション固定）

CSVを貼り付けられたら、分析を始める前に `prompts/monthly-analysis-report.txt` を読み込んで構成・ルールを確認すること。
