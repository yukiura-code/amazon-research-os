@echo off
chcp 65001 > nul
echo.
echo ======================================================
echo  Amazon Research OS - ナレッジ公開スクリプト
echo ======================================================
echo.

cd /d "%~dp0"

:: ── Git ステータス確認 ──────────────────────────────
git status > nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Gitリポジトリが初期化されていません。
  echo         初回のみ以下を実行してください：
  echo         1. git init
  echo         2. git remote add origin https://github.com/YOUR_USER/amazon-research-os.git
  echo         3. publish.bat を再実行
  pause
  exit /b 1
)

:: ── コミットメッセージを自動生成 ───────────────────
for /f "tokens=1-3 delims=/" %%a in ('echo %date%') do set TODAY=%%c-%%a-%%b
set MSG=docs: add report %TODAY%

:: ── ステージング & コミット ────────────────────────
echo [1/3] 変更をステージング中...
git add reports\ data\
git status --short

echo.
echo [2/3] コミット中: %MSG%
git commit -m "%MSG%"
if %errorlevel% neq 0 (
  echo [INFO] 変更なし、またはコミット済みです。
)

:: ── プッシュ ───────────────────────────────────────
echo.
echo [3/3] GitHub Pages へ公開中...
git push origin main
if %errorlevel% neq 0 (
  echo [WARN] push に失敗しました。
  echo       初回は以下を確認してください：
  echo       - GitHubリポジトリが作成済みか
  echo       - git remote add origin ... が設定済みか
  pause
  exit /b 1
)

echo.
echo ======================================================
echo  公開完了！
echo  URL: https://YOUR_USER.github.io/amazon-research-os/reports/
echo ======================================================
echo.
pause
