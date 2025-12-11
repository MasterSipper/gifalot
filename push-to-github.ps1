# Script to verify and push commits to GitHub
# Run this script to ensure commits are pushed: .\push-to-github.ps1

Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Local Commits (last 5) ===" -ForegroundColor Cyan
git log --oneline -5

Write-Host "`n=== Remote Commits (last 5) ===" -ForegroundColor Cyan
git fetch origin
git log origin/main --oneline -5

Write-Host "`n=== Unpushed Commits ===" -ForegroundColor Yellow
$unpushed = git log origin/main..HEAD --oneline
if ($unpushed) {
    Write-Host $unpushed -ForegroundColor Yellow
    Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Green
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Push failed. Check the error above." -ForegroundColor Red
    }
} else {
    Write-Host "No unpushed commits. Everything is up to date." -ForegroundColor Green
}

Write-Host "`n=== Final Status ===" -ForegroundColor Cyan
git status


