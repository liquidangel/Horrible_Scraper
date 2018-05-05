var express = require('express');
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
        reject(error);
      }
    });
  });
}

function getShows(showID, idx, showList){
  return new Promise(function(resolve, reject){
    if(!idx){
      idx = 0;
    }
    if(!showList){
      showList = [];
    }
    var url = "http://horriblesubs.info/lib/getshows.php?type=show&showid=" + showID + "&nextid=" + idx;
    request(url, function(error, response, html){
      if(!error) {
        if(html != 'DONE') {
          console.log("Adding shows to list for index: " + idx);
          var $ = cheerio.load(html);
          $("table.release-table").each(function(i,element) {
            var a = $(this);
            showList.push(a.children().children().first().text());
            //showList.push(element);
          });
          resolve(getShows(showID, ++idx, showList));
        } else {
          resolve(showList);
        }
      } else {
        reject(error);
      }
    })
  })
}

/*app.listen('8081');
console.log("App is running on localhost:8081");
exports = module.exports = app;*/
getShowId('http://horriblesubs.info/shows/boku-no-hero-academia')
  .then(function(showID){
    return getShows(showID);
  })
  .then(function(result) {
    console.log(result);
  })
  .catch(function(err){
    console.log(err);
  });
