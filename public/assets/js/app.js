// This handles the front-end functionalities of the app.

$.getJSON("/articles", function(data) {
    // For-loop for each article
    for (var i = 0; i < data.length; i++) {
        // Some articles scraped do NOT have a summary.
        // I made it so that those articles ONLY display title and link
        // Otherwise post title/link/summary!!
        if (typeof data[i].summary === "undefined") {
        $("#articles").append("<button data-id='" + data[i]._id + "' class='deletebtn'>X</button><p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p>");
        }
        else {
            $("#articles").append("<button data-id='" + data[i]._id + "' class='deletebtn'>X</button><p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p>");
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].summary);
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
    })
});