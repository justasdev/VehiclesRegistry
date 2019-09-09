const invalidVehicles_Model = [
    {
        model: 'TestCar',
        makes: ['Test1', 'Test2']
    },
    {
        model: 'TestCar',
        makes: ['AA', 'BB']
    },
];

const invalidOwners_number = [
    {
        number: 'aaaa22',
        owner: 'Vehicle Owner',
        model: 'Audi',
        make: 'A5'
    }
];

const invalidVehicles_Mark = [
    {
        model: 'TestCar',
        makes: ['Test1', 'Test1']
    },
];

const validVehicles = [
    {
        model: 'TestCar',
        makes: ['Test1', 'Test2']
    },
    {
        model: 'TestTruck',
        makes: ['TestTruck1', 'TestTruck2']
    }
];

const validOwners = [
    {
        number: 'qqq444',
        owner: 'Vehicle Owner',
        model: 'Volvo',
        make: 'V90'
    },
    {
        number: 'www888',
        owner: 'Another Owner',
        model: 'Opel',
        make: 'Vectra'
    }
];

module.exports = {
    invalidVehicles_Model,
    invalidOwners_number,
    invalidVehicles_Mark,
    validVehicles,
    validOwners
};
