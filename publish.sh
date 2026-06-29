#!/bin/bash
set -e

echo ""
echo "======================================================"
echo " Amazon Research OS - ナレッジ公開スクリプト (Mac)"
echo "======================================================"
echo ""

cd "$(dirname "$0")"

# ── Git ステータス確認 ──────────────────────────────
if ! git status > /dev/null 2>&1; then
  echo "[ERROR] Gitリポジトリが初期化されていません。"
  exit 1
fi

# ── コミットメッセージを自動生成 ───────────────────
TODAY=$(date +%Y-%m-%d)
MSG="docs: add report ${TODAY}"

# ── ステージング & コミット ────────────────────────
echo "[1/3] 変更をステージング中..."
git add reports/ data/ 2>/dev/null || git add reports/
git status --short

echo ""
echo "[2/3] コミット中: ${MSG}"
if ! git commit -m "${MSG}"; then
  echo "[INFO] 変更なし、またはコミット済みです。"
fi

# ── プッシュ ───────────────────────────────────────
echo ""
echo "[3/3] GitHub Pages へ公開中..."
git push origin master

echo ""
echo "======================================================"
echo " 公開完了！"
echo " URL: https://yukiura-code.github.io/amazon-research-os/reports/"
echo "======================================================"
echo ""
