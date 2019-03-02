// THIS CREATES THE MODEL FOR COMMENT.
const mongoose = require("mongoose");

// Schema constuctor
const Schema = mongoose.Schema;

// Create a new CommentSchema object
const CommentSchema = new Schema ({
    title: String,
    body: String
});

// Create model from the above schema.
const Comment = mongoose.model("Comment", CommentSchema);

// Export Note model
module.exports = Comment;