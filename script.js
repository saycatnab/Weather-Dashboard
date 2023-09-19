
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

function renderCurrentWeather(city, weatherData){
    let date = dayjs().format("DD MMM YYYY");
    let temp = weatherData.main.temp;
    let windKph = weatherData.wind.speed
    let humidity = weatherData.main.humidity;
    let imgURL = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`
    let imgDescription = weatherData.weather[0]
    let card = $("<div>");
    let cardBody = $("<div>");
    let weatherIcon = $("<img>")

    let heading = ("<h2>");
    let tempEl = $("<p>");
    let windEl = $("<p>");
    let humdity = $("<p>");

    card.attr("class", "card");

    cardBody.attr("class", "card-body");

    card.append(cardBody)


    heading.attr("class", "h3 card-title" );
    tempEl.attr("class", "card-text");
    windEl.attr("class", "card-text");
    humdity.attr("class", "card-text");

    heading.text(`${city} ${date}`);
}

function fetchWeather(location){
    // console.log(location)
    // always console log to see if it works. it does, which it shows an array of locations, data e.g. lat, lon, name
    let latitude = location.lat;
    let longitude = location.lon;
    let city = location.name;

    let queryWeatherURL =  `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKEY}`
    
    console.log(queryWeatherURL);

    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        renderCurrentWeather(city, response.list[0]);
        // renderForcast(data.list);
    })

    // fetch(queryURL, {method: "GET"})
    //     .then(function(data){
    //         return data.json()
    //     }).then(function(response){
    //         renderCurrentWeather(city, response.list[0]);
    //         renderForcast(data.list);
    //     })
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
                // ^ this allows the search data(user input location) go into this function, to be used
                fetchWeather(response[0])
                // ^ this will fetch the response(data for whatever location)to this function.[0] means the first array of the stated location(since many variations)
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
    searchInput.val("");
    // makes the input empty after submitting location
};

function initializeHistory(){
    let storedHistory = localStorage.getItem("search-history");

    if(storedHistory){
        searchHistory = JSON.parse(storedHistory);
        
    }
    renderSearchHistory()
}
searchForm.on("submit", submitSearchForm);
// dont add in the () when doing an eventlistener, messes up for some reason.