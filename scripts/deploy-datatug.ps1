$location = Get-Location
Set-Location -Path $PSScriptRoot/../src
pnpm run nx build datatug -- --prod
rm -rf $PSScriptRoot/../websites/datatug/pwa
copy-item $PSScriptRoot/../src/dist/apps/datatug $PSScriptRoot/../websites/datatug/pwa -force -recurse
Set-Location -Path $PSScriptRoot/..
$pwaIndexHtml = 'websites/datatug/pwa/index.html'
(Get-Content $pwaIndexHtml) -replace '<base href="/"', '<base href="/pwa/"' | Out-File -encoding UTF8 $pwaIndexHtml
Set-Location -Path $PSScriptRoot/../websites
firebase deploy --only hosting:datatug
Set-Location -Path $location
