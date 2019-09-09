var convict = require('convict');

var conf = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'Port to run app',
        format: 'port',
        default: '3000',
        env: 'PORT'
    },
    host: {
        doc: 'Host to run app',
        format: 'ipaddress',
        default: '127.0.0.1'
    },
    mongodb: {
        doc: 'Connection info for mongodb',
        format: 'Object',
        default: null,
        url: {
            doc: 'Mongodb URL',
            format: 'url',
            default: 'mongodb://localhost'
        },
        database: {
            doc: 'Database name',
            format: 'String',
            default: 'vehicleOwners_DEV'
        }
    },
    ownersCount: {
        doc: 'Amount of owners to generate. Owners are generated from cars.json and persons.json . If files are not found, data is being scraped from web.',
        format: 'Number',
        default: 100
    }
});

conf.loadFile('./config/' + conf.get('env') + '.json');
conf.validate();

module.exports = conf.getProperties();
