function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomLetter() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function randomNumber() {
    return Math.floor(Math.random() * 9);
}

function randomVehicleNumber() {
    return randomLetter() + randomLetter() + randomLetter() + randomNumber() + randomNumber() + randomNumber();
}

function makeNumbersGenerator()
{
    const generatedNumbers = [];
    return function () {
        let number;
        do{
            number = randomVehicleNumber();
        }while (generatedNumbers.indexOf(number) > -1);
        generatedNumbers.push(number);
        return number;
    }
}

function randomPerson(names)
{
    const personName = randomElement(names);
    return `${personName.name} ${personName.lastName}`;
}

function randomVehicle(vehicles)
{
    const randomModel = randomElement(vehicles);
    return {model: randomModel.model, make: randomElement(randomModel.makes)};
}

function generateOwners(cars, names, number)
{
    const owners = [];
    const randomNumber = makeNumbersGenerator();
    for (let i = 0; i < number; i++)
    {
        owners.push({number: randomNumber(), owner: randomPerson(names), ...randomVehicle(cars)})
    }
    return owners;
}

module.exports = {
    generateOwners
};
