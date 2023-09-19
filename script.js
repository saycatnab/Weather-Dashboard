
// grab relevant elements from the html,
// <ul> when appending new li children (e.g. to do list)
// <div> when want to append new elements inside
// <input> and <form> when using user input data (to store or append or smth)
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKEY = "05c3cef6f340a347a7fc22e0b6607115"
let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistory = []
// ^ the search history is empty at first
let searchHistoryContainer = $("#history")
// ^ get the div called history in html

function renderSearchHistory(){
    searchHistoryContainer.html("");
                // ?? idk why

    for(let i=0; i< searchHistory.length; i++){
        let btn = $("<button>");
        btn.attr("type", "button");
        btn.addClass("history-btn btn-history")

        btn.text(searchHistory[i])
        btn.attr("data-search", searchHistory[i]);
        searchHistoryContainer.append(btn);
    }
}

function appendSearchHistory(search){
    if(searchHistory.indexOf(search) !== -1){
        // if adding in the same location twice, then it will be returned i.e. not included. if not line 31
        return

    }
    searchHistory.push(search);
    // ^ adds the new location in the array
    localStorage.setItem("seach-history", JSON.stringify(searchHistory))
    // makes a new folder in localStorage and allows the search to be more readable in string.
    renderSearchHistory();
    
}

function fetchCoord(search){
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKEY}`;
    // put the whole link incl. your api key in a variable
    // v usual fetch .then stuff
    fetch(queryURL, {method: "GET"})
        .then(function(data){
            return data.json()
        }).then(function(response){
            if(!response[0]){
                // if theres nothing inside the first array of the object, then alert.
                alert("Location not found")
            } else{
                appendSearchHistory(search);
            }
        })
}

function submitSearchForm(event){
    // remember (event) needs to be in the function to allow the linked event listener to work 
    event.preventDefault();
    // ^prevents the glitching of the website whenever something happens
    // alert(searchInput.val().trim());
    // ^simple to explain but dont forget whenever dealing with an input tag.
    
    let search = searchInput.val().trim();

    fetchCoord(search);
    // bringing the user city input into another function. Function above this one.
};

searchForm.on("submit", submitSearchForm);
// dont add in the () when doing an eventlistener, messes up for some reason.