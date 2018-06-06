// Dependencies
var path = require("path");

var db = require("../models");

// Routes
module.exports = function(app) {
    
    app.get("/", function(req,res){
        db.Article
        .find(
            { saved: false},
            [],
            {
                limit: 20,
                
            }
        )
        .then(function(dbArticle){
            var hbsObject = {
                hasArticles: (dbArticle.length > 0) ? true : false,
                articles: dbArticle
            }
            res.render("index", hbsObject);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    app.get("/saved", function(req,res){
        db.Article
        .find(
            {saved: true},
            [],
            {
                sort:('-date')
            }
        )
        .populate("comments")
        .then(function(dbArticle){
            var hbsObject = {
                hasArticles: (dbArticle.length > 0) ? true : false,
                articles: dbArticle
            }
            res.render("saved", hbsObject);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    app.get("/articles", function(req,res){
        // Grabs all unsaved document in the Article collection 
        db.Article
        .find(
            { saved: false},
            [],
            {
                limit: 20,
                sort:('-date')
            }
        )
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    app.get("/articles/saved", function(req,res){
        // Grabs every saved document in the Article collection
        db.Article
        .find(
            {saved: true},
            [],
            {sort:('-date')}
        )
        .populate("comment")
        .then(function(dbArticle){
            res.json(dbArtcle)
        })
        .catch(function(err){
            res.json(err);
        });
    });

    app.get("/article/:title", function(req,res){
        // Using the title passed in the title parameter, prepare a query that finds the matching one in the db
        db.findOne({_title: req.params.title})
        // and populate all of the comments associated with it
        .populate("comment")
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
    });
};