// This handles the front-end functionalities of the app.

$.getJSON("/articles", function(data) {
    // For-loop for each article
    for (var i = 0; i < data.length; i++) {
        // Creating outer object for article body div.
        var articleBody = $("<div>");
        articleBody.attr("class", "article-body");

        // Some articles scraped do NOT have a summary.
        // I made it so that those articles ONLY display title and link
        // Otherwise post title/link/summary!!
        if (typeof data[i].summary === "undefined") {

            articleBody.append("<p id='article-headline' data-id='" + data[i]._id + "'>" + data[i].headline + "</p>");
            articleBody.append("<a id='article-url' data-id='" + data[i]._id + "' href='" + data[i].link +"'>" + "Click Here For Full Article!</a>");
            articleBody.append("<button data-id='" + data[i]._id + "' class='deletebtn' href='/delete'> X </button>");
            $("#articles").append(articleBody);
        }
        else {

            articleBody.append("<p id='article-headline' data-id='" + data[i]._id + "'>" + data[i].headline + "</p>");
            articleBody.append("<a id='article-url' data-id='" + data[i]._id + "' href='" + data[i].link +"'>" + "Click Here For Full Article!</a>");
            articleBody.append("<p id='article-summary' data-id='" + data[i]._id + "'>" + data[i].summary + "</p>");
            articleBody.append("<button data-id='" + data[i]._id + "' class='deletebtn' href='/delete'>X</button>");
            $("#articles").append(articleBody);
        }
    }
});

// On-click for a "p" tag of an article
$(document).on("click", "p", function() {
    $("#comments").empty();
    // Save the ID from the p tag
    var thisId = $(this).attr("data-id");

    // Make an ajax call for Article&ID
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);
        // Add ALL comment info to the page
        $("#comments").append("<h2>" + data.headline);
        $("#comments").append("<input id='title-input' name='title'>");
        $("#comments").append("<textarea id='body-input' name='body'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' id='save-comment'>Add Comment</button>");

        // If there is a comment for the article, display it in values.
        if (data.comment) {
            $("#title-input").val(data.comment.title);
            $("#body-input").val(data.comment.body);
        }
    });
});

// On-click for "save-comment" button
$(document).on("click", "#save-comment", function() {

    // Grab the article's associated id
    var thisId = $(this).attr("data-id");

    // POST request to change note.
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#title-input").val(),
            body: $("#body-input").val()
        }
    })
    .then(function(data) {
        // Empty the comments section
        console.log(data);
        $("#comments").empty();
    });

    // Reset the values in input areas
    $("#title-input").val("");
    $("#body-input").val("");
});

// On-click for deletebtn.
$(document).on("click", ".deletebtn", function() {
    // Grab the id associated with article
    var thisId = $(this).attr("data-id");

    // Send a DELETE request.
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        location.reload();
    });
    
});