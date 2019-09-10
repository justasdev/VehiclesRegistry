cd .\Frontend
Write-Host "Testing frontend"
npm run test
cd ..\Backend
Write-Host "Testing backend"
$env:NODE_ENV="test"
node .\node_modules\mocha\bin\mocha 'tests/persistence/mongo/mongo.js' --exit
cd $PSScriptRoot