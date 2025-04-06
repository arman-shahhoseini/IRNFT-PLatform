Write-Host "🧹 در حال پاک‌سازی فایل‌های موقتی، کش و Recycle Bin..." -ForegroundColor Cyan

# حذف فایل‌های موقتی کاربر
$TempPath = "$env:TEMP\*"
Remove-Item -Path $TempPath -Recurse -Force -ErrorAction SilentlyContinue

# حذف Temp از AppData
$AppDataTemp = "$env:LOCALAPPDATA\Temp\*"
Remove-Item -Path $AppDataTemp -Recurse -Force -ErrorAction SilentlyContinue

# پاک‌سازی Recycle Bin
Clear-RecycleBin -Force -ErrorAction SilentlyContinue

# حذف کش npm
$NpmCache = "$env:LOCALAPPDATA\npm-cache\*"
Remove-Item -Path $NpmCache -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ پاک‌سازی انجام شد. لطفاً دوباره تلاش کن برای نصب." -ForegroundColor Green
