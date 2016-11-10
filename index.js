var MAPZEN_KEY = 'mapzen-vPFsTmz';
var MAPZEN_API_BASE = 'https://search.mapzen.com/v1/search?';
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
  