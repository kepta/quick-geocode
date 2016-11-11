(function() {
    var OpencageResult = window.OpencageResult = function(data) {
        this.confidence = data.confidence;
        this.type = data.components._type;
        this.name = data.components[this.type];
        this.address = data.formatted;
        this.osmLink = getOsmLink(data.annotations.OSM.edit_url);
        this.mapLink = data.annotations.OSM.url;
        this.lon = data.geometry.lng;
        this.lat = data.geometry.lat;

    };

    OpencageResult.prototype.getRow = function() {
        var $tr = $('<tr />');
        $('<td />').text(this.confidence).appendTo($tr);
        $('<td />').text(this.type).appendTo($tr);
        $('<td />').text(this.name).appendTo($tr);
        $('<td />').text(this.address).appendTo($tr);
        $('<td />').append(
            $('<a />')
                .prop('target', '_blank')
                .prop('href', this.osmLink)
                .text('OSM Link')
            ).appendTo($tr);
        $('<td />').append(
            $('<a />')
                .prop('target', '_blank')
                .prop('href', this.mapLink)
                .text('View on Map')
            ).appendTo($tr);
        getWikiTd().appendTo($tr);
        getGoogleTd().appendTo($tr);
        $('<td />').text(this.lon).appendTo($tr);
        $('<td />').text(this.lat).appendTo($tr);
        return $tr;
    };

    function getOsmLink(editUrl) {
        if (!editUrl) return '';
        var osmType = /way|node/.exec(editUrl)[0];
        var osmId = /\d+/.exec(editUrl)[0];
        return 'http://openstreetmap.org/' + osmType + '/' + osmId;
    }

})();