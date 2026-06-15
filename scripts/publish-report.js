#!/usr/bin/env node
/**
 * publish-report.js  ─  PHASE 3 自動化スクリプト
 *
 * HTMLレポートを reports/ に配置し、reports/index.html を更新して
 * GitHub Pages へ git push するまでを1コマンドで実行する。
 *
 * 使い方:
 *   node scripts/publish-report.js \
 *     --src  outputs/reports/xxx.html \
 *     --dest 2026-06/xxx.html \
 *     --meta outputs/reports/xxx.meta.json
 *
 * npm script 経由:
 *   npm run publish:report -- --src ... --dest ... --meta ...
 *
 * --meta JSON ファイルのフォーマット (reports/index.html REPORTS 配列の 1 エントリ):
 * {
 *   "id":        "xxx-YYYYMM",
 *   "createdAt": "YYYY-MM-DD",
 *   "period":    "YYYY年M〜M月",
 *   "product":   "商品名",
 *   "category":  "カテゴリ",
 *   "brand":     "ブランド名",
 *   "asin":      "ASIN / SKU",
 *   "platforms": ["楽天"],
 *   "summary":   "サマリー文",
 *   "kpi":       [{ "label": "...", "value": "...", "good": true }],
 *   "tags":      ["タグ1", "タグ2"]
 * }
 * ※ "file" フィールドは --dest の値から自動設定されるため不要。
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// ── 引数パーサ ──────────────────────────────────────────────────────────
function parseArgs() {
  const raw = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < raw.length; i++) {
    if (raw[i].startsWith('--') && i + 1 < raw.length && !raw[i + 1].startsWith('--')) {
      out[raw[i].slice(2)] = raw[i + 1];
      i++;
    }
  }
  return out;
}

// ── REPORTS エントリを reports/index.html に挿入 ────────────────────────
function updateIndex(entry) {
  const indexPath = path.join(ROOT, 'reports', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  const MARKER = '/* ── ここに次のレポートを追加 ──';
  const pos = html.indexOf(MARKER);
  if (pos === -1) throw new Error('reports/index.html の挿入マーカーが見つかりません');

  // kpi 配列を整形
  const kpiStr = entry.kpi
    .map(k => `      { label: ${JSON.stringify(k.label)}, value: ${JSON.stringify(k.value)}, good: ${k.good} }`)
    .join('\n');

  const platformsStr = JSON.stringify(entry.platforms);
  const tagsStr      = JSON.stringify(entry.tags);

  const block = `  ,{
    id:        ${JSON.stringify(entry.id)},
    createdAt: ${JSON.stringify(entry.createdAt)},
    period:    ${JSON.stringify(entry.period)},
    product:   ${JSON.stringify(entry.product)},
    category:  ${JSON.stringify(entry.category)},
    brand:     ${JSON.stringify(entry.brand)},
    asin:      ${JSON.stringify(entry.asin)},
    platforms: ${platformsStr},
    summary:   ${JSON.stringify(entry.summary)},
    kpi: [
${kpiStr}
    ],
    tags: ${tagsStr},
    file: ${JSON.stringify(entry.file)}
  }
  `;

  html = html.slice(0, pos) + block + html.slice(pos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ reports/index.html を更新しました');
}

// ── メイン ───────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs();

  const srcArg  = args.src  || args.source;
  const destArg = args.dest || args.destination;
  const metaArg = args.meta;
  const msgArg  = args.message || args.msg;

  if (!srcArg || !destArg) {
    console.error([
      '使い方:',
      '  node scripts/publish-report.js \\',
      '    --src  outputs/reports/<ファイル名>.html \\',
      '    --dest <YYYY-MM>/<ファイル名>.html \\',
      '    --meta outputs/reports/<ファイル名>.meta.json',
    ].join('\n'));
    process.exit(1);
  }

  const srcPath  = path.isAbsolute(srcArg)  ? srcArg  : path.join(ROOT, srcArg);
  const destPath = path.join(ROOT, 'reports', destArg);

  if (!fs.existsSync(srcPath)) {
    console.error(`エラー: ソースファイルが見つかりません → ${srcPath}`);
    process.exit(1);
  }

  // ── 1. コピー ───────────────────────────────────────────────────────
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  console.log(`\n[PHASE 3] レポート公開スクリプト\n`);
  console.log(`  ✓ コピー: ${path.relative(ROOT, destPath).replace(/\\/g, '/')}`);

  // ── 2. index.html 更新 ──────────────────────────────────────────────
  if (metaArg) {
    const metaPath = path.isAbsolute(metaArg) ? metaArg : path.join(ROOT, metaArg);
    const meta     = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    meta.file      = destArg;
    updateIndex(meta);
  } else {
    console.log('  ※ --meta 未指定のため reports/index.html の更新をスキップ');
  }

  // ── 3. git add / commit / push ──────────────────────────────────────
  const basename = path.basename(destArg, '.html');
  const commitMsg = msgArg || `docs: add ${basename} report`;

  console.log(`  ↑ git commit: "${commitMsg}"`);

  try {
    execSync(`git -C "${ROOT}" add reports/`, { stdio: 'inherit' });
    execSync(`git -C "${ROOT}" commit -m "${commitMsg}"`, { stdio: 'inherit' });
    execSync(`git -C "${ROOT}" push origin master`, { stdio: 'inherit' });
    console.log('\n  ✓ GitHub Pages へ公開完了');
    console.log(`  🔗 URL: https://yukiura-code.github.io/amazon-research-os/reports/`);
    console.log(`  📄 直リンク: https://yukiura-code.github.io/amazon-research-os/reports/${destArg}\n`);
  } catch (e) {
    console.error('\n  ✗ git push に失敗しました。手動で実行してください:');
    console.error('    git add reports/ && git commit -m "docs: ..." && git push origin master');
    process.exit(1);
  }
}

main();
