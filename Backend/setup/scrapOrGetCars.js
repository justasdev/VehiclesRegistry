const CARS_URL = 'http://cars-data.com/';
const DATA_FILE = __dirname + '/data/cars.json';

async function scrapTestData()
{
    const browser = await require('puppeteer').launch();
    const carsPage = await browser.newPage();
    await carsPage.goto(CARS_URL);
    await carsPage.waitForXPath("//select[@name='mark']/option[position()=2]");
    const markOptions = await carsPage.$$('select[name=mark] option');

    const parser = require('node-html-parser');
    const axios = require('axios');
    const cars = [];
    for (let i = 1; i < markOptions.length; i++)
    {
        const option = markOptions[i];
        const mark = await carsPage.evaluate(el => el.textContent, option);
        console.log(mark);
        const response = await axios.get(CARS_URL + 'ajax_files/get_groups.php?url=' + mark.toLowerCase().replace(' ', '-'));
        if (response.status !== 200)
        {
            continue;
        }
        const makesEl = parser.parse(response.data);
        const makes = makesEl.querySelectorAll('option')
            .filter(option => option.attributes.value && option.attributes.value.length > 0)
            .map(option => option.text)
            .reduce((acc, curr) => acc.add(curr), new Set()); //Reducing to set, since there is a record with duplicate makes

        if (makes.size > 0)
        {
            cars.push({model: mark, makes: Array.from(makes)});
        }
    }
    return cars;
}

module.exports = {
    getTestData: require('./common').makeGetTestData(scrapTestData, DATA_FILE)
};
