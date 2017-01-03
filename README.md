This is a simple tool to use different geocoders ([Mapzen](https://mapzen.com/products/search/) and [Opencage](https://geocoder.opencagedata.com/), currently) to attempt to geocode places in [OpenStreetMap](http://osm.org).

You can try it out at https://batpad.github.io/quick-geocode/ .

The page requires two query parameters: a `name` and a `city`. `name` should be the string you are searching for and `city` will define the bounding box to use to narrow your search.

For a list of allowed city names: https://github.com/batpad/quick-geocode/blob/gh-pages/index.js#L7

An example query: https://batpad.github.io/quick-geocode/?name=Empire%20State&city=NYC