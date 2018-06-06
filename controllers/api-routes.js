// Require MONGODB Models
var db = require("../models");

// Routes
module.exports = function(app){
    app.get("/api/articles", function (req, res){
        db.Article.find({}).then(function(results){
            console.log(results);
            res.json(results);
        });
    });

    app.post("api/comments/create", function(req, res){
        console.log(req.body);
        db.Comment.create({
            comment: req.body.comment,
        }).then(function(result){
            res.json(result);
        });
    });
}

