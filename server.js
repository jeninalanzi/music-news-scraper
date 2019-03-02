// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

// Set port
const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set public as the static folder
app.use(express.static("public"));
// Set handlebars as view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database.
// Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// ===================================================================
// ============================ ROUTES ===============================

// The GET route for scraping the MetalSucks News website
app.get("/scrape", function(req, res) {
    // Grab the html body with axios
    axios.get("https://www.nuclearblast.com/en/music/news/index.html")
    .then(function(response) {
        // Load the body into cheerio, save into a short selector
        const $ = cheerio.load(response.data);

        $("td.nth-1").each(function(i, element) {
            var result = {};

            // Pass the scraped values into result
            result.headline = $(this).children("h2").children("a").text();
            result.link = $(this).children("h2").children("a").attr("href");
            result.summary = $(this).children("p.no-margin").text();

            // SUCCESSFUL - this does print results to console
            console.log(result.headline);
            console.log(result.summary);
            console.log("---------------------------");
            
            // Create a new Article using the "result" of scraping
            db.Article.create(result).then(function(dbArticle) {
                console.log("RESULT OF DB ARTICLE");
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        // Route for getting all the Articles from db
        // WARNING: THIS CODE NEEDS EDITING
        // DOES NOT WORK YET - SERVER DOESN'T COMMUNICATE
        // TO THIS
        app.get("/articles", function(req, res) {
            console.log("this works");
            // Grab all articles & display as JSON
            db.Article.find({})
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        });



        
    });
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});