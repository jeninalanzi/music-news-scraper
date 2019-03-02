// THIS FILE CREATES THE SCHEMA FOR ARTICLE.
var mongoose = require("mongoose");

// Schema constuctor
const Schema = mongoose.Schema;

// Create a new ArticleSchema object
const ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// Create the model from the above schema.
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;