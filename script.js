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

// on click event for the search button
searchButtonElem.on("click", (e) => {
    e.preventDefault();
    cityDisplayElem.empty();
    forecastElem.empty();
    errorElem.empty();

    userCityCall = $("input").val();

    recieveUserCity(userCityCall);
});

// takes user input and calls api
function recieveUserCity(cityCall) {
    let apiUserCity = `${apiBase}weather?q=${cityCall}&units=imperial&APPID=${apiKey}`;
    cityDisplayElem.empty();
    forecastElem.empty();
    errorElem.empty();
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
            cityDisplayElem.addClass("addBorder");

            // checks items in the array to stop duplicates
            // storageArray.filter(function (item) {
            //     // fires is city name and date match
            //     if ((cityId && dateGet) === (item.id && item.dt)) {
            //         console.log(item);
            //         cityDisplayElem.removeClass("addBorder");
            //         cityDisplayElem.empty();
            //         forecastElem.empty();
            //         errorElem.empty();
            //         console.log("if city and id");
            //         errorElem.text(
            //             "This City and time is already in your search history. The weather will only update every 10 minutes."
            //         );
            //     } else {
            // console.log(item);
            // console.log("else statement");
            // card object for storage
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
                uvi: 0,
                forecast: [],
            };
            storageArray.push(cityCard);
            getUvi(latitude, longitude);

            getForecast(latitude, longitude, dateGet);
            // }
            // });
            // fires is storageArray is empty
            // if (storageArray.length === 0) {
            //     console.log("empty statement");
            //     // card object for storage
            //     var cityCard = {
            //         cityName: cityNameReceived,
            //         dt: dateGet,
            //         id: cityId,
            //         icon: weatherIconId,
            //         temp: temperature,
            //         humidity: humidity,
            //         windSpeed: windSpeed,
            //         lat: latitude,
            //         lon: longitude,
            //         uvi: 0,
            //         forecast: [],
            //     };
            //     storageArray.push(cityCard);
            //     getUvi(latitude, longitude);

            //     getForecast(latitude, longitude, dateGet);
            // }
        },
        error: function () {
            $(errorElem).text(
                "An Error occured while retrieving data. Please enter the full city name and the full state name."
            );
        },
    });
}

// this calls api for uvi and appends it
function getUvi(lat, long) {
    let apiUvi = `${apiBase}uvi?lat=${lat}&lon=${long}&units=imperial&APPID=${apiKey}`;
    // console.log("uvi firing");
    $.ajax(apiUvi, {
        success: function (data) {
            var uviReceived = data.value;
            var uviDisplay = $(
                `<p class = "uviDisplay "> UV Index: <span class= "uviColor">${uviReceived}</span> </p>`
            );
            cityDisplayElem.append(uviDisplay);
            var target = storageArray.length - 1;
            storageArray[target].uvi = uviReceived;
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
            // console.log(storageArray);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

// calls api for forecast and then displays it
function getForecast(lat, long, time) {
    // console.log("forecast firing");
    let apiForecast = `${apiBase}forecast?lat=${lat}&lon=${long}&units=imperial&APPID=${apiKey}`;
    // console.log(time);
    $.ajax(apiForecast, {
        success: function (data) {
            var timeStamp = new Date(time * 1000).toLocaleString();
            var dayList = data.list;
            // target last item in the array
            var target = storageArray.length - 1;
            $(".forecast").text("5 Day Forecast:");
            for (let i = 4; i <= dayList.length; i = i + 8) {
                var forecastCardDisplay = $(
                    `<div class= "card forecastCard${i} mb-2"> </div>`
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
                // forecast obj
                var forecastObj = {
                    dt: dayInArray,
                    icon: forecastWeatherIcon,
                    temp: forecastTemp,
                    humidity: forecastHum,
                };
                // pushes forecast obj to the last object in array with the forecast key
                storageArray[target].forecast.push(forecastObj);
            }
            var cityTarget = storageArray[target].cityName;
            var dataValue = cityTarget.split(" ").join("");

            localStorage.setItem("cityCard", JSON.stringify(storageArray));
            var searchHistoryDisplay = $(
                `<li class="histBtn list-group-item search${target}" data-cityName = ${dataValue} >${storageArray[target].cityName} ${timeStamp}</li>`
            );

            searchHistoryElem.append(searchHistoryDisplay);
            // targets li search history buttons with a click event
            $(`.search${target}`).on("click", pullStorage);
        },
        error: function () {
            $(errorElem).text("An Error occured while retrieving data");
        },
    });
}

// this fires when the search history buttons are clicked
function pullStorage(e) {
    e.preventDefault();
    // console.log("pull storage firing");
    cityDisplayElem.empty();
    forecastElem.empty();
    errorElem.empty();

    var cityStorage = JSON.parse(localStorage.getItem("cityCard"));
    // console.log(cityStorage);
    cityName = $(this).attr("data-cityName");

    cityStorage.forEach(function (element) {
        // checks storage and matches clicked name to data attribute
        if (cityName === element.cityName.split(" ").join("")) {
            cityDisplayElem.empty();
            // console.log(element);
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
            // console.log(element.uvi);
            var uviDisplay = $(
                `<p class = "uviDisplay">  UV Index: <span class= "uviColor"> ${element.uvi} </span> </p>`
            );
            cityDisplayElem.append(uviDisplay);
            // sets uvi background
            if (element.uvi > 10) {
                $(".uviColor").addClass("uviExtreme");
            } else if (element.uvi > 8 && element.uvi <= 10) {
                $(".uviColor").addClass("uviVeryHigh");
            } else if (element.uvi > 5 && element.uvi < 8) {
                $(".uviColor").addClass("uviHigh");
            } else if (element.uvi > 2 && element.uvi < 6) {
                $(".uviColor").addClass("uviMedium");
            } else if (element.uvi >= 0 && element.uvi < 3) {
                $(".uviColor").addClass("uviLow");
            }
            $(".forecast").text("5 Day Forecast:");
            // pulls each forecast element from the array
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
                    `<div class= "card forecastCard${item.dt} mb-2"> </div>`
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
