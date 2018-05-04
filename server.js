var express = require('express');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var shows = {};

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

function getShows(showID){
  var fileList = [];
  var idx=0;

  function readFeed(idx) {
    console.log("showID:" + showID + "     idx:" + idx);
    var url = "http://horriblesubs.info/lib/getshows.php?type=show&showid=" + showID + "&index=" + idx;
    rp(url)
      .then(function (body){
        console.log(body);
        processLinks(body);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function processLinks(html) {
    if(html != 'DONE') {
      var $ = cheerio.html(html);
      $(".release-table").array.forEach(element => {
        fileList.push(element.children().children().first().text());
        console.log(element.children().children().first().text());
      });
    } else {
      readFeed(++idx);
    }
  }

  return fileList;
}

app.get('/scrape', function(req,res){
  var url = "http://horriblesubs.info/shows/boku-no-hero-academia";
  var files = getShowId(url).then((showID) => getShows(showID));
  console.log(files);
  /*url = "http://horriblesubs.info/shows/boku-no-hero-academia";
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
  });*/
});

app.listen('8081');
console.log("App is running on localhost:8081");
exports = module.exports = app;