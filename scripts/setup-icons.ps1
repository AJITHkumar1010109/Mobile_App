# Script to update app icons with the generated BizTrack business branding
Add-Type -AssemblyName System.Drawing

$artifactDir = "C:\Users\nts0195\.gemini\antigravity-ide\brain\1c38305c-bcd7-4728-b410-2bf48b518027"
$appIconSrc = Join-Path $artifactDir "biztrack_app_icon_1791866892629.jpg"
$foregroundSrc = Join-Path $artifactDir "biztrack_foreground_1791866918494.jpg"

$assetsDir = Join-Path $PSScriptRoot "..\assets"

if (Test-Path $appIconSrc) {
    $img1 = [System.Drawing.Image]::FromFile($appIconSrc)
    $img1.Save((Join-Path $assetsDir "icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $img1.Dispose()
    Write-Host "Updated assets/icon.png with BizTrack Business Icon" -ForegroundColor Green
}

if (Test-Path $foregroundSrc) {
    $img2 = [System.Drawing.Image]::FromFile($foregroundSrc)
    $img2.Save((Join-Path $assetsDir "android-icon-foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $img2.Dispose()
    Write-Host "Updated assets/android-icon-foreground.png with BizTrack Foreground Icon" -ForegroundColor Green
}
