// This handles the front-end functionalities of the app.

$.getJSON("/articles", function(data) {
    // For-loop for each article
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<button data-id='" + data[i]._id + "' class='deletebtn'>X</button><p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p>");
    }
});

$(document).on("click", "p", function() {
    alert("HI YOU!");
});