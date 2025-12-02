# Development Server Startup Script
# This script helps start the backend server with all required services

Write-Host "=== Gifalot Backend Startup ===" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please copy env.template to .env and configure it" -ForegroundColor Yellow
    Write-Host "Run: cp env.template .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "Checking services..." -ForegroundColor Cyan

# Check PostgreSQL
$postgresRunning = $false
try {
    $postgresCheck = netstat -ano | findstr ":5432"
    if ($postgresCheck) {
        $postgresRunning = $true
        Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL is NOT running" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ PostgreSQL is NOT running" -ForegroundColor Red
}

# Check Redis
$redisRunning = $false
try {
    $redisCheck = netstat -ano | findstr ":6379"
    if ($redisCheck) {
        $redisRunning = $true
        Write-Host "✓ Redis is running" -ForegroundColor Green
    } else {
        Write-Host "✗ Redis is NOT running" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Redis is NOT running" -ForegroundColor Red
}

Write-Host ""

if (-not $postgresRunning -or -not $redisRunning) {
    Write-Host "=== Required Services Not Running ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to start PostgreSQL and Redis before starting the server." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Install and start PostgreSQL and Redis locally"
    Write-Host "2. Use Docker (recommended):" -ForegroundColor Cyan
    Write-Host "   docker-compose up -d postgres redis" -ForegroundColor White
    Write-Host ""
    Write-Host "After starting the services, run this script again." -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Do you want to try starting the server anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:3000/gif-j/" -ForegroundColor Green
Write-Host ""

# Start the server
npm run start:dev











