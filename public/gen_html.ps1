$out = 'D:\antigravity\eco os\public\ecoflows.html'
$html = Get-Content 'D:\antigravity\eco os\public\ecoflows.src' -Raw
Set-Content -Path $out -Value $html -Encoding UTF8
Write-Host "Written: $out"
