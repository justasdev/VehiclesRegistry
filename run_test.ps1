cd .\Frontend
Write-Host "Testing frontend"
npm run test
cd ..\Backend
Write-Host "Testing backend"
node .\node_modules\mocha\bin\mocha 'tests/persistence/mongo/mongo.js' --exit
cd $PSScriptRoot