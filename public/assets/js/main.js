$(document).ready(function(){
    $("#scrape").on("click", function(e){
        e.preventDefault();
            $("#scrape").click(()=>{ $.get("/api/articles", function(results) {
                
                console.log(results);
            }); 
        });   
    });
});

