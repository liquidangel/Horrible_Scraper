var express = require('express');
var getLinks = require('./getLinks.js');

getLinks.getShowLinks("https://horriblesubs.info/shows/boku-no-hero-academia/")
    .then(function(result){
        console.log(result);
    })
    .catch(function(err){
        console.log(err);
    });