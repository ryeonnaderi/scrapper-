// requiring dependencies

var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

// Initializing Express
var app = express();
var URL = "https://www.gamespot.com/news/";

// database config 
var databaseUrl = "scrapper";
var collections = ["scrappedData"];
var db = mongojs(databaseUrl, collections);

db.on("error",  (error) => {
     console.log("database error: ", error);
});

app.get("/",  (req, res) =>  {
    res.send("Hello world");
});
app.get("/get",  (req, res)=> {
    request(URL,  (err, res, body) => {
        var $ = cheerio.load(body);
        var results = [];

        $(".media-article").each( (i, element) => {

            var title = $(this).children("a").children(".media-body").children("h3").text();
            var link = $(this).children("a").attr("href");
            var fullLink = "https://www.gamespot.com" + link;
            var summary = $(this).children("a").children(".media-body").children("p").text();
            // var title = $(this).children().text();
            console.log("--------------------------------------------");
            console.log(title);
            console.log(fullLink);
            console.log(summary);

            if (title && summary && link) {

                results.push({
                    title: title,
                    link: fullLink,
                    summary: summary
                });
                db.scrapper.insert({
                    title: title,
                    link: fullLink,
                    summary: summary
                });

            }

        });
        db.scrapper.insert(results, {
            ordered: false
        });
        // {
        //     results
        // });
        res.toJSON(results);
    });
});
app.get("/find",  (req, res) => {

    db.scrapper.find({},  (err, data) => {
        console.log(res);
        res.json(data);
    });
});



app.listen(8080,  () => {
    console.log("app is running 8080");
});