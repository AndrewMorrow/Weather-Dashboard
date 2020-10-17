const searchFieldElem = $(".search-bar");
const searchHistoryElem = $(".search-history");
const cityDisplayElem = $(".city-display");
const forecastElem = $(".forecast");
const errorElem = $(".error-notification");
const searchButtonElem = $(".search-button");
const apiKey = `352f5b8e182609abba7014500a96eea5`;
const apiBase = `http://api.openweathermap.org/data/2.5/`;
var storageArray = [];

// waits until document is fully loaded
$(document).ready(function () {
    // grabs searches from localstorage
    grabStorage();
    // fires on search button click
    searchButtonElem.on("click", (e) => {
        e.preventDefault();
        // clears the display
        cityDisplayElem.empty();
        forecastElem.empty();
        errorElem.empty();
        // grabs user input
        userCityCall = $("input").val();
        $("input").val("");
        // sends input to call api
        recieveUserCity(userCityCall);
    });

    // calls the api to receive weather information and display it
    function recieveUserCity(cityCall) {
        let apiUserCity = `${apiBase}weather?q=${cityCall}&units=imperial&APPID=${apiKey}`;
        // clears the display
        cityDisplayElem.empty();
        forecastElem.empty();
        errorElem.empty();

        // calls to get weather info
        $.ajax({
            url: apiUserCity,
        })
            .then(function (response) {
                // targets info from the api call to utilize
                var weatherReceived = response;
                var dateGet = weatherReceived.dt;
                var currentDateSet = new Date(
                    dateGet * 1000
                ).toLocaleDateString();
                var cityNameReceived = weatherReceived.name;
                var weatherIconId = weatherReceived.weather[0].icon;
                var temperature = weatherReceived.main.temp;
                var humidity = weatherReceived.main.humidity;
                var windSpeed = weatherReceived.wind.speed;
                let latitude = weatherReceived.coord.lat;
                let longitude = weatherReceived.coord.lon;

                // creates elements and appends them with the api info
                var cityNameHeader = $(
                    `<h2> ${cityNameReceived} ${currentDateSet}<img src=" http://openweathermap.org/img/wn/${weatherIconId}.png"></img> </h2>`
                );
                var tempDisplay = $(`<p> Temperature: ${temperature} °F </p>`);
                var humDisplay = $(`<p> Humidity: ${humidity} % </p>`);
                var windSpeedDisplay = $(
                    `<p> Wind Speed: ${windSpeed} MPH </p>`
                );
                cityDisplayElem.append(cityNameHeader);
                cityDisplayElem.append(tempDisplay);
                cityDisplayElem.append(humDisplay);
                cityDisplayElem.append(windSpeedDisplay);
                cityDisplayElem.addClass("addBorder");

                // sends city name to call forecast
                getForecast(cityCall);
                // sends coords to call uv index
                getUvi(latitude, longitude);
                // keeps duplicate names out of the search history
                checkNames(cityCall);
            })
            .catch(function () {
                // sets an error if retrieving data failed
                errorElem.text(
                    "An error occured when retrieving the data. Please check your spelling and try again."
                );
            });
    }

    function getUvi(lat, long) {
        let apiUvi = `${apiBase}uvi?lat=${lat}&lon=${long}&units=imperial&APPID=${apiKey}`;

        // call to get uv index info
        $.ajax({
            url: apiUvi,
        })
            .then(function (response) {
                var uviReceived = response.value;
                var uviDisplay = $(
                    `<p class = "uviDisplay "> UV Index: <span class= "uviColor">${uviReceived}</span> </p>`
                );
                cityDisplayElem.append(uviDisplay);

                // sets uvi background
                if (uviReceived > 10) {
                    $(".uviColor").addClass("uviExtreme");
                } else if (uviReceived > 8 && uviReceived <= 10) {
                    $(".uviColor").addClass("uviVeryHigh");
                } else if (uviReceived > 5 && uviReceived < 8) {
                    $(".uviColor").addClass("uviHigh");
                } else if (uviReceived > 2 && uviReceived < 6) {
                    $(".uviColor").addClass("uviMedium");
                } else if (uviReceived >= 0 && uviReceived < 3) {
                    $(".uviColor").addClass("uviLow");
                }
            })
            .catch(function () {
                // sets an error if retrieving data failed
                errorElem.text(
                    "An error occured when retrieving the data. Please check your spelling and try again."
                );
            });
    }

    function getForecast(city) {
        let apiForecast = `${apiBase}forecast?q=${city}&units=imperial&APPID=${apiKey}`;
        // call to get forecast info
        $.ajax({
            url: apiForecast,
        })
            .then(function (response) {
                var dayList = response.list;
                $(".forecast").text("5 Day Forecast:");

                // this loops through the forecast list returned and displays it
                for (let i = 4; i <= dayList.length; i = i + 8) {
                    var forecastCardDisplay = $(
                        `<div class= "card forecastCard${i} mb-2"> </div>`
                    );
                    $(".forecast").append(forecastCardDisplay);
                    var dayInArray = dayList[i].dt;
                    var dateSet = new Date(
                        dayInArray * 1000
                    ).toLocaleDateString();
                    var forecastWeatherIcon = dayList[i].weather[0].icon;
                    var forecastTemp = Math.round(dayList[i].main.temp);
                    var forecastHum = dayList[i].main.humidity;

                    var dateDisplay = $(`<p> ${dateSet} </p>`);
                    var weatherIconDisplay = $(
                        `<div> <img src=" http://openweathermap.org/img/wn/${forecastWeatherIcon}.png"></img> </div> `
                    );
                    var temperatureDisplay = $(
                        `<p> Temperature: ${forecastTemp} °F </p>`
                    );
                    var humidityDisplay = $(
                        `<p> Humidity: ${forecastHum} </p>`
                    );

                    $(`.forecastCard${i}`).append(dateDisplay);
                    $(`.forecastCard${i}`).append(weatherIconDisplay);
                    $(`.forecastCard${i}`).append(temperatureDisplay);
                    $(`.forecastCard${i}`).append(humidityDisplay);
                }
            })
            .catch(function () {
                // sets an error if retrieving data failed
                errorElem.text(
                    "An error occured when contacting the weather server. Please check your spelling and try again."
                );
            });
    }
    // fires when a search history button is clicked
    searchHistoryElem.on("click", ".histBtn", pullNewCall);

    // calls api when search history button is clicked
    function pullNewCall(e) {
        e.preventDefault();
        cityDisplayElem.empty();
        forecastElem.empty();
        errorElem.empty();

        cityName = $(this).attr("data-cityName");
        recieveUserCity(cityName);
    }

    // checks names to stop duplicates
    function checkNames(city) {
        if (storageArray.includes(city)) {
            return;
        } else {
            storageArray.push(city);
            localStorage.setItem("city", JSON.stringify(storageArray));
            var searchHistoryDisplay = $(
                `<li class="histBtn list-group-item" data-cityName = ${city} > ${city} <button class= "btn btn-primary clearBtn ml-auto" data-cityName= ${city} > ${"Clear"} </button></li>`
            );
            searchHistoryElem.append(searchHistoryDisplay);
        }
    }
});

// sets search history from local storage when the document loads
function grabStorage() {
    var cityStorage = JSON.parse(localStorage.getItem("city")) || [];
    storageArray = cityStorage;
    cityStorage.forEach((element) => {
        var searchHistoryDisplay = $(
            `<li class="histBtn list-group-item" data-cityName = ${element} > ${element} <button class= "btn btn-primary clearBtn ml-auto" data-cityName = ${element}> ${"Clear"} </button> </li>`
        );
        searchHistoryElem.append(searchHistoryDisplay);
    });
}

searchHistoryElem.on("click", ".clearBtn", removeCity);

function removeCity(e) {
    console.log("clear event");
    e.preventDefault();
    e.stopPropagation();
    cityDisplayElem.empty();
    cityDisplayElem.removeClass("addBorder");
    forecastElem.empty();
    errorElem.empty();

    cityName = $(this).attr("data-cityName");
    console.log(cityName);
    const index = storageArray.indexOf(cityName);
    console.log(index);
    if (index > -1) {
        storageArray.splice(index, 1);
        localStorage.setItem("city", JSON.stringify(storageArray));
        $("li").filter(`:contains(${cityName})`).remove();
    }
}
