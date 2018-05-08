var getLinks = require('./getLinks.js');

getLinks.getShowLinks("http://horriblesubs.info/shows/chis-sweet-adventure-s2/")
    .then(function(result){
        console.log(result);
    })
    .catch(function(err){
        console.log(err);
    });