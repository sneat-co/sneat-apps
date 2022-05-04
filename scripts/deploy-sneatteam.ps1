$location = Get-Location
Set-Location -Path $PSScriptRoot/../src
pnpm run nx build sneat-app
rm -rf $PSScriptRoot/../websites/sneatteam/pwa
copy-item $PSScriptRoot/../src/dist/apps/sneat-app $PSScriptRoot/../websites/sneatteam/pwa -force -recurse
Set-Location -Path $PSScriptRoot/..
$pwaIndexHtml = 'websites/sneatteam/pwa/index.html'
(Get-Content $pwaIndexHtml) -replace '<base href="/"', '<base href="/pwa/"' | Out-File -encoding UTF8 $pwaIndexHtml
Set-Location -Path $PSScriptRoot/../websites
firebase deploy --only hosting:sneatteam
Set-Location -Path $location
`
