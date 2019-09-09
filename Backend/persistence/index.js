const _ = require('lodash');
const config = require('../config');

if (process.env.MONGO_URL || config.mongodb)
{
    const mongo = require('./mongo');
    mongo.initialize(process.env.MONGO_URL || _.get(config, 'mongodb.url'), process.env.DATABASE_NAME || _.get(config, 'mongodb.database'));
    module.exports = mongo;
}else
{
    throw new Error('File persistence is not implemented. Please provide MongoDB connection params');
}
