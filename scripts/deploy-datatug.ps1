Set-Location -Path $PSScriptRoot/../src
pnpm run nx build datatug -- --prod
Set-Location -Path $PSScriptRoot/
copy-item $PSScriptRoot/../src/dist/apps/datatug $PSScriptRoot/../websites/datatug/pwa -force -recurse
(Get-Content $PSScriptRoot/datatug/pwa/index.html) -replace '<base href="/"/>', '<base href="/pwa/"/>' | Out-File -encoding UTF8 $PSScriptRoot/datatug/pwa/index.html
#firebase deploy --only hosting:datatug

