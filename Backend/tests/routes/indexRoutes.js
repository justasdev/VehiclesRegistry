const request = require('supertest');
const mock = require('mock-require');
const proxyquire = require('proxyquire');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const _ = require('lodash');
const mockData = require('../mockData');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const persistencePath = '../../persistence';
const appPath = '../../app';

//WARNING: Api tests passes if run separately, since mockery mocks modules for single call only,
// therefore this test is excluded from test mode
//TODO: implement module mocking for subsequent requires

describe('Testing /api/vehicleOwners', function () {
    const validOwners = mockData.validOwners;

    function returnValidOwners() {
        return new Promise((resolve, reject) => {
            resolve(validOwners);
        });
    }

    it('should return vehicle owners', async function () {
        var mockery = require('mockery');
        mockery.enable({
            useCleanCache:      false,
            //warnOnReplace:      false,
            warnOnUnregistered: false
        });
        mockery.registerMock('../../routes', {'../../persistence': () => console.log('WKRKSSS')});

        // proxyquire('../../routes', {'../persistence': {getOwners: returnValidOwners}, '@noCallThru': true});
        const app = mock.reRequire(appPath);
        const response = await request(app).get('/api/vehicleOwners');
        assert.isTrue(_.isEqual(response.body, validOwners));
        assert.equal(response.status, 200);
    });



    it('should return error', async function () {
        mock(persistencePath, {getOwners: () => {throw new Error('Unknown error')}});
        const app = mock.reRequire(appPath);
        const response = await request(app).get('/api/vehicleOwners');
        assert.equal(response.status, 500);
    });
});

describe('Testing /api/models', function () {
    const validVehicles = mockData.validVehicles;

    function returnValidVehicles() {
        return new Promise((resolve, reject) => {
            resolve(validVehicles);
        });
    }

    it('should return vehicle owners', async function () {
        mock(persistencePath, {getModelsWithMakes: returnValidVehicles});
        const app = mock.reRequire(appPath);
        const response = await request(app).get('/api/models');
        assert.isTrue(_.isEqual(response.body, validVehicles));
        assert.equal(response.status, 200);
    });

    it('should return error', async function () {
        mock(persistencePath, {getModelsWithMakes: () => {throw new Error('Unknown error')}});
        const app = mock.reRequire(appPath);
        const response = await request(app).get('/api/models');
        assert.equal(response.status, 500);
    });
});

describe('Testing /api/vehicles/exists/:number', function () {
    it('should throw error without number provided', async function () {
        const app = mock.reRequire(appPath);
        const response = await request(app).get('/api/vehicles/exists/wrong');
        assert.equal(response.status, 400);
    });
});

describe('Testing /api/vehicles/add', function () {
    it('should successfully add vehicleOwner', async function () {
        const app = mock.reRequire(appPath);
        const response = await request(app).post('/api/vehicles/add', mockData.validVehicles);
        assert.equal(response.status, 200);
    });

    it('should not add malformed data', async function () {
        const app = mock.reRequire(appPath);
        const response = await request(app).post('/api/vehicles/add', mockData.invalidOwners_number);
        assert.equal(response.status, 400);
    });
});


