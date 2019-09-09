dir=$PWD
cd ./Frontend
echo "Testing frontend"
npm run test
cd ../Backend
echo "Testing backend"
node ./node_modules/mocha/bin/mocha 'tests/persistence/mongo/mongo.js' --exit
cd dir