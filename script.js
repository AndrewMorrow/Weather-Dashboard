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

// if ("geolocation" in navigator) {
//     navigator.geolocation.getCurrentPosition(setLocationGeo);
// }

// this sets the users location if they allow it in the browser
// function setLocationGeo(position) {
//     let latitude = position.coords.latitude;
//     let longitude = position.coords.longitude;
//     cityDisplayElem.empty();
//     forecastElem.empty();
//     var target = storageArray.length - 1;

//     // takes lat and long and passes to this function
//     let apiGeo = `${apiBase}weather?lat=${latitude}&lon=${longitude}&units=imperial&APPID=${apiKey}`;

//     $.ajax(apiGeo, {
//         success: function (data) {
//             var weatherReceived = data;
//             var cityId = weatherReceived.id;
//             var cityNameReceived = weatherReceived.name;
//             var weatherIconId = weatherReceived.weather[0].icon;
//             var temperature = Math.round(weatherReceived.main.temp);
//             var humidity = weatherReceived.main.humidity;
//             var windSpeed = weatherReceived.wind.speed;
//             var dateGet = weatherReceived.dt;
//             var currentDateSet = new Date(dateGet * 1000).toLocaleDateString();

//             var cityNameHeader = $(
//                 `<h2> ${cityNameReceived} ${currentDateSet}<img src=" http://openweathermap.org/img/wn/${weatherIconId}.png"></img> </h2>`
//             );
//             var tempDisplay = $(`<p> Temperature: ${temperature} °F </p>`);
//             var humDisplay = $(`<p> Humidity: ${humidity} % </p>`);
//             var windSpeedDisplay = $(`<p> Wind Speed: ${windSpeed} MPH </p>`);

//             var cityCard = {
//                 cityName: cityNameReceived,
//                 dt: dateGet,
//                 id: cityId,
//                 icon: weatherIconId,
//                 temp: temperature,
//                 humidity: humidity,
//                 windSpeed: windSpeed,
//                 lat: latitude,
//                 lon: longitude,
//                 forecast: [],
//             };

//             storageArray.push(cityCard);
//             cityDisplayElem.append(cityNameHeader);
//             cityDisplayElem.append(tempDisplay);
//             cityDisplayElem.append(humDisplay);
//             cityDisplayElem.append(windSpeedDisplay);
//             getUvi(latitude, longitude);
//             getForecast(latitude, longitude, dateGet);
//         },
//         error: function () {
//             $(errorElem).text("An Error occured while retrieving data");
//         },
//     });
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
            var cityId = weatherReceived.id;
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

            var cityCard = {
                cityName: cityNameReceived,
                dt: dateGet,
                id: cityId,
                icon: weatherIconId,
                temp: temperature,
                humidity: humidity,
                windSpeed: windSpeed,
                lat: latitude,
                lon: longitude,
                forecast: [],
            };
            storageArray.push(cityCard);

            getUvi(latitude, longitude);

            getForecast(latitude, longitude, dateGet);
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
            storageArray[target].uvi = uviReceived;
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

function getForecast(lat, long, time) {
    let apiForecast = `${apiBase}forecast?lat=${lat}&lon=${long}&units=imperial&APPID=${apiKey}`;
    // console.log(time);
    $.ajax(apiForecast, {
        success: function (data) {
            var timeStamp = new Date(time * 1000).toLocaleString();
            var dayList = data.list;
            var target = storageArray.length - 1;
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

                var forecastObj = {
                    dt: dayInArray,
                    icon: forecastWeatherIcon,
                    temp: forecastTemp,
                    humidity: forecastHum,
                };

                storageArray[target].forecast.push(forecastObj);
            }

            localStorage.setItem("cityCard", JSON.stringify(storageArray));
            var searchHistoryDisplay = $(
                `<li class="histBtn list-group-item search${target}">${storageArray[target].cityName} ${timeStamp}</li>`
            );
            searchHistoryElem.append(searchHistoryDisplay);

            $(`.search${target}`).on("click", pullStorage);
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

    var cityStorage = JSON.parse(localStorage.getItem("cityCard"));
    cityName = this.textContent;
    cityStorage.forEach(function (element) {
        if (cityName === element.cityName) {
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

            element.forecast.forEach(function (item) {
                var dateSet = new Date(item.dt * 1000).toLocaleDateString();
                var dateDisplay = $(`<p> ${dateSet} </p>`);
                var weatherIconDisplay = $(
                    `<div> <img src=" http://openweathermap.org/img/wn/${item.icon}.png"></img> </div> `
                );
                var temperatureDisplay = $(
                    `<p> Temperature: ${item.temp} °F </p>`
                );
                var humidityDisplay = $(`<p> Humidity: ${item.humidity} </p>`);
                var forecastCardDisplay = $(
                    `<div class= "card forecastCard${item.dt} mb-2"> 5 Day Forecast: </div>`
                );
                $(`.forecast`).append(forecastCardDisplay);
                $(`.forecastCard${item.dt}`).append(dateDisplay);
                $(`.forecastCard${item.dt}`).append(weatherIconDisplay);
                $(`.forecastCard${item.dt}`).append(temperatureDisplay);
                $(`.forecastCard${item.dt}`).append(humidityDisplay);
            });
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
