//Server set up
var express = require('express');
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cheerio = require("cheerio"); //for scraping
var request = require("request"); //for scraping

//Require all models
var db = require("./models");

//Initialize Express
var app = express();  //use express js module

//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: true}));
//Use express.static to serve the public folder as as static directory
app.use(express.static('public'));

//Set Handlebars
var handlebars = require('express-handlebars')

app.engine('handlebars', handlebars({ defaultLayout: "main"}));//sets "main" view as default
app.set('view engine', 'handlebars'); //sets express view engine to handlebars

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
}
else {
    mongoose.connect("mongodb://localhost/technews")
}


// Routes
require("./controllers/html-routes.js")(app);
require("./controllers/api-routes.js")(app);

// Start the server
mongoose.connection.on('error', function(err){
    console.log("Mongoose Error: " + err);
})

mongoose.connection.on('open', function(){
    console.log("Mongoose connection successful.");
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), function(){ //start express server
        console.log( 'Express Server Started on http://localhost:3000');
});
});

// First, tell the console what server.js is doing
console.log("\n******************************************\n" +
            "Grabbing every article headline and link\n" +
            "from the Reuters website:" +
            "\n******************************************\n");

// Scrape data from one site and place it into the mongodb db
// Making a request for `reuters.com`'s technologyNews page
request("https://www.reuters.com/news/archive/technologyNews/", function(error, response, html) {

  // Load the body of the HTML into cheerio
  var $ = cheerio.load(html);

  // Empty array to save our scraped data
  var results = [];

  // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
  $("div.story-content").each(function(i, element) {

    // Find the h4 tag's parent a-tag, and save it's href value as "link"
    var href = $(element).find("a").attr("href");
     
    // Combined href with https address
    var link = "https://www.reuters.com/"+ href;
    
    // Save the text of the h4-tag as "title"
    var title = $(element).find("a").find("h3").text().trim();
    
    //Save the description of article
    var description = $(element).find("p").text();

    //Save the article time stamp
    var date = $(element).find("time").text().trim();
    
    //make an object
    results.push({
        title: title,
        link: link,
        description: description,
        date: date,
        })
    //after looping log the results
        console.log(results);
        db.Article.create({
                    title: title,
                    link: link,
                    description: description,
                    date: date,
                    
                 })
                 .then(function(dbArticle){
                     console.log(dbArticle)
                 })
                 .catch(function (err){
                     console.log(err.message);
                 });
                 
    // });
});
});


//  TODO    
// When the server starts, create and save a new Article documents to the db
// The "unique" rule in the Article model's schema will prevent duplicate articles from being added to the server
//     If this found element had a title,a link, a description and a date
//     if(link && title && description && date) {
//         //Insert the data in the Article collection
        
       
//         MONGODB_URI.Article.create({
//         title: title,
//         link: link,
//         description: description,
//         date: date,
//         comment: comment
//      })
//      .then(function(MONGODB_URIArticle){
//          console.log(MONGODB_URIArticle)
//      })
//      .catch(function (err){
//          console.log(err.message);
//      });   
//     }
//   });
// });
// //Send "scrape complete" to browser
// // res.send("Scrape Complete");

//Listen on port 3000
// app.listen(app.get('port'), function(){ //start express server
// 	console.log( 'Express Server Started on http://localhost:3000');

// });
    

