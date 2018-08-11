// requiring dependencies

var express = require("express");
// var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
// Initializing Express
var app = express();
var URL = "https://en.wikipedia.org/wiki/Africa#Economy";
// database config 
// var databaseUrl = "scrapper";
// var collections = ["scrappedData"];

request(URL, function (err, res, body) {
    var $ = cheerio.load(body);
    var result = [];

    $("tbody").each(function (i, element) {

        var link = $(element).children().attr("href");
        var title = $(element).children().text();

        result.push({
            title: title,
            link: link
        });

    });
    console.log(result);
});


// app.listen(8080, function () {
//     console.log("app is running 8080");
// });