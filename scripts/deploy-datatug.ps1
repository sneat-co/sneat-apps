Set-Location -Path $PSScriptRoot/../src
pnpm run nx build datatug -- --prod
Set-Location -Path $PSScriptRoot/
copy-item $PSScriptRoot/../src/dist/apps/datatug $PSScriptRoot/../websites/datatug/pwa -force -recurse
$pwaIndexHtml = '../websites/datatug/pwa/index.html'
(Get-Content $pwaIndexHtml) -replace '<base href="/"/>', '<base href="/pwa/"/>' | Out-File -encoding UTF8 $pwaIndexHtml
Set-Location -Path $PSScriptRoot/../websites
firebase deploy --only hosting:datatug
