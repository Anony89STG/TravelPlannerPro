// ===== UI.JS - Funciones para actualizar la interfaz =====

// Mostrar/ocultar loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Mostrar mensaje de error
function showError(message) {
    const errorDiv = document.getElementById('searchError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Actualizar mensaje de bienvenida
function updateWelcomeMessage() {
    const user = getUser();
    const greetingDiv = document.getElementById('userGreeting');
    
    if (user) {
        greetingDiv.innerHTML = `
            <h2>✈️ ¡Bienvenido nuevamente, ${user.name}!</h2>
            <p>¿Listo para planificar tu próximo viaje?</p>
        `;
    } else {
        greetingDiv.innerHTML = `
            <h2>✨ Descubre tu próximo destino</h2>
            <p>Busca cualquier país y obtén toda la información para tu viaje</p>
        `;
    }
}

// Actualizar la información del país en la UI
function updateCountryUI(country) {
    const countrySection = document.getElementById('countryInfo');
    const countryDetails = document.getElementById('countryDetails');
    
    countryDetails.innerHTML = `
        <div class="country-info-grid">
            <div class="country-flag">
                <img src="${country.flag}" alt="${country.flagAlt}" style="width: 100px; border-radius: 8px;">
            </div>
            <div class="country-details">
                <p><strong>📛 Nombre:</strong> ${country.name}</p>
                <p><strong>🏛️ Capital:</strong> ${country.capital}</p>
                <p><strong>🌍 Región:</strong> ${country.region}</p>
                <p><strong>🗺️ Subregión:</strong> ${country.subregion}</p>
                <p><strong>👥 Población:</strong> ${country.population}</p>
                <p><strong>💵 Moneda:</strong> ${country.currency} (${country.currencyCode})</p>
                <p><strong>🗣️ Idioma:</strong> ${country.language}</p>
            </div>
        </div>
        <button id="favCountryBtn" class="btn-secondary" style="margin-top: 1rem;">
            ${isFavoriteDestino(country.name) ? '⭐ Favorito' : '☆ Agregar a favoritos'}
        </button>
    `;
    
    countrySection.style.display = 'block';
    
    // Agregar evento al botón de favoritos
    const favBtn = document.getElementById('favCountryBtn');
    if (favBtn) {
        favBtn.onclick = () => toggleFavoriteCountry(country);
    }
}

// Alternar país favorito
function toggleFavoriteCountry(country) {
    if (isFavoriteDestino(country.name)) {
        removeFavoriteDestino(country.name);
        showError(`❌ ${country.name} eliminado de favoritos`);
    } else {
        addFavoriteDestino({ name: country.name, flag: country.flag });
        showError(`✅ ${country.name} agregado a favoritos`);
    }
    updateCountryUI(country); // Actualizar el botón
    updateDashboard(); // Actualizar el contador
    displayFavorites(); // Actualizar la lista
}

// Actualizar UI del clima
function updateWeatherUI(weather) {
    const weatherSection = document.getElementById('weatherInfo');
    const weatherDetails = document.getElementById('weatherDetails');
    const icon = getWeatherIcon(weather.weatherDescription);
    
    weatherDetails.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem;">${icon}</div>
            <p><strong>📍 Ubicación:</strong> ${weather.location}</p>
            <p><strong>🌡️ Temperatura:</strong> ${weather.temperature}°C</p>
            <p><strong>💧 Humedad:</strong> ${weather.humidity}%</p>
            <p><strong>💨 Viento:</strong> ${weather.windspeed} km/h</p>
            <p><strong>☁️ Estado:</strong> ${weather.weatherDescription}</p>
        </div>
    `;
    
    weatherSection.style.display = 'block';
}

// Actualizar UI del conversor de moneda
async function updateCurrencyUI(countryCurrencyCode) {
    const currencySection = document.getElementById('currencyInfo');
    const toCurrencySelect = document.getElementById('toCurrency');
    
    // Asegurar mayúsculas
    const currencyCode = countryCurrencyCode.toUpperCase();
    
    console.log(`Configurando conversor con moneda: ${currencyCode}`);
    
    // Limpiar y agregar opciones al select DESTINO
    toCurrencySelect.innerHTML = '';
    
    // Monedas que SÍ funcionan con Frankfurter
    const workingCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'COP', 'MXN', 'BRL', 'ARS', 'CAD', 'AUD'];
    
    // Agregar la moneda del país si no está en la lista
    let currenciesToShow = [...workingCurrencies];
    if (!currenciesToShow.includes(currencyCode)) {
        currenciesToShow.unshift(currencyCode);
    }
    
    // Crear opciones
    currenciesToShow.forEach(code => {
        const option = document.createElement('option');
        option.value = code;
        
        // Nombres descriptivos
        const names = {
            'USD': '🇺🇸 Dólar (USD)',
            'EUR': '🇪🇺 Euro (EUR)',
            'GBP': '🇬🇧 Libra (GBP)',
            'JPY': '🇯🇵 Yen (JPY)',
            'COP': '🇨🇴 Peso Colombiano (COP)',
            'MXN': '🇲🇽 Peso Mexicano (MXN)',
            'BRL': '🇧🇷 Real (BRL)',
            'ARS': '🇦🇷 Peso Argentino (ARS)',
            'CAD': '🇨🇦 Dólar Canadiense (CAD)',
            'AUD': '🇦🇺 Dólar Australiano (AUD)'
        };
        
        option.textContent = names[code] || `${code}`;
        toCurrencySelect.appendChild(option);
    });
    
    // Seleccionar la moneda del país por defecto
    toCurrencySelect.value = currencyCode;
    
    // Mostrar sección
    currencySection.style.display = 'block';
    
    // Mensaje informativo
    const resultDiv = document.getElementById('conversionResult');
    resultDiv.innerHTML = `💡 Moneda local: ${currencyCode}`;
    resultDiv.style.color = '#6b7280';
}

// Realizar conversión
// ===== FUNCIÓN DE CONVERSIÓN PARA UI.JS =====

async function performConversion() {
    const amountInput = document.getElementById('amountInput');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const resultDiv = document.getElementById('conversionResult');
    
    const amount = amountInput.value;
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    
    console.log(`Convirtiendo: ${amount} ${fromCurrency} → ${toCurrency}`);
    
    // Validar cantidad
    if (!amount || amount <= 0) {
        resultDiv.innerHTML = '❌ Por favor ingresa una cantidad válida';
        resultDiv.style.color = '#ef4444';
        return;
    }
    
    // Mostrar loading
    resultDiv.innerHTML = '🔄 Convirtiendo...';
    resultDiv.style.color = '#3b82f6';
    
    // Realizar conversión
    const conversion = await convertCurrency(amount, fromCurrency, toCurrency);
    
    if (conversion.success) {
        const formatted = formatConversionResult(
            conversion.amount,
            conversion.from,
            conversion.result,
            conversion.to
        );
        resultDiv.innerHTML = `✅ ${formatted}`;
        resultDiv.style.color = '#10b981';
    } else {
        resultDiv.innerHTML = `❌ Error: ${conversion.error}. Intenta con otras monedas.`;
        resultDiv.style.color = '#ef4444';
    }
}

// Mostrar atracciones turísticas
function updateAttractionsUI(attractions, countryName) {
    const attractionsSection = document.getElementById('attractionsInfo');
    const attractionsList = document.getElementById('attractionsList');
    
    if (!attractions || attractions.length === 0) {
        attractionsList.innerHTML = '<p>No se encontraron atracciones turísticas para este destino.</p>';
        attractionsSection.style.display = 'block';
        return;
    }
    
    attractionsList.innerHTML = attractions.map(attr => `
        <div class="attraction-card">
            ${attr.image ? `<img src="${attr.image}" alt="${attr.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Atracción'">` : '<div style="height:150px; background:#ccc; display:flex; align-items:center; justify-content:center;">📸 Sin imagen</div>'}
            <div class="attraction-info">
                <h3>${attr.name}</h3>
                <span class="attraction-category">${attr.category}</span>
                <p>${attr.description}</p>
                <button class="fav-btn" onclick="toggleFavoriteAttraction('${attr.name.replace(/'/g, "\\'")}', '${countryName}')">
                    ${isAttractionFavorite(attr.name) ? '⭐ Favorita' : '☆ Guardar'}
                </button>
            </div>
        </div>
    `).join('');
    
    attractionsSection.style.display = 'block';
}

// Verificar si una atracción es favorita
function isAttractionFavorite(attractionName) {
    const favorites = getFavoriteAtracciones();
    return favorites.some(fav => fav.name === attractionName);
}

// Alternar atracción favorita
function toggleFavoriteAttraction(attractionName, countryName) {
    if (isAttractionFavorite(attractionName)) {
        removeFavoriteAtraccion(attractionName);
        showError(`❌ ${attractionName} eliminado de favoritos`);
    } else {
        addFavoriteAtraccion({ name: attractionName, country: countryName });
        showError(`✅ ${attractionName} agregado a favoritos`);
    }
    updateDashboard();
    displayFavoriteAttractions();
}

// Mostrar lista de destinos favoritos
function displayFavorites() {
    const favorites = getFavoriteDestinos();
    const favoritesContainer = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No tienes destinos favoritos aún. ¡Busca un país y guárdalo!</p>';
        return;
    }
    
    favoritesContainer.innerHTML = favorites.map(fav => `
        <div class="favorite-item">
            <img src="${fav.flag}" alt="${fav.name}" style="width: 30px; height: 20px; object-fit: cover;">
            <span>${fav.name}</span>
            <button class="delete-fav" onclick="removeFavoriteAndUpdate('${fav.name}')">Eliminar</button>
        </div>
    `).join('');
}

// Eliminar favorito y actualizar UI
function removeFavoriteAndUpdate(countryName) {
    removeFavoriteDestino(countryName);
    displayFavorites();
    updateDashboard();
    showError(`${countryName} eliminado de favoritos`);
}

// Mostrar atracciones favoritas
function displayFavoriteAttractions() {
    // Esta función se puede implementar en otra sección
    const favorites = getFavoriteAtracciones();
    console.log('Atracciones favoritas:', favorites);
}

// Actualizar el dashboard (contadores)
function updateDashboard() {
    const history = getHistory();
    const favoriteDestinos = getFavoriteDestinos();
    const favoriteAtracciones = getFavoriteAtracciones();
    
    // Cantidad de países consultados (historial)
    const uniqueCountries = [...new Set(history.map(h => h.country))];
    document.getElementById('totalCountries').textContent = uniqueCountries.length;
    
    document.getElementById('totalFavorites').textContent = favoriteDestinos.length;
    document.getElementById('totalAttractions').textContent = favoriteAtracciones.length;
}

// Mostrar historial de consultas
function displayHistory() {
    const history = getHistory();
    const historyContainer = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No hay historial de consultas aún. Busca países para verlos aquí.</p>';
        return;
    }
    
    historyContainer.innerHTML = history.map(entry => `
        <div class="history-item">
            <strong>${entry.country}</strong> - ${entry.date} a las ${entry.time}
        </div>
    `).join('');
}

// Actualizar toda la UI después de buscar un país
async function updateAllUIAfterSearch(countryName) {
    showLoader();
    
    try {
        // 1. Obtener información del país
        const countryInfo = await fetchCountryInfo(countryName);
        
        // 2. Actualizar UI del país
        updateCountryUI(countryInfo);
        
        // 3. Obtener y mostrar clima
        try {
            const weather = await getWeatherByCountry(countryName);
            updateWeatherUI(weather);
        } catch (weatherError) {
            console.error('Error de clima:', weatherError);
            document.getElementById('weatherInfo').style.display = 'none';
        }
        
        // 4. Actualizar conversor con la moneda del país
        updateCurrencyUI(countryInfo.currencyCode);
        
        // 5. Configurar evento del botón convertir
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) {
            convertBtn.onclick = performConversion;
        }
        
        // 6. Obtener y mostrar atracciones
        try {
            const attractions = await getAttractions(countryName, countryInfo.lat, countryInfo.lng);
            updateAttractionsUI(attractions, countryName);
        } catch (attractionsError) {
            console.error('Error de atracciones:', attractionsError);
            document.getElementById('attractionsInfo').style.display = 'none';
        }
        
        // 7. Guardar en historial
        addToHistory(countryName);
        displayHistory();
        updateDashboard();
        
    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error('Error completo:', error);
    } finally {
        hideLoader();
    }
}