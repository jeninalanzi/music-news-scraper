// Scraping tools and express dependency
var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");

var app = express.Router();

// Import the models to use their database functions.
var db = require("../models");

// GET route for scraping the NuclearBlast news website
app.get("/scrape", function (req, res) {
    // Grab the body of html with axios
    axios.get("https://www.nuclearblast.com/en/music/news/index.html")
        .then(function (response) {
            // Load the body into cheerio, save into a short selector
            var $ = cheerio.load(response.data);

            // Grab elements from the DOM that contains articles
            $("td.nth-1").each(function (i, element) {
                var result = {};

                // Pass the scraped values into result
                result.headline = $(this).children("h2").children("a").text();
                result.link = $(this).children("h2").children("a").attr("href");
                result.summary = $(this).children("p.no-margin").text();

                // Create a new Article using the "result" of scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the results in the console.
                        console.log("RESULT OF DB ARTICLE");
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If error occurs, log it.
                        console.log(err);
                    });
            });

            // Send a message to the client
            res.send("Scrape complete. <a href='/'>Home Page</a>")
        });
});

// Route to delete notes
app.delete("/articles/:id", function (req, res) {
    console.log("id: " + req.params.id);
    // Find Article by ID and remove it
    db.Article.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: "Note Deleted!" });
        }
    });
});

// Route to get all Articles from the DB
app.get("/", function (req, res) {
    // Grab every document in Articles collection
    db.Article.find({})
        .then(function (data) {
            var hbsObject = {
                scrapes: data
            };
            console.log(hbsObject);
            res.render("index", hbsObject);
        })
        .catch(function (err) {
            // If error occurs notify the client.
            res.json(err);
        });
});

// 2nd Route for getting all Articles from DB
app.get("/articles", function (req, res) {
    // Grab every document from Articles
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by ID
// Then populate all Comments associated with it
app.get("/articles/:id", function (req, res) {
    //Populate all Comments associated with Article
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving & updating an Article's associated Comment(s)
app.post("/articles/:id", function (req, res) {
    // Create a new Note and pass the req.body as the entry
    db.Note.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        });
});

// Delete a particular Article.
app.delete("/articles/:id", function (req, res) {
    console.log("id:" + req.params.id);
    db.Article.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Note Deleted!' });
    });
});


// Export for other apps to use.
module.exports = app;