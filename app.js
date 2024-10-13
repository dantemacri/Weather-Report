function getWeather(city) {
    // Primero obtenemos las coordenadas de la ciudad desde la API de geocodificación de Open Meteo
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(locationData => {
            if (!locationData.results || locationData.results.length === 0) {
                throw new Error('Ciudad no encontrada');
            }

            const { latitude, longitude } = locationData.results[0];

            // Ahora hacemos la petición a la API de Open Meteo con las coordenadas obtenidas
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

            return fetch(weatherUrl);
        })
        .then(response => response.json())
        .then(data => {
            const weatherDiv = document.getElementById('weather-info');
            const temp = data.current_weather.temperature;
            const windspeed = data.current_weather.windspeed;

            weatherDiv.innerHTML = `
                <h2>${city}</h2>
                <p>Temperatura: ${temp}°C</p>
                <p>Velocidad del viento: ${windspeed} km/h</p>
            `;
        })
        .catch(error => {
            const weatherDiv = document.getElementById('weather-info');
            weatherDiv.innerHTML = `<p>Error obteniendo los datos: ${error.message}</p>`;
            console.error('Error obteniendo los datos:', error);
        });
}

function searchWeather() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    } else {
        alert('Por favor, ingresá una ciudad');
    }
}

window.onload = () => getWeather('Buenos Aires'); // Para cargar un pronóstico inicial