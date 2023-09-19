
// grab relevant elements from the html,
// <ul> when appending new li children (e.g. to do list)
// <div> when want to append new elements inside
// <input> and <form> when using user input data (to store or append or smth)
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKEY = "05c3cef6f340a347a7fc22e0b6607115"
let searchInput = $("#search-input");
let searchForm = $("#search-form");



function fetchCoord(search){
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKEY}`;
    // put the whole link incl. your api key in a variable
    // v usual fetch .then stuff
    fetch(queryURL)
        .then(function(data){
            return data.json()
        }).then(function(response){
            console.log(response);
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