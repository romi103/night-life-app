$(document).ready(function () {
    console.log(window.location);
    
    

    var progresBar = document.getElementById('search-progress');

    var searchResults = document.getElementById('search-results');
    var searchButton = document.getElementById('search-button');

    //attaching click handler the go button
    var goButton = document.getElementsByClassName("search-result-goButton");
    var goButtonId;

    //adding event listener for goButton and if not logged in redirect
    Array.prototype.forEach.call(goButton, function (element) {
        element.addEventListener("click", function () {
            goButtonId = this.getAttribute("data-id");

            var goButtonTemp = this;

            $.get("/go/" + goButtonId + "", function (data) {
                //if user is not logged in - redirect to the sigin page
                if (!data.isAuthenticated) {
                    if (!sessionStorage.getItem("query")) {

                        sessionStorage.setItem("query", window.location.search);
                    }

                    window.location = "/signin";
                } else {
                    //chnage number of goers
                    goButtonTemp.children[0].innerHTML = data.numberAtten;
                }
            }).fail(function () {
                console.log("error");
            });
        });
    });



    function search(e) {

        searchButton.childNodes[1].nodeValue = " Please wait...";
        progresBar.style.display = "block";
        searchResults.style.display = "none";


    }


    $("#search-form").on("submit", search);

});