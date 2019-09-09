const PERSONS_URL = 'http://listofrandomnames.com/';
const DATA_FILE = __dirname + '/data/persons.json';

async function scrapTestData()
{
    const browser = await require('puppeteer').launch();
    const personsPage = await browser.newPage();
    await personsPage.goto(PERSONS_URL);
    const count = await personsPage.$x("//button[contains(@class, 'howmany') and contains(text(), '50')]");
    if (!count || count.length < 1)
    {
        throw new Error('Persons count input not found');
    }
    await count[0].click();
    const generateBtn = await personsPage.$x("//button[@type='submit' and contains(text(), 'Generate')]");

    if (!generateBtn || generateBtn.length < 0)
    {
        throw new Error('Generate button not found');
    }

    await generateBtn[0].click();
    await personsPage.waitForSelector('#nameres');

    const persons = await personsPage.$$('#nameres li');

    return Promise.all(persons.map(async p => {
        const nameEl = await p.$('.firstname');
        const lastNameEl = await p.$('.lastname');
        const name = await personsPage.evaluate(el => el.textContent, nameEl);
        const lastName = await personsPage.evaluate(el => el.textContent, lastNameEl);
        return {
            name: name,
            lastName: lastName
        }
    }));
}

module.exports = {
    getTestData: require('./common').makeGetTestData(scrapTestData, DATA_FILE)
};
