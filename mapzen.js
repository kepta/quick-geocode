(function() {
  var MapzenResult = window.MapzenResult = function(data) {
    var props = data.properties;
    var geom = data.geometry;
    this.id = props.id;
    this.source = props.source;
    this.name = props.name;
    this.label = props.label;
    this.confidence = props.confidence;
    this.accuracy = props.accuracy;
    this.lon = geom.coordinates[0];
    this.lat = geom.coordinates[1];
  };

  MapzenResult.prototype.getLink = function() {
    var source = this.source;
    var link;
    if (source === 'openstreetmap') {
      link = getOSMLink(this.id);
    } else if (source === 'geonames') {
      link = getGeonamesLink(this.id);
    } else {
      link = null;
    }
    if (!link) {
      link = 'http://www.openstreetmap.org/#map=19/' + this.lat + '/' + this.lon;
    }
    return link;
  };

  MapzenResult.prototype.getRow = function() {
    var $tr = $('<tr />');
    getTd(this.source).appendTo($tr);
    getTd(this.confidence).appendTo($tr);
    getTd(this.accuracy).appendTo($tr);
    getTd(this.name).appendTo($tr);
    getTd(this.label).appendTo($tr);
    getTdLink(this.getLink()).appendTo($tr);
    getTdLink(this.getMap(), 'View on Map').appendTo($tr);
    getTd(this.lon).appendTo($tr);
    getTd(this.lat).appendTo($tr);
    return $tr;

  };

  MapzenResult.prototype.getMap = function() {
    return 'http://openstreetmap.org/#map=19/' + this.lat + '/' + this.lon;
  }

  function getOSMLink(id) {
    var idSplit = id.split(':');
    var type = idSplit[0];
    if (type === 'polyline') {
      return null;
    }
    var objId = idSplit[1];
    return 'http://openstreetmap.org/' + type + '/' + objId;
  }

  function getGeonamesLink(id) {
    return 'http://geonames.org/' + id;
  }

  function getTd(text) {
    return $('<td />').text(text);
  }

  function getTdLink(url, text) {
    if (!text) {
      text = 'Link';
    }
    if (!url) {
      return $('<td />').text('No link');
    }
    var $a = $('<a />')
      .prop('target', '_blank')
      .prop('href', url)
      .text(text);
    return $('<td />').append($a);
  }

})();