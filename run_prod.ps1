cd ./Frontend
npm run buildProd
cd ../Backend
$env:NODE_ENV="production"
npm run populateWithFakeData
npm run startProd