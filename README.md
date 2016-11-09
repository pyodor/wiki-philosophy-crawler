## To Install And Test

Make sure you have <a href="https://nodejs.org/en/download/" target="_blank">nodejs and npm</a> installed then clone this repository

    > git clone https://github.com/pyodor/wiki-philosophy-crawler.git

Switch directory, install npm packages and run the server

    > cd wiki-philosophy-crawler && npm install && DEBUG=rc:* npm start

Use <a href="http://conqueringthecommandline.com/book/curl" target="_blank">cURL</a> to test

    › curl --data "wikiUrl=https://en.wikipedia.org/wiki/Wikipedia:Getting_to_Philosophy" http://localhost:3000/crawl



### Hated cURL? <img src="http://ragemaker.net/images/troll.png">

<a href="https://www.hurl.it" target="_blank">Hurl It!</a> or get a
<a href="https://www.getpostman.com" target="_blank">Postman</a>!

See some <a href="https://www.runscope.com/radar/5wv2odzc7zks/091223ef-4e38-4c76-af78-e3177721a10a/history/5151ccb1-67fc-41ac-936a-967ae3dc2bfa" target="_blank">Runscope Test</a> results.

<img src="http://i.giphy.com/P2Qo8ur3LXqh2.gif" width=150px>
