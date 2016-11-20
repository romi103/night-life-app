$(document).ready(function () {

    var progresBar = document.getElementById('search-progress');

    var searchResults = document.getElementById('search-results');
    var searchButton = document.getElementById('search-button');
    
    
    
    function search(e) {
        e.preventDefault();
        searchButton.childNodes[1].nodeValue = " Please wait...";
        progresBar.style.display = "block";
        searchResults.style.display = "none";

        var input = $(this).serialize();

        $.post("/search", input, function (data) {
            //searchButton.disabled = false;
            //console.log(data);
            searchButton.childNodes[1].nodeValue = " Search";

            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);

            var context = JSON.parse(data);
            var html_el = template(context);


            searchResults.style.display = "block";
            searchResults.innerHTML = html_el;
            progresBar.style.display = "none";

        }).then(function () {
            //attaching click handler the go button
            var goButton = document.getElementsByClassName("search-result-goButton");
            var goButtonId;
            //console.log()
            
            Array.prototype.forEach.call(goButton, function (element) {
                element.addEventListener("click", function () {
                  goButtonId = this.getAttribute("data-id");
             
                    
                    
                    $.get("/go/" + goButtonId + "", function (data){
                        
                        if (!data.isAuthenticated) {
                            window.location = "/signin";
                        }
                        
                    }).fail(function() {
    console.log( "error" );
  });
                    
                    
                    
                });
            });
        }).fail(function (data) {
        console.log(data.responseText);
    });

}


    $("#search-form").on("submit", search);
    
});