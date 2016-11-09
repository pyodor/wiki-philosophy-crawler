var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

router.post('/', function(req, res, next) {
  var crawled = [];
  var baseUrl = '';
  var url = '';
  var startingWiki = true;

  function error400(response) {
    response.status(400).send("400 Bad Request");
  }

  var notValidParam = (!req.body.wikiUrl || typeof req.body.wikiUrl != "string");
  if(notValidParam) {
    error400(res);
  }
  else {
    url = req.body.wikiUrl.trim();
    var regex = /((?:http|https):\/\/\D{2}.wikipedia.org)(\/wiki\/\S*)/
    var matches = regex.exec(url);

    if(!matches.length) {
      error400(res);
    }
    else {
      url = matches[0];
      baseUrl = matches[1];
      var article = matches[2]
      var onLoop = false;

      console.info('starting article => ' + article);
      crawl(article);

      function crawl(article) {

        function toJson() {
          var json = {'startingWiki': url, 'wikisToPhilosophy': crawled};
          if(onLoop) {
            json["reachOnLoop"] = true;
          }
          res.json(json);
        }

        var articleUrl = baseUrl + article;
        console.info('crawling => ' + articleUrl)

        request(articleUrl, function(error, response, html) {
          if(error){
            console.log('ERROR: ' + error);
            toJson();
            return false;
          }
          else {
            function stripOutParenthesizeLinks(html) {
              var regex = /(\([^\)]+\))/g;
              var matches = regex.exec(html);
              $(matches).each(function(i, m){
                if(m.search('href=')!==-1) {
                  html = html.replace(regex, '');
                  return false;
                }
              });
              return html;
            }

            function stripOutSuperscriptLinks(html) {
              var regex = /<sup\b[^>]*>(.*?)<\/sup>/g;
              return html.replace(regex, '');
            }

            function stripOutAnchorizedLinks(html) {
              var regex = /<a href="#.*<\/a>/g;
              return html.replace(regex, '');
            }

            function stripOutItalicizedLinks(html) {
              var regex = /<i>.*<\/i>/g;
              return html.replace(regex, '');
            }

            var $ = cheerio.load(html);
            var title = $("#firstHeading").text();
            var paragraphs = $("#mw-content-text").find('p')
            var validLink = null;
            var nextArticle = null;

            paragraphs.each(function(){
              var p = stripOutParenthesizeLinks($(this).html());
                  p = stripOutSuperscriptLinks(p);
                  p = stripOutAnchorizedLinks(p);
                  p = stripOutItalicizedLinks(p);

              var strippedParagraph = $('<p>').html(p);
              validLink = strippedParagraph.find('a').first();

              if(validLink.length > 0) {
                nextArticle = validLink.prop('href');
                return false;
              }
            });

            var onTheLoop = crawled.find(function(e){
              return e.articleUrl === (baseUrl + article);
            })

            if(onTheLoop) {
              onLoop = true;
              toJson();
              return false;
            }

            if(!startingWiki) {
              crawled.push({title: title, articleUrl: baseUrl + article});
            }
            else {
              startingWiki = false;
            }

            var isPhilosophy = article.toLowerCase() === '/wiki/philosophy';
            if(isPhilosophy) {
              toJson();
              return false;
            }

            if(nextArticle && nextArticle.trim()) {
              crawl(nextArticle);
            }
          }
        });
      }
    }
  }
});

module.exports = router;
