// ===== WEATHER.JS - API del clima (Open-Meteo) =====

// Función para obtener el clima usando coordenadas
async function fetchWeather(lat, lon) {
    try {
        // Open-Meteo API - Current weather
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('No se pudo obtener el clima');
        }
        
        const data = await response.json();
        
        if (!data.current_weather) {
            throw new Error('Datos del clima no disponibles');
        }
        
        // Procesar la información del clima
        const weather = {
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            windDirection: data.current_weather.winddirection || 'N/A',
            // Determinar el estado del clima basado en la temperatura y códigos
            weatherCode: data.current_weather.weathercode,
            weatherDescription: getWeatherDescription(data.current_weather.weathercode),
            // Humedad (viene en hourly, tomamos la primera hora)
            humidity: data.hourly ? data.hourly.relativehumidity_2m[0] : 'No disponible'
        };
        
        return weather;
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Función para traducir los códigos de clima de Open-Meteo
function getWeatherDescription(code) {
    // Códigos de Open-Meteo: https://open-meteo.com/en/docs
    const weatherCodes = {
        0: 'Despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla con escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna intensa',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        71: 'Nieve ligera',
        73: 'Nieve moderada',
        75: 'Nieve intensa',
        80: 'Chubascos ligeros',
        81: 'Chubascos moderados',
        82: 'Chubascos violentos',
        95: 'Tormenta',
        96: 'Tormenta con granizo ligero',
        99: 'Tormenta con granizo intenso'
    };
    
    return weatherCodes[code] || 'Condición variable';
}

// Función para obtener el clima de un país usando su nombre
async function getWeatherByCountry(countryName) {
    try {
        // Primero obtenemos las coordenadas del país
        const coordinates = await getCountryCoordinates(countryName);
        
        if (!coordinates || !coordinates.lat || !coordinates.lng) {
            throw new Error('No se pudieron obtener las coordenadas del país');
        }
        
        // Luego obtenemos el clima con esas coordenadas
        const weather = await fetchWeather(coordinates.lat, coordinates.lng);
        
        return {
            ...weather,
            location: coordinates.capital || countryName
        };
        
    } catch (error) {
        console.error('Error getting weather by country:', error);
        throw error;
    }
}

// Función para obtener ícono del clima (emoji)
function getWeatherIcon(description) {
    const icons = {
        'Despejado': '☀️',
        'Mayormente despejado': '🌤️',
        'Parcialmente nublado': '⛅',
        'Nublado': '☁️',
        'Niebla': '🌫️',
        'Lluvia': '🌧️',
        'Nieve': '❄️',
        'Tormenta': '⛈️'
    };
    
    for (let [key, icon] of Object.entries(icons)) {
        if (description.includes(key)) return icon;
    }
    return '🌡️';
}