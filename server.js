var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

function getShowId(url) {
  return new Promise(function(resolve, reject){
    request(url,function(error,response,html){
      if(!error) {
        var start = html.indexOf("var hs_showid =");
        showID = html.substr(start, html.indexOf(";",start)-start).split("=")[1].trim();
        resolve(showID);
      } else {
        reject(err);
      }
    });
  });
}

function getShows(baseUrl, index){
  return new Promise(function(resolve, reject){
    
  })
}

app.get('/scrape', function(req,res){
  url = "http://horriblesubs.info/shows/boku-no-hero-academia";
  var showID;
  request(url,function(error,response,html){
    if(!error) {
      var start = html.indexOf("var hs_showid =");
      showID = html.substr(start, html.indexOf(";",start)-start).split("=")[1].trim();
      console.log("showID: " + showID);
      console.log("ShowID = " + showID);
      if(showID != '') {
        startUrl = "http://horriblesubs.info/lib/getshows.php?type=show&showid=" + showID;
        var idx = 0;
        var htmlProcess = "";
        var magnetLinks = [];
        while(htmlProcess != 'DONE') {
          console.log("htmlProcess: " + htmlProcess);
          request(startUrl + "&nextid=" + idx++, function(error, response, html){
            if(!error) {
              console.log("html: " + html);
              htmlProcess = html;
              var $ = cheerio.html(html);
              $(".release-table").array.forEach(element => {
                console.log(element.children().children().first().text());
              });
            }
          });      
        }
      }
    } else {
      console.log(error);
      console.log(response);
    };
  });
});

app.listen('8081');
console.log("App is running on localhost:8081");
exports = module.exports = app;