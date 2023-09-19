
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
let searchHistoryContainer = $("#history");
let forecastContainer = $("#forecast");
// ^ get the div called history in html
let todayContainer = $("#today");

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

    let heading = $("<h2>");
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
    weatherIcon.attr("src", imgURL);
    weatherIcon.attr("alt", imgDescription);

    heading.append(weatherIcon);
    tempEl.text(`Temp ${temp} C`);
    windEl.text(`Wind ${windKph} KPH`);
    humdity.text(`Humidity ${humidity} %`);
    cardBody.append(heading, tempEl, windEl, humdity);

    todayContainer.html("")
    todayContainer.append(card)
}

function renderForecast(weatherData){
    let headingCol = $("<div>");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    heading.text("5-day forcast");
    headingCol.append(heading);

    forecastContainer.html("");

    forecastContainer.append(headingCol);
    // console.log(weatherData)

    let futureForecast = weatherData.filter(function(forecast){
        return forecast.dt_txt.includes("12")
    })

    for(let i= 0; i< futureForecast.length; i++){
        let iconURL = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`
        // console.log(iconURL)
        let iconDescription = futureForecast[i].weather[0].description;
        let tempC = futureForecast[i].main.temp;
        let humidity = futureForecast[i].main.humdity;
        let windKPH = futureForecast[i].wind.speed;

        let col = $("<div>");
        let card = $("<div");
        let cardBody = $("<div>");
        let cardTitle = $("<h5>");
        let weatherIcon = $("<img>");
        let tempEl = $("<p>");
        let windEl = $("<p>");
        let humidityEl = $("<p>");

        col.append(card);
        card.append(cardBody);
        cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

        col.attr("class", "col-md");
        card.attr("class", "card bg-primary h-100 text-white");
        cardTitle.attr("class", "card-title");
        tempEl.attr("class", "card-text");
        windEl.attr("class", "card-text");
        humidityEl.attr("class", "card-text");

        cardTitle.text(dayjs(futureForecast[i].dt_text).format("DD MMM YYYY"));
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", iconDescription);
        tempEl.text(`Temp: ${tempC} C`);
        windEl.text(`Wind: ${windKPH} KPH`);
        humidityEl.text(`Humidity: ${humidity} %`);

        forecastContainer.append(col);
    }



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
        // console.log(response)
        renderCurrentWeather(city, response.list[0]);
        renderForecast(response.list);
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

function clickSearchHistory(event){
    if(!$(event.target).hasClass("btn-history")){
        return
    }
    let search = $(event.target).attr("data-search")
    
    fetchCoord(search);
    searchInput.val("")
    // alert(search);

}

initializeHistory()
searchForm.on("submit", submitSearchForm);
// dont add in the () when doing an eventlistener, messes up for some reason.
searchHistoryContainer.on("click", clickSearchHistory)