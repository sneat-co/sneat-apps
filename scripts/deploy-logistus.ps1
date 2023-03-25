$location = Get-Location
Set-Location -Path $PSScriptRoot/../src
node ./grab-git-info.js
git commit -am "Deployed from $env:COMPUTERNAME"
pnpm run nx build logist-app --source-map=true --base-href=/pwa/
printf "Build exited with code $LASTEXITCODE - $?"
If (-Not $?) {
    return $LASTEXITCODE
}
rm -rf $PSScriptRoot/../websites/freights.app/pwa
copy-item $PSScriptRoot/../src/dist/apps/logist-app $PSScriptRoot/../websites/logistus.app/pwa -force -recurse
Set-Location -Path $PSScriptRoot/..
Set-Location -Path $PSScriptRoot/../websites
firebase deploy --only hosting:logistus
Set-Location -Path $location
