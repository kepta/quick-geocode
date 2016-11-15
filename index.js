var MAPZEN_KEY = 'mapzen-vPFsTmz';
var MAPZEN_API_BASE = 'https://search.mapzen.com/v1/search?';

var OPENCAGE_KEY = 'b259e2552bcc6545f684920858777172';
var OPENCAGE_API_BASE = 'https://api.opencagedata.com/geocode/v1/json';

var citiesData = [
{"city":"Bali","bbox_wsen":"114.84518601528924,-8.89719763214812,115.64444535372013,-8.479899063545815"}
,
{"city":"London","bbox_wsen":"-0.25650876183456717,51.4600367964847,0.0037593696567057577,51.545605790504794"}
,
{"city":"SF","bbox_wsen":"-122.65274891539464,37.660247863276155,-122.16742136030959,37.86289732264129"}
,
{"city":"NYC","bbox_wsen":"-74.19738237880989,40.66356148822018,-73.83327864666424,40.809277182186406"}
,
{"city":"Singapore","bbox_wsen":"103.49482831501672,1.1583698489821899,104.1805897654558,1.520468229391625"}
,
{"city":"Bangkok","bbox_wsen":"100.3195058371245,13.641471184928761,100.77041574396009,13.872795524198466"}
,
{"city":"Istanbul","bbox_wsen":"28.719661885437034,40.92329392663163,29.20612139812681,41.117143875276525"}
,
{"city":"Kuala Lumpur","bbox_wsen":"101.51342955341835,3.028401283109119,101.93938820021475,3.25304137590048"}
,
{"city":"Chiang Mai","bbox_wsen":"114.84518601528924,-8.89719763214812,115.64444535372013,-8.479899063545815"}
,
{"city":"Kuala Lumpur","bbox_wsen":"101.51342955341835,3.028401283109119,101.93938820021475,3.25304137590048"}
,
{"city":"Jeju","bbox_wsen":"125.96660048475604,33.05677303455364,127.23439744562194,33.616200524960604"}
,
{"city":"Paris","bbox_wsen":"2.165741691567689,48.79253594228365,2.5604789182663126,48.92969724479158"}
,
{"city":"Phuket","bbox_wsen":"98.14395615353868,7.750045967808276,98.6078451405898,7.9927490558036425"}
,
{"city":"Seoul","bbox_wsen":"126.74790212631552,37.43414566173274,127.24005846315572,37.64026825328666"}
,
{"city":"Siem Reap","bbox_wsen":"103.37601094718752,13.063573838940215,104.47478826249284,13.628238901907949"}
,
{"city":"Rome","bbox_wsen":"12.26906265635597,41.8002878533471,12.724924125520175,41.97952529336672"}
,
{"city":"Osaka","bbox_wsen":"135.21563856571123,34.54224979126079,135.89182770025286,34.835910195314185"}
,
{"city":"Tokyo","bbox_wsen":"139.58495653337332,35.59356369874679,139.98594576979298,35.76559884317733"}
,
{"city": "Los Angeles", "bbox_wsen": "-118.9668, 33.5734, -117.4754, 34.4250"}
];

var cities = citiesData.reduce(function(memo, val) {
  memo[val.city] = val.bbox_wsen;
  return memo;
}, {});

$(function() {
  var query = getQueryObj();
  if (!query.name || !query.city) {
    alert('needs name and city');
    return;
  }
  if (!cities.hasOwnProperty(query.city)) {
    alert('bbox for ' + query.city + ' not found');
    return;
  };
  var bbox = cities[query.city];

  //FIXME: build params object, not this ugly url string concat
  var mzUrl = MAPZEN_API_BASE + 'text=' + query.name + '&' + getBboxQuery(bbox);
  var $mzBody = $('#mzResults tbody');
  $.getJSON(mzUrl, {}, function(data) {
    $('#mzLoading').hide();
    var features = data.features;
    features.forEach(function(feature) {
      var m = new MapzenResult(feature);
      var $row = m.getRow();
      $mzBody.append($row);
    });
  }).fail(function(err) {
    alert('Mapzen geocode request failed. Please slap batpad.');
  });

  var ocParams = {
    bounds: bbox,
    key: OPENCAGE_KEY,
    q: query.name
  };
  var $ocBody = $('#ocResults tbody');
  $.getJSON(OPENCAGE_API_BASE, ocParams, function(data) {
    $('#ocLoading').hide();
    var results = data.results;
    console.log(results);
    results.forEach(function(result) {
      var o = new OpencageResult(result);
      var $row = o.getRow();
      $ocBody.append($row);
    })
  }).fail(function(err) {
    alert('Opencage geocode request failed.');
  });

});

function getBboxQuery(bbox) {
  var arr = bbox.split(',');
  var s = 'boundary.rect.min_lat=' + arr[1];
  s += '&boundary.rect.min_lon=' + arr[0];
  s += '&boundary.rect.max_lat=' + arr[3];
  s += '&boundary.rect.max_lon=' + arr[2];
  return s;
}

function getQueryObj() {
  var result = {}, queryString = location.search.slice(1),
      re = /([^&=]+)=([^&]*)/g, m;

  while (m = re.exec(queryString)) {
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  console.log('query obj', result);
  return result;
}

//FIXME: This is super ugly. I know.
function getGoogleTd() {
  var query = getQueryObj();
  var googleLink = 'http://google.com/#q=' + query.name + ', ' + query.city;
  return $('<td />').append($('<a />')
      .prop('target', '_blank')
      .prop('href', googleLink)
      .text('Search Google')
    );
}

function getWikiTd() {
  var query = getQueryObj();
  var wikiLink = 'https://www.wikidata.org/w/index.php?title=Special:Search&profile=default&fulltext=Search&search=' + query.name + '&searchToken=3bto1uwdawuhrioq5mztmoknr';
  return $('<td />').append($('<a />')
      .prop('target', '_blank')
      .prop('href', wikiLink)
      .text('Search Wikidata')
    );
}
