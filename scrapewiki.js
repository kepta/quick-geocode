var cheerio = require('cheerio');
var fetch = require('node-fetch');
var fs = require('fs');

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
        return titles;
    })
    .catch(console.error);
}


scraper(process.env.URL, process.env.TAG).then(r => {
    var fileName = process.env.URL.split('/');
    fileName = fileName[fileName.length - 1] + '.txt';
    fs.writeFileSync(fileName, r.join('\n'), 'utf8');
});
