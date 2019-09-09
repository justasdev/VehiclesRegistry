const config = require('../config');
const persistence = require('../persistence');
const getCarsData = require('./scrapOrGetCars').getTestData;
const getPersonsData = require('./scrapOrGetPersons').getTestData;
const generateOwners = require('./owners').generateOwners;

const DEFAULT_OWNERS_COUNT = 100;

async function reinit() {
    await persistence.createDatabase(true);
    const [vehicles, persons] = await Promise.all([getCarsData(), getPersonsData()]);
    const owners = generateOwners(vehicles, persons, process.env.OWNERS_COUNT || config.ownersCount || DEFAULT_OWNERS_COUNT);
    return  Promise.all([persistence.addAllVehicles(vehicles), persistence.addAllOwners(owners)]);
}

reinit().then(_ => {
    console.log('-----------------------------------------------------');
	console.log('Database reinitialized');
    console.log('-----------------------------------------------------');
	process.exit(0);
}).catch(err => console.error(err) && process.exit(1));
