async function scrapAndSaveToFile(scrapFn, file) {
    const res = await scrapFn();
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(res), (err) => {
            if (err)
            {
                console.error(err);
            }
            resolve(res);
        });
    });
}

function makeGetTestData(scrapFn, dataFile)
{
    return async function () {
        const fs = require('fs');
        if (fs.existsSync(dataFile))
        {
            return new Promise((resolve, reject) => {
                fs.readFile(dataFile, (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            }).then(data => JSON.parse(data));
        }else {
            return require('./common').scrapAndSaveToFile(scrapFn, dataFile);
        }
    }
}

module.exports = {
    scrapAndSaveToFile,
    makeGetTestData
};
