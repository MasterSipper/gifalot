# Start Frontend Development Server
# This script bypasses PowerShell execution policy restrictions

Write-Host "Starting React development server..." -ForegroundColor Green

# Change to the frontend directory
Set-Location $PSScriptRoot

# Start npm in a way that bypasses execution policy
& cmd /c "npm start"


