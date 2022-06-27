$location = Get-Location
Set-Location -Path $PSScriptRoot/../src
pnpm run nx build freights-app --source-map=true --base-href=/pwa/
rm -rf $PSScriptRoot/../websites/freights.app/pwa
copy-item $PSScriptRoot/../src/dist/apps/freights-app $PSScriptRoot/../websites/freights.app/pwa -force -recurse
Set-Location -Path $PSScriptRoot/..
Set-Location -Path $PSScriptRoot/../websites
firebase deploy --only hosting:sneat-express
Set-Location -Path $location
