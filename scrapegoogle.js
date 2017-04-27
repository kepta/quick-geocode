var cities = require('./cities.js').split('\n').filter(x => x);
var scrapper = require('./scrape');
var fs = require('fs');
var R = require('ramda');
const googleURL = (city) => `https://www.google.co.in/search?q=most+popular+places+in+${encodeURIComponent(city)}&oq=most+popular+places+in+${encodeURIComponent(city)}&ie=UTF-8`;

var x = cities.map(googleURL).map(scrapper);
function writeToFile(fileName, data) {
    fs.writeFileSync(fileName, data.join('\n'), 'utf8');
}

// Promise.all(x).then(x => x.map((lmks, i) => lmks.map(l => `${l}%${cities[i]}`))).then(x => x.reduce((s, n) => s.concat(n) , [])).then(d => writeToFile('landmarks-mini2.txt', d)).catch(console.log);
var x = fs.readFileSync('./landmarks.txt', 'utf8').split('\n');
var y = R.groupBy((e) => e[1], x.map(z => z.split('%')));
writeToFile('mini-landmarks.txt', R.unnest(R.values(R.map(e => e.slice(0, 10) ,y))).map(r => r.join('%')));