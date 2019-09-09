const config = require('../../../config');
const _ = require('lodash');
const chai = require('chai');
chai.use(require('chai-as-promised'));


const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const TIMEOUT = 10000;

const db = require('../../../persistence/mongo');
if (process.env.MONGO_URL || config.mongodb)
{
    db.initialize(process.env.MONGO_URL || _.get(config, 'mongodb.url'), process.env.DATABASE_NAME || _.get(config, 'mongodb.database'));
}

const {invalidVehicles_Model, invalidOwners_number, invalidVehicles_Mark, validVehicles, validOwners} = require('../../mockData');

describe('MongoDb testing', () => {

    beforeEach(async () => {
        //Recreates database
        await db.createDatabase(true);
    });

    it('should not allow to insert vehicles with non-unique marks', async function () {
        await assert.isRejected(db.addAllVehicles(invalidVehicles_Mark));
    }).timeout(TIMEOUT);

    it('should not allow to insert vehicles with non-unique models', async function () {
        await assert.isRejected(db.addAllVehicles(invalidVehicles_Model));
    }).timeout(TIMEOUT);

    it('should not allow to insert owner with wrong vehicle number', async function () {
        await assert.isRejected(db.addAllOwners(invalidOwners_number));
    }).timeout(TIMEOUT);

    it('should insert and return all vehicles', async function () {
        await db.addAllVehicles(_.cloneDeep(validVehicles)); //Cloning vehicles before inserting, since mongodb adds _id fields to inserted objects
        const modelsWithMakes = await db.getModelsWithMakes();
        assert.lengthOf(modelsWithMakes, validVehicles.length, 'Vehicles should be returned');
        assert.isTrue(_.isEqual(validVehicles, modelsWithMakes), 'Inserted vehicles should be equal to returned vehicles');
    }).timeout(TIMEOUT);

    it('should insert and return all owners', async function () {
        await db.addAllOwners(_.cloneDeep(validOwners));
        const owners = await db.getOwners();
        assert.lengthOf(owners, validOwners.length, 'Owners should be returned');
        assert.isTrue(_.isEqual(validOwners, owners));
    }).timeout(TIMEOUT);

    it('should insert single owner', async function () {
        await db.addOwner(_.cloneDeep(validOwners[0]));
        const owners = await db.getOwners();
        assert.lengthOf(owners, 1,'Should return single owner');
        assert.isTrue(_.isEqual(validOwners[0], owners[0]));
    }).timeout(TIMEOUT);

    it('should update owner', async function () {
        await db.addOwner(_.cloneDeep(validOwners[0]));
        const updatedName = 'Updated Owner';
        const updatedOwner = _.cloneDeep(validOwners[0]);
        updatedOwner.owner = updatedName;
        await db.updateOwner(_.cloneDeep(updatedOwner));
        const owners = await db.getOwners();
        assert.isTrue(_.isEqual(updatedOwner, owners[0]));
    }).timeout(TIMEOUT);

    it('should delete owner', async function() {
        await db.addAllOwners(_.cloneDeep(validOwners));
        await db.deleteOwner(validOwners[0].number);
        const owners = await db.getOwners();
        assert.lengthOf(owners, validOwners.length - 1, 'Should return one less owner than inserted');
        assert.isTrue(_.isEqual(validOwners[1], owners[0]));
    }).timeout(TIMEOUT);

    it('should check if number exists', async function() {
        await db.addAllOwners(_.cloneDeep(validOwners));
        assert.isTrue(await db.numberExists(validOwners[0].number));
        assert.isFalse(await db.numberExists('pqw735'));
    }).timeout(TIMEOUT);
});
