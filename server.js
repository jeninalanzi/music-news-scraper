// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Set port
var PORT = 3000;

// Initialize express
var app = express();

// Use HTML routes
var routes = require("./controllers/htmlRoutes.js");

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static content from the public directory.
app.use(express.static("public"));

// Set handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set app to use html routes.
app.use(routes);

// Connect to MongoDB
mongoose.connect("mongodb://localhost/mongoheadline", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});