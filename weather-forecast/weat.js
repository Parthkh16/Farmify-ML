const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const feels_like = document.querySelector('.feels-like');
const city_name = document.querySelector('.city');
const country_name = document.querySelector('.country');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const forecast_container = document.querySelector('.forecast-container');
const details_grid = document.querySelector('.details-grid');

// API Key
const api_key = "4c4286de4f6a3794841e570fd8bc4a0b";

async function checkWeather(city) {
    // Get current weather data
    const current_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    const weather_data = await fetch(current_url).then(response => response.json());

    if (weather_data.cod === '404') {
        location_not_found.style.display = "flex";
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = "none";
        });
        console.log("Location not found");
        return;
    }

    // Show current weather data
    location_not_found.style.display = "none";
    document.getElementById('current-tab').style.display = "flex";
    
    // Update current weather display
    city_name.innerHTML = `${weather_data.name}`;
    country_name.innerHTML = `${weather_data.sys.country}`;
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}<sup>°C</sup>`;
    feels_like.innerHTML = `${Math.round(weather_data.main.feels_like - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;
    pressure.innerHTML = `${weather_data.main.pressure} hPa`;

    // Set weather icon based on weather condition
    setWeatherIcon(weather_img, weather_data.weather[0].main);
    
    // Get and display forecast data
    getForecastData(city);
    
    // Update detailed weather information
    updateWeatherDetails(weather_data);
    
    console.log("Current weather data:", weather_data);
}

async function getForecastData(city) {
    // Get 5-day forecast data
    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;
    const forecast_data = await fetch(forecast_url).then(response => response.json());
    
    if (forecast_data.cod !== '200') {
        console.log("Error fetching forecast data");
        return;
    }

    // Process and display forecast data (one forecast per day)
    const daily_forecasts = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    forecast_data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = days[date.getDay()];
        const dayKey = date.toISOString().split('T')[0];
        
        // Take only one forecast per day (at noon if possible)
        if (!daily_forecasts[dayKey] || date.getHours() === 12) {
            daily_forecasts[dayKey] = {
                day: day,
                temp: Math.round(item.main.temp - 273.15),
                description: item.weather[0].description,
                main: item.weather[0].main
            };
        }
    });
    
    // Get only the next 5 days
    const forecast_days = Object.values(daily_forecasts).slice(0, 5);
    
    // Update forecast HTML
    forecast_container.innerHTML = '';
    forecast_days.forEach(forecast => {
        const forecast_day = document.createElement('div');
        forecast_day.classList.add('forecast-day');
        
        forecast_day.innerHTML = `
            <p class="day">${forecast.day}</p>
            <img src="img/${getWeatherImageName(forecast.main)}" alt="Weather Icon" class="forecast-icon">
            <p class="forecast-temp">${forecast.temp}°C</p>
            <p class="forecast-desc">${forecast.description}</p>
        `;
        
        forecast_container.appendChild(forecast_day);
    });
    
    console.log("Forecast data:", forecast_data);
}

function updateWeatherDetails(weather_data) {
    // Additional weather details
    // Find the elements in the details grid
    const elements = Array.from(details_grid.querySelectorAll('.detail-value'));
    
    // Time conversions
    const sunrise = new Date(weather_data.sys.sunrise * 1000);
    const sunset = new Date(weather_data.sys.sunset * 1000);
    
    // Format times
    const sunriseTime = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Update UV Index (this is a placeholder as OpenWeatherMap Basic API doesn't include UV)
    elements[0].textContent = "3 (Moderate)";
    
    // Update Visibility
    elements[1].textContent = `${(weather_data.visibility / 1000).toFixed(1)} km`;
    
    // Update Cloud Cover
    elements[2].textContent = `${weather_data.clouds.all}%`;
    
    // Update Sunrise
    elements[3].textContent = sunriseTime;
    
    // Update Sunset
    elements[4].textContent = sunsetTime;
    
    // Update Moon Phase (placeholder as it's not available in the API)
    elements[5].textContent = getMoonPhase(new Date());
}

function getMoonPhase(date) {
    // Simple moon phase calculation (approximate)
    const synodic = 29.53058867; // Days in a lunar month
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Calculate approximate days since known new moon (Jan 6, 2000)
    const reference = new Date(2000, 0, 6).getTime();
    const current = new Date(year, month - 1, day).getTime();
    const daysSince = (current - reference) / (1000 * 60 * 60 * 24);
    
    // Calculate phase (0 to 1)
    const phase = (daysSince % synodic) / synodic;
    
    // Determine moon phase name
    if (phase < 0.025 || phase > 0.975) return "New Moon";
    if (phase < 0.25) return "Waxing Crescent";
    if (phase < 0.275) return "First Quarter";
    if (phase < 0.475) return "Waxing Gibbous";
    if (phase < 0.525) return "Full Moon";
    if (phase < 0.725) return "Waning Gibbous";
    if (phase < 0.775) return "Last Quarter";
    return "Waning Crescent";
}

function setWeatherIcon(img_element, weather_condition) {
    img_element.src = `img/${getWeatherImageName(weather_condition)}`;
}

function getWeatherImageName(weather_condition) {
    switch(weather_condition) {
        case 'Clouds':
            return "cloud.png";
        case 'Clear':
            return "clear-sky.png";
        case 'Rain':
            return "rain.png";
        case 'Drizzle':
            return "rain.png";
        case 'Haze':
            return "haze.png";
        case 'Lightning':
            return "lightning.png";
        case 'Snow':
            return "snow.png";
        case 'Storm':
            return "storm.png";
        case 'Thunderstorm':
            return "thunderstorm.png";
        case 'Mist':
        case 'Fog':
            return "mist.png";
        default:
            return "clear-sky.png";
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Allow search on Enter key press
inputBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    // Load default city when page loads
    checkWeather('New York');
});