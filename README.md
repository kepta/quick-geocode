
Scrapes popular places in a city from wikipedia or google.

Examples

Wikipedia list format
``` shell
URL=https://en.wikipedia.org/wiki/List_of_tourist_attractions_in_Paris TAG=ul node scrape.js
```

Wikipedia table format
``` shell
URL=https://en.wikipedia.org/wiki/List_of_museums_in_Paris TAG=table node scrape.js
```

Google 
``` shell
GOOGLE=Paris node scrape.js
```

All the commands will output a txt file.