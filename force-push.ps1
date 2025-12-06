# Force push script with full output
$ErrorActionPreference = "Continue"

Write-Host "=== Current Branch ===" -ForegroundColor Cyan
git branch --show-current

Write-Host "`n=== Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Local Commits (last 3) ===" -ForegroundColor Cyan
git log --oneline -3

Write-Host "`n=== Fetching from Remote ===" -ForegroundColor Cyan
git fetch origin 2>&1

Write-Host "`n=== Remote Dev Branch (last 3) ===" -ForegroundColor Cyan
git log origin/dev --oneline -3 2>&1

Write-Host "`n=== Unpushed Commits ===" -ForegroundColor Yellow
$unpushed = git log origin/dev..HEAD --oneline 2>&1
if ($unpushed) {
    Write-Host $unpushed -ForegroundColor Yellow
} else {
    Write-Host "No unpushed commits found" -ForegroundColor Green
}

Write-Host "`n=== Attempting Push ===" -ForegroundColor Green
$pushOutput = git push origin dev 2>&1
Write-Host $pushOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Push completed (exit code: $LASTEXITCODE)" -ForegroundColor Green
} else {
    Write-Host "`n✗ Push failed (exit code: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "Error output:" -ForegroundColor Red
    Write-Host $pushOutput -ForegroundColor Red
}

Write-Host "`n=== Verifying Push ===" -ForegroundColor Cyan
git fetch origin 2>&1
$stillUnpushed = git log origin/dev..HEAD --oneline 2>&1
if ($stillUnpushed) {
    Write-Host "WARNING: Commits still not pushed:" -ForegroundColor Red
    Write-Host $stillUnpushed -ForegroundColor Red
} else {
    Write-Host "✓ All commits are now on remote" -ForegroundColor Green
}
