const apiKey = '676ad8e513de1266b5f536d6cb1e0eac';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// function getWeather(city) {
//     const url = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`;
// }

// // funtion to fetch from weather API
// fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => {
//         displayCurrentWeather(data);
//     })
//     .catch(error => {
//         console.error('Error fetching current weather:', error);
//         alert('Failed to fetch weather data. Please try again');
//     });



function getWeather(city) {
    const url = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            displayCurrentWeather(data, city);
        },
        error: function(error) {
            console.error('Error fetching current weather:', error);
        }
    });
}

function getCoords(city) {
    const url = `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // set the lat and lon from the data to a variable and make a second api call
            console.log(data)
            getForecast(data.coord.lat, data.coord.lon)
            //displayForecast(data);
        },
        error: function(error) {
            console.error('Error fetching forecast:', error);
            alert('Failed to retrieve forcast data.')
        }
    });
}

function getForecast(lat, lon) {
    const url = `${apiUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            displayForecast(data);
        },
        error: function(error) {
            console.error('Error fetching forecast:', error);
            alert('Failed to retrieve forecast data.');
        }
    });
}

function displayCurrentWeather(data, city) {
    const weatherHtml = `
        <h2 class="text-lg">${city} (${new Date().toLocaleDateString()}) <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png"></h2>
        <p>Temp: ${data.main.temp.toFixed(2)}°C</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity} %</p>
    `;
    $('#weather-results').html(weatherHtml);
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast-results');
    forecast.innerHTML = '<h2>5-Day Forecast</h2>';
    console.log(data);
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { 
            forecast.innerHTML += `<div>
                                      <p><strong>Date:</strong> ${new Date(item.dt * 1000).toDateString()}</p>
                                      <p>Temperature: ${item.main.temp} °C</p>
                                      <p>Weather: ${item.weather[0].description}</p>
                                      <p>Humidity: ${item.main.humidity}%</p>
                                      <p>Wind Speed: ${item.wind.speed} m/s</p>
                                    </div>`;
        }
    })
   // $('#forecast-results').html(forecast);
}

function addToHistory(city) {
    const historyItem = `<button class="history-btn text-blue-700 hover:text-blue-900">${city}</button>`;
    $('#search-history').prepend(historyItem);
    $('.history-btn').click(function() {
        getWeather($(this).text());
        getForecast($(this).text());
    });
    // implement local storage to save results
}
// document.getElementById('search-btn').addEventListener('click', function() {
//     const city = document.getElementById('city-input').value;
//     getWeather(city);
//     getForecast(city);
// });
$(document).ready(function() {
    $('#search-btn').click(function() {
        const city = $('#city-input').val().trim();
        if (city) {
            getWeather(city);
            getCoords(city);
            addToHistory(city);
        } else {
            alert('Please enter a city name');
        }
        
    });
});