const MongoClient = require('mongodb').MongoClient;
const error = require('../../error_handling').error;

const DEFAULT_URL = 'mongodb://localhost';
const DEFAULT_DATABASE = 'vehicleOwners_DEV';

let {mongoUrl, database} = {DEFAULT_URL, DEFAULT_DATABASE};

const isDuplicate = (err) => [11000, 11001].indexOf(err.code) > -1;

async function connect() {
    const client = await MongoClient.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return client.db(database);
}

async function createDatabase(recreate = true){
    const db = await connect();
    if (recreate)
    {
        await db.dropDatabase();
    }
    const ownersCollection = await db.createCollection('owners', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['number', 'owner'],
                properties: {
                    number: {
                        bsonType: 'string',
                        pattern: '^[a-z]{3}[0-9]{3}$',
                        description: 'Vehicle number plate. Is required and must be unique. Must contain six chars - start with three letters and end with three numbers.'
                    },
                    owner: {
                        bsonType: 'string',
                        description: 'Vehicle owner. Is required'
                    },
                    model: {
                        bsonType: 'string',
                        description: 'Vehicle model'
                    },
                    make: {
                        bsonType: 'string',
                        description: 'Vehicle make'
                    }
                },
            }
        }
    });
    await ownersCollection.createIndex({'number': 1}, {unique: true});

    const vehiclesCollection = await db.createCollection('vehicles', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['model'],
                properties: {
                    model: {
                        bsonType: 'string',
                        description: 'Model of the vehicle'
                    },
                    makes: {
                        bsonType: 'array',
                        items: {
                            type: 'string'
                        },
                        uniqueItems: true,
                    }
                }
            }
        }
    });

    await vehiclesCollection.createIndex({'model': 1}, {unique: true});

    return db;
}

async function addAllVehicles(vehicles) {
    const db = await connect();
    return db.collection('vehicles').insertMany(vehicles).then(res => res.insertedCount > 0);
}

async function addAllOwners(owners) {
    const db = await connect();
    return db.collection('owners').insertMany(owners).then(res => res.insertedCount > 0);
}

async function addOwner(owner)
{
    const db = await connect();
    try {
        return await db.collection('owners').insertOne(owner).then(res => res.insertedCount > 0);
    }catch (e) {
        if (isDuplicate(e))
        {
            throw error(`Number ${owner.number} already exists!`, 400);
        }
    }
}

async function updateOwner(owner)
{
    const db = await connect();
    return db.collection('owners').updateOne({number: owner.number}, {$set: owner}).then(res => res.result.n > 0);
}

async function deleteOwner(number)
{
    const db = await connect();
    return db.collection('owners').deleteOne({number: number}).then(res => res.deletedCount > 0);
}

async function getOwners()
{
    const db = await connect();
    return db.collection('owners').find({}).project({_id: 0}).toArray();
}

async function getMakes(model)
{
    const db = await connect();
    return db.collection('vehicles').find({model: model}).project({_id: 0, makes: 1}).toArray().then(res => res.length > 0 ? res[0].makes : []);
}

async function getModels()
{
    const db = await connect();
    return db.collection('vehicles').find({}).project({_id: 0, model: 1}).toArray().then(res => res.map(v => v.model));
}

async function getModelsWithMakes()
{
    const db = await connect();
    return db.collection('vehicles').find({}).project({_id: false}).toArray();
}

async function numberExists(number)
{
    const db = await connect();
    return db.collection('owners').findOne({number: number}).then(number => !!number);
}

function initialize(url, db)
{
    if (url)
    {
        mongoUrl = url;
    }else
    {
        console.warn(`Trying to initialize mongo with empty url. ${DEFAULT_URL} will be used instead.`);
    }
    if (db)
    {
        database = db;
    }else {
        console.warn(`Trying to initialize mongo with empty database name. ${DEFAULT_DATABASE} will be used instead.`)
    }
}

//TODO: issiaiskinti del overwritinimo
module.exports = {
    initialize,
    createDatabase,
    addAllOwners,
    addOwner,
    addAllVehicles,
    getMakes,
    getModels,
    getModelsWithMakes,
    getOwners,
    numberExists,
    updateOwner,
    deleteOwner
};
