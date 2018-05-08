var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

function getShowLinks(showURL) {

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
            $("div.release-links").each(function(i,element){
              var obj = {};
              var links = [];
              var magnets = [];
              var torrents = [];
              var ddl = [];
              obj.label = $(".dl-label",this).text();
              //Magnets
              $(".hs-magnet-link",this).each(function(i,element){        
                if($("a",this).attr("href")){  
                  magnets.push($("a",this).attr("href"));
                }
              });
              links.push(magnets);

              //Torrents
              $(".hs-torrent-link",this).each(function(i,element){
                if($("a",this).attr("href")){
                  torrents.push($("a",this).attr("href"));
                }
              });
              links.push(torrents);

              //DDL Links
              $(".hs-ddl-link",this).each(function(i,element){
                if($("a",this).attr("href")){
                  ddl.push($("a",this).attr("href"));
                }
              });
              links.push(ddl);

              obj.links = links;
              showList.push(obj);
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

  var shows = getShowId(showURL)
    .then(function(showID){
      return getShows(showID);
    })
    .then(function(result) {
      return result;
    })
    .catch(function(err){
      throw new Error(err);
    });
  
    return shows;
}

module.exports.getShowLinks = getShowLinks;