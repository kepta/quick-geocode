var cheerio = require('cheerio');
var fetch = require('node-fetch');
var fs = require('fs');

const googleURL = (city) => `https://www.google.co.in/search?q=most+popular+places+in+${city}&oq=most+popular+places+in+${city}&ie=UTF-8`;

function scraper(url, type) {
    return fetch(url)
    .then(r => r.text())
    .then(res => {
        var titles = []
        $ = cheerio.load(res);
        if (type == 'ul') {
            $(type).children().each(function (x) {
                titles.push($(this).children('a').attr('title'));
            });
           
        }
        else if (type === 'table') {
            console.log('here')
            $('table').children('tr').each(function (x) {
               titles.push($(this).children('td').find('a').attr('title'));
            });
        }
        titles = titles.filter(x => x)
        .filter(x => x.toLowerCase().indexOf('wikipedia') === -1)
        .filter(x => x.split(' ').length < 6);
        return titles;
    })
    .catch(console.error);
}

function googleScrapper(url) {
    return fetch(url)
        .then(r => r.text())
        .then(res => {
            var titles = []
            $ = cheerio.load(res);
            $('#search').find('ol').children('div').find('span').each(function(x) {
                if ($(this).text().charAt(0) === ',') {
                    titles.push($(this).text().slice(1));
                }
            });
            return titles.filter(x=> x);
        });
}

// if (process.env.GOOGLE) {
//     const url = googleURL(process.env.GOOGLE);
//     const className = process.env.CLASS;
//     googleScrapper(url, className).then(r => {
//         var fileName = 'google-' + process.env.GOOGLE + '.txt';
//         writeToFile(fileName, r);
//     });
// } else {
//     scraper(process.env.URL, process.env.TAG).then(r => {
//         var fileName = process.env.URL.split('/');
//         fileName = fileName[fileName.length - 1] + '.txt';
//         writeToFile(fileName, r);
//     });
// }


function writeToFile(fileName, data) {
    fs.writeFileSync(fileName, data.join('\n'), 'utf8');
}

module.exports = googleScrapper;