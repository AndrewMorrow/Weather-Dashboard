const searchFieldElem = $(".search-bar");
const searchHistoryElem = $(".search-history");
const cityDisplayElem = $(".city-display");
const forecastElem = $(".forecast");
const errorElem = $(".error-notification");
const searchButtonElem = $(".search-button");
const apiKey = `352f5b8e182609abba7014500a96eea5`;
var weatherIcon;
var temperature;
var humidity;
var windSpeed;
var userCityName;
var apiBase = `http://api.openweathermap.org/data/2.5/`;
var date = Date();

// console.log(date);

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setLocationGeo);
}

// this sets the users location if they allow it in the browser
function setLocationGeo(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // takes lat and long and passes to this function
    let apiGeo = `${apiBase}weather?lat=${latitude}&lon=${longitude}&units=imperial&APPID=${apiKey}`;

    $.ajax(apiGeo, {
        success: function (data) {
            var weatherReceived = data;
            // console.log(weatherReceived);
            cityNameReceived = weatherReceived.name;
            weatherIconId = weatherReceived.weather[0].icon;
            temperature = Math.round(weatherReceived.main.temp);
            humidity = weatherReceived.main.humidity;
            windSpeed = weatherReceived.wind.speed;

            var cityNameHeader = $(
                `<h2> ${cityNameReceived} <img src=" http://openweathermap.org/img/wn/${weatherIconId}.png"></img></h2>`
            );
            var tempDisplay = $(`<p> Temperature: ${temperature} °F </p>`);
            var humDisplay = $(`<p> Humidity: ${humidity} % </p>`);
            var windSpeedDisplay = $(`<p> Wind Speed: ${windSpeed} MPH </p>`);
            cityDisplayElem.append(cityNameHeader);
            cityDisplayElem.append(tempDisplay);
            cityDisplayElem.append(humDisplay);
            cityDisplayElem.append(windSpeedDisplay);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });

    getUvi(latitude, longitude);
    getForecast(latitude, longitude);
}

// // recieves weather from api with users browser geolocation
// function recieveWeatherGeo(latitude, longitude) {
//     // let api = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID={352f5b8e182609abba7014500a96eea5}`;

// }

searchButtonElem.on("click", (e) => {
    e.preventDefault();
    userCityCall = $("input").val();

    recieveUserCity(userCityCall);
});

function recieveUserCity(cityCall) {
    let apiUserCity = `${apiBase}weather?q=${cityCall}&units=imperial&APPID=${apiKey}`;

    $.ajax(apiUserCity, {
        success: function (data) {
            var weatherReceived = data;
            // console.log(weatherReceived);
            cityNameReceived = weatherReceived.name;
            weatherIconId = weatherReceived.weather[0].icon;
            temperature = weatherReceived.main.temp;
            humidity = weatherReceived.main.humidity;
            windSpeed = weatherReceived.wind.speed;
            var savedCities = localStorage.setItem("City", cityCall);
            let latitude = weatherReceived.coord.lat;
            let longitude = weatherReceived.coord.lon;

            var cityNameHeader = $(
                `<h2> ${cityNameReceived} <img src=" http://openweathermap.org/img/wn/${weatherIconId}.png"></img> </h2>`
            );
            var tempDisplay = $(`<p> Temperature: ${temperature} °F </p>`);
            var humDisplay = $(`<p> Humidity: ${humidity} % </p>`);
            var windSpeedDisplay = $(`<p> Wind Speed: ${windSpeed} MPH </p>`);
            cityDisplayElem.append(cityNameHeader);
            cityDisplayElem.append(tempDisplay);
            cityDisplayElem.append(humDisplay);
            cityDisplayElem.append(windSpeedDisplay);
            getUvi(latitude, longitude);
        },
        error: function () {
            $(errorElem).text(
                "An Error occured while retrieving data. Please enter the full city name and the full state name."
            );
        },
    });
}

function getUvi(lat, long) {
    let apiUvi = `${apiBase}uvi?lat=${lat}&lon=${long}&units=imperial&APPID=${apiKey}`;
    console.log(lat);
    console.log(long);
    $.ajax(apiUvi, {
        success: function (data) {
            var uviReceived = data.value;
            var uviDisplay = $(`<p> UV Index: ${uviReceived} </p>`);
            cityDisplayElem.append(uviDisplay);
            // console.log(uviReceived);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

function getForecast(lat, long) {
    let apiForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&cnt=5&units=imperial&APPID=${apiKey}`;

    // console.log(lat);
    // console.log(long);

    $.ajax(apiForecast, {
        success: function (data) {
            var forecastReceived = data.value;
            console.log(forecastReceived);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}
