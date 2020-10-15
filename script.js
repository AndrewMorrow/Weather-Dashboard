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
var storageArray = [];
var forecastStorageArray = [];

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
    cityDisplayElem.empty();
    forecastElem.empty();

    userCityCall = $("input").val();

    recieveUserCity(userCityCall);
});

function recieveUserCity(cityCall) {
    let apiUserCity = `${apiBase}weather?q=${cityCall}&units=imperial&APPID=${apiKey}`;

    $.ajax(apiUserCity, {
        success: function (data) {
            var weatherReceived = data;
            // console.log(weatherReceived);
            var dateGet = weatherReceived.dt;
            var currentDateSet = new Date(dateGet * 1000).toLocaleDateString();
            var cityNameReceived = weatherReceived.name;
            var weatherIconId = weatherReceived.weather[0].icon;
            var temperature = weatherReceived.main.temp;
            var humidity = weatherReceived.main.humidity;
            var windSpeed = weatherReceived.wind.speed;
            let latitude = weatherReceived.coord.lat;
            let longitude = weatherReceived.coord.lon;

            var cityNameHeader = $(
                `<h2> ${cityNameReceived} ${currentDateSet}<img src=" http://openweathermap.org/img/wn/${weatherIconId}.png"></img> </h2>`
            );
            var tempDisplay = $(`<p> Temperature: ${temperature} °F </p>`);
            var humDisplay = $(`<p> Humidity: ${humidity} % </p>`);
            var windSpeedDisplay = $(`<p> Wind Speed: ${windSpeed} MPH </p>`);
            cityDisplayElem.append(cityNameHeader);
            cityDisplayElem.append(tempDisplay);
            cityDisplayElem.append(humDisplay);
            cityDisplayElem.append(windSpeedDisplay);
            getUvi(latitude, longitude);
            getForecast(latitude, longitude);

            var cityCard = {
                cityName: cityNameReceived,
                dt: dateGet,
                icon: weatherIconId,
                temp: temperature,
                humidity: humidity,
                windSpeed: windSpeed,
                lat: latitude,
                lon: longitude,
            };

            storageArray.push(cityCard);
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

    $.ajax(apiUvi, {
        success: function (data) {
            var uviReceived = data.value;
            var uviDisplay = $(`<p> UV Index: ${uviReceived} </p>`);
            cityDisplayElem.append(uviDisplay);
            var target = storageArray.length - 1;
            // console.log(target);
            storageArray[target].uvi = uviReceived;
            // localStorage.setItem("cityCard", JSON.stringify(storageArray));
            // var searchHistoryDisplay = $(
            //     `<li class="histBtn list-group-item">${storageArray[target].cityName}</li>`
            // );
            // searchHistoryElem.append(searchHistoryDisplay);
            // localStorage.setItem("cityCard", uviReceived);
            // console.log(uviReceived);
            $("li").on("click", pullStorage);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

function getForecast(lat, long) {
    let apiForecast = `${apiBase}forecast?lat=${lat}&lon=${long}&units=imperial&APPID=${apiKey}`;

    $.ajax(apiForecast, {
        success: function (data) {
            // var forecastReceived = data;
            var dayList = data.list;
            // console.log(forecastReceived);
            var target = storageArray.length - 1;
            console.log(target);
            for (let i = 4; i <= dayList.length; i = i + 8) {
                var forecastCardDisplay = $(
                    `<div class= "card forecastCard${i} mb-2"> 5 Day Forecast: </div>`
                );

                $(".forecast").append(forecastCardDisplay);

                var dayInArray = dayList[i].dt;
                var dateSet = new Date(dayInArray * 1000).toLocaleDateString();
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
                var humidityDisplay = $(`<p> Humidity: ${forecastHum} </p>`);

                $(`.forecastCard${i}`).append(dateDisplay);
                $(`.forecastCard${i}`).append(weatherIconDisplay);
                $(`.forecastCard${i}`).append(temperatureDisplay);
                $(`.forecastCard${i}`).append(humidityDisplay);

                var existingStorage = JSON.parse(
                    localStorage.getItem("cityCard")
                );

                var forecastObj = (storageArray[target].forecast = [
                    {
                        dt: dayInArray,
                        icon: forecastWeatherIcon,
                        temp: forecastTemp,
                        humidity: forecastHum,
                    },
                ]);

                // existingStorage.push(forecastObj);
                console.log(forecastObj);

                // console.log(storageArray);
            }

            localStorage.setItem("cityCard", JSON.stringify(storageArray));
            var searchHistoryDisplay = $(
                `<li class="histBtn list-group-item">${storageArray[target].cityName}</li>`
            );
            searchHistoryElem.append(searchHistoryDisplay);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

function pullStorage(e) {
    e.preventDefault();
    cityDisplayElem.empty();
    forecastElem.empty();

    var cityList = JSON.parse(localStorage.getItem("cityCard"));
    // console.log(cityList);
    cityName = this.textContent;
    cityList.forEach(function (element) {
        if (cityName === element.cityName) {
            // console.log("match");

            var currentDateSet = new Date(
                element.dt * 1000
            ).toLocaleDateString();
            var cityNameHeader = $(
                `<h2> ${element.cityName} ${currentDateSet}<img src=" http://openweathermap.org/img/wn/${element.icon}.png"></img> </h2>`
            );
            var tempDisplay = $(`<p> Temperature: ${element.temp} °F </p>`);
            var humDisplay = $(`<p> Humidity: ${element.humidity} % </p>`);
            var windSpeedDisplay = $(
                `<p> Wind Speed: ${element.windSpeed} MPH </p>`
            );

            cityDisplayElem.append(cityNameHeader);
            cityDisplayElem.append(tempDisplay);
            cityDisplayElem.append(humDisplay);
            cityDisplayElem.append(windSpeedDisplay);
            var uviDisplay = $(`<p> UV Index: ${element.uvi} </p>`);
            cityDisplayElem.append(uviDisplay);
            // getForecast(element.lat, element.lon);
        }
    });
}

function storageForecast() {
    for (let i = 4; i <= dayList.length; i = i + 8) {
        var forecastCardDisplay = $(
            `<div class= "card forecastCard${i} mb-2"> 5 Day Forecast: </div>`
        );

        $(".forecast").append(forecastCardDisplay);

        var dayInArray = dayList[i].dt;
        var dateSet = new Date(dayInArray * 1000).toLocaleDateString();
        var forecastWeatherIcon = dayList[i].weather[0].icon;
        var forecastTemp = Math.round(dayList[i].main.temp);
        var forecastHum = dayList[i].main.humidity;

        var dateDisplay = $(`<p> ${dateSet} </p>`);
        var weatherIconDisplay = $(
            `<div> <img src=" http://openweathermap.org/img/wn/${forecastWeatherIcon}.png"></img> </div> `
        );
        var temperatureDisplay = $(`<p> Temperature: ${forecastTemp} °F </p>`);
        var humidityDisplay = $(`<p> Humidity: ${forecastHum} </p>`);

        $(`.forecastCard${i}`).append(dateDisplay);
        $(`.forecastCard${i}`).append(weatherIconDisplay);
        $(`.forecastCard${i}`).append(temperatureDisplay);
        $(`.forecastCard${i}`).append(humidityDisplay);
    }
}
