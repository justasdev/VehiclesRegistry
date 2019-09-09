cd ./Frontend
npm run build
cd ../Backend
$env:OWNERS_COUNT=200
npm run populateWithFakeData; npm run startDev;