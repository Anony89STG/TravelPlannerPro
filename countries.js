// ===== COUNTRIES.JS - API de países (REST Countries) =====

// Función principal para obtener información de un país
async function fetchCountryInfo(countryName) {
    try {
        // Limpiar el nombre del país (quitar espacios extras, poner formato correcto)
        const query = countryName.trim().toLowerCase();
        
        // Llamada a la API de REST Countries
        const response = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
        
        if (!response.ok) {
            throw new Error('País no encontrado');
        }
        
        const data = await response.json();
        const country = data[0];
        
        // Extraer la información que necesitamos
        const countryInfo = {
            name: country.name.common,
            officialName: country.name.official,
            flag: country.flags.svg,
            flagAlt: country.flags.alt || `Bandera de ${country.name.common}`,
            capital: country.capital ? country.capital[0] : 'No disponible',
            population: country.population.toLocaleString(),
            region: country.region,
            subregion: country.subregion || 'No disponible',
            // Moneda: extraer la primera moneda disponible
            currency: country.currencies ? Object.values(country.currencies)[0].name : 'No disponible',
            currencyCode: country.currencies ? Object.keys(country.currencies)[0] : 'USD',
            currencySymbol: country.currencies ? Object.values(country.currencies)[0].symbol : '$',
            // Idioma: extraer el primer idioma
            language: country.languages ? Object.values(country.languages)[0] : 'No disponible',
            // Coordenadas (para el clima y atracciones)
            lat: country.latlng ? country.latlng[0] : null,
            lng: country.latlng ? country.latlng[1] : null
        };
        
        return countryInfo;
        
    } catch (error) {
        console.error('Error fetching country:', error);
        throw error;
    }
}

// Función para obtener la capital y coordenadas (para el clima)
async function getCountryCoordinates(countryName) {
    try {
        const countryInfo = await fetchCountryInfo(countryName);
        if (countryInfo.lat && countryInfo.lng) {
            return {
                lat: countryInfo.lat,
                lng: countryInfo.lng,
                capital: countryInfo.capital
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

// Función para obtener múltiples países (para búsqueda sugerida)
async function searchCountries(searchTerm) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.map(country => ({
            name: country.name.common,
            flag: country.flags.svg
        }));
    } catch (error) {
        return [];
    }
}