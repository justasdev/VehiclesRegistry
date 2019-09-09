cd ./Frontend
npm run buildProd
cd ../Backend
export NODE_ENV="production"
npm run populateWithFakeData
npm run startProd