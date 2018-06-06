$(document).ready(function(){
    $("#scrape").on("click", function(e){
        e.preventDefault();
        $.get("/api/articles", function(req, res) {
            (function(data){
                var hbsObject = {
                    article: data
                };
                console.log(hbsObject);
                res.render("index", hbsObject);
            });   
            });
        });
    });
