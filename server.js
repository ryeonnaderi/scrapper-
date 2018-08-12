// requiring dependencies

var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

// Initializing Express
var app = express();
var URL = "https://en.wikipedia.org/wiki/Africa#Economy";

// database config 
var databaseUrl = "scrapper";
var collections = ["scrappedData"];
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("database error: ", error);
});

app.get("/", function (req, res) {
    res.send("Hello world");
});
app.get("/get", function (req, res) {
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
        // console.log(result);
        db.scrapper.insert({
            result
        });
        res.toJSON(result);
    });
});
app.get("/find", function (req, res) {

    db.scrapper.find({}, function (err, data) {
        console.log(res);
        res.json(data);
    });
});


app.listen(8080, function () {
    console.log("app is running 8080");
});