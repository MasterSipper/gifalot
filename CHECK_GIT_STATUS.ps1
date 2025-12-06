# Quick script to check git status
Write-Host "=== Git Status ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Last 3 Commits ===" -ForegroundColor Cyan
git log --oneline -3

Write-Host "`n=== Remote Status ===" -ForegroundColor Cyan
git log origin/main..HEAD --oneline

Write-Host "`n=== Current Branch ===" -ForegroundColor Cyan
git branch --show-current

