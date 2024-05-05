const apiKey = '676ad8e513de1266b5f536d6cb1e0eac';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

$(document).ready(function() {
    $('#search-btn').click(function() {
        const city = $('#city-input').val();
        getWeather(city);
        addToHistory(city);
    });
});

function getWeather(city) {
    $.ajax({
        url: `${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            displayCurrentWeather(data, city);
            getForecast(city);
        },
        error: function(error) {
            console.error('Error fetching current weather:', error);
        }
    });
}

function getForecast(city) {
    $.ajax({
        url: `${apiUrl}forecast?q=${city}&units=metric&appid=${apiKey}`,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            displayForecast(data);
        },
        error: function(error) {
            console.error('Error fetching forecast:', error);
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
    $('#current-weather').html(weatherHtml);
}

function displayForecast(data) {
    let forecastHtml = '<h2 class="text-lg">5-Day Forecast:</h2>';
    data.list.filter((item, index) => index % 8 === 0).forEach((item) => {
        forecastHtml += `
            <div class="weather-card bg-gray-200 p-4 rounded">
                <h3>${new Date(item.dt_txt).toLocaleDateString()}</h3>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                <p>Temp: ${item.main.temp.toFixed(2)}°C</p>
                <p>Wind: ${item.wind.speed} MPH</p>
                <p>Humidity: ${item.main.humidity} %</p>
            </div>
        `;
    });
    $('#forecast-weather').html(forecastHtml);
}

function addToHistory(city) {
    const historyItem = `<button class="history-btn text-blue-700 hover:text-blue-900">${city}</button>`;
    $('#search-history').prepend(historyItem);
    $('.history-btn').click(function() {
        getWeather($(this).text());
    });
}
