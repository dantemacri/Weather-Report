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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

            return fetch(weatherUrl);
        })
        .then(response => response.json())
        .then(data => {
            const weatherDiv = document.getElementById('weather-info');
            const temp = data.current_weather.temperature;
            const windspeed = data.current_weather.windspeed;
            const currentDate = new Date(); // Obtener la fecha y hora actual
            const currentHour = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Mostramos el clima actual
            weatherDiv.innerHTML = `
             <div class="card">
                <div class="containerClima">
                    <div class="cloud front">
                     <span class="left-front"></span>
                     <span class="right-front"></span>
                    </div>
                  <span class="sun sunshine"></span>
                  <span class="sun"></span>
                    <div class="cloud back">
              <span class="left-back"></span>
              <span class="right-back"></span>
                    </div>
            </div>
            
          <div class="card-header">
            <h2>${city}<br>${currentHour}</h2>
            <p>Windspeed: ${windspeed} km/h</p>
            <span style="font-size: 30px; color: black;">${temp}°</span>
          </div>
            `;

            // Ahora añadimos el pronóstico de la semana desde hoy
            const forecastDiv = document.getElementById('forecast-week');
            let forecastHTML = '<h3>Pronóstico semanal:</h3>';
            const days = data.daily.time; // Fechas
            const maxTemps = data.daily.temperature_2m_max; // Temperatura máxima
            const minTemps = data.daily.temperature_2m_min; // Temperatura mínima
            const precip = data.daily.precipitation_sum; // Precipitación

            const today = new Date(); // Fecha actual

            // Solo mostrar los próximos 7 días, comenzando desde hoy
            let daysShown = 0;
            const numberOfDaysToShow = 7;
            const usedDates = new Set(); // Usaremos un set para evitar fechas repetidas
            for (let i = 0; i < days.length && daysShown < numberOfDaysToShow; i++) {
                const forecastDate = new Date(days[i]);

                // Solo mostrar días a partir de hoy y evitar días repetidos
                if (forecastDate >= today && !usedDates.has(forecastDate.getTime())) {
                    usedDates.add(forecastDate.getTime()); // Guardar la fecha para evitar repetición

                    const formattedDate = formatDate(forecastDate);
                    const dayOfWeek = getDayOfWeek(forecastDate);

                    forecastHTML += `
                        <div class="day">
                            <h4>${dayOfWeek}, ${formattedDate}</h4>
                            <p>Máxima: ${maxTemps[i]}°C</p>
                            <p>Mínima: ${minTemps[i]}°C</p>
                            <p>Precipitación: ${precip[i]} mm</p>
                        </div>
                    `;

                    daysShown++; // Contar los días mostrados
                }
            }

            forecastDiv.innerHTML = forecastHTML;
        })
        .catch(error => {
            const weatherDiv = document.getElementById('weather-info');
            weatherDiv.innerHTML = `<p>Error obteniendo los datos: ${error.message}</p>`;
            console.error('Error obteniendo los datos:', error);
        });
}

// Función para formatear la fecha en día/mes/año
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función para obtener el día de la semana
function getDayOfWeek(date) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
}

function searchWeather() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    } else {
        alert('Por favor, ingresá una ciudad');
    }
}

function mostrarTexto() {
    // Obtener el valor del input
    var inputText = document.getElementById('city-input').value;
    
    // Colocar el valor dentro del span
    document.getElementById('outputText').textContent = inputText;
}

window.onload = () => getWeather('Buenos Aires'); // Para cargar un pronóstico inicial

// Iniciar búsqueda al precionar lupa o ingresar Enter
const searchIcon = document.querySelector('.search__icon');
searchIcon.addEventListener('click', searchWeather);

document.getElementById('city-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});
