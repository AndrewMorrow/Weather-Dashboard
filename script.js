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

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setLocationGeo);
}

// this sets the users location if they allow it in the browser
function setLocationGeo(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // takes lat and long and passes to this function
    let apiGeo = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${apiKey}`;

    $.ajax(apiGeo, {
        success: function (data) {
            var weatherReceived = data;
            console.log(weatherReceived);
            cityNameReceived = weatherReceived.name;
            weatherIconId = weatherReceived.weather[0].icon;
            temperature = weatherReceived.main.temp;
            humidity = weatherReceived.main.humidity;
            windSpeed = weatherReceived.wind.speed;

            cityDisplayElem.$(`"<p> ${cityNameReceived} </p> "`).append();
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

// // recieves weather from api with users browser geolocation
// function recieveWeatherGeo(latitude, longitude) {
//     // let api = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID={352f5b8e182609abba7014500a96eea5}`;

// }

searchButtonElem.on("click", (e) => {
    e.preventDefault();
    userCityName = $("input").val().split(",")[0].trim();
    // userCityState = $("input").val().split(",")[1].trim();

    var savedCities = localStorage.setItem("City", userCityName);
    recieveUserCity(userCityName);
});

function recieveUserCity(cityName) {
    let apiUserCity = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}`;

    $.ajax(apiUserCity, {
        success: function (data) {
            var weatherReceived = data;
            console.log(weatherReceived);
            weatherIconId = weatherReceived.weather[0].icon;
            temperature = weatherReceived.main.temp;
            humidity = weatherReceived.main.humidity;
            windSpeed = weatherReceived.wind.speed;
        },
        error: function () {
            $(errorElem).text(
                "An Error occured while retrieving data. Please enter the full city name and the full state name."
            );
        },
    });
}
