// ===== STORAGE.JS - Toda la gestión de LocalStorage =====

// Claves para localStorage
const STORAGE_KEYS = {
    USER: 'travel_user',
    FAVORITE_DESTINOS: 'favorite_destinos',
    FAVORITE_ATRACCIONES: 'favorite_atracciones',
    HISTORY: 'travel_history',
    THEME: 'travel_theme'
};

// ===== 1. GESTIÓN DEL USUARIO =====
function saveUser(userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
}

function getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
}

function isUserRegistered() {
    return getUser() !== null;
}

// ===== 2. GESTIÓN DE DESTINOS FAVORITOS =====
function getFavoriteDestinos() {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_DESTINOS);
    return favorites ? JSON.parse(favorites) : [];
}

function addFavoriteDestino(pais) {
    let favorites = getFavoriteDestinos();
    // Verificar si ya existe
    if (!favorites.some(fav => fav.name === pais.name)) {
        favorites.push(pais);
        localStorage.setItem(STORAGE_KEYS.FAVORITE_DESTINOS, JSON.stringify(favorites));
    }
    return favorites;
}

function removeFavoriteDestino(countryName) {
    let favorites = getFavoriteDestinos();
    favorites = favorites.filter(fav => fav.name !== countryName);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_DESTINOS, JSON.stringify(favorites));
    return favorites;
}

function isFavoriteDestino(countryName) {
    const favorites = getFavoriteDestinos();
    return favorites.some(fav => fav.name === countryName);
}

// ===== 3. GESTIÓN DE ATRACCIONES FAVORITAS =====
function getFavoriteAtracciones() {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_ATRACCIONES);
    return favorites ? JSON.parse(favorites) : [];
}

function addFavoriteAtraccion(atraccion) {
    let favorites = getFavoriteAtracciones();
    if (!favorites.some(fav => fav.name === atraccion.name)) {
        favorites.push(atraccion);
        localStorage.setItem(STORAGE_KEYS.FAVORITE_ATRACCIONES, JSON.stringify(favorites));
    }
    return favorites;
}

function removeFavoriteAtraccion(atraccionName) {
    let favorites = getFavoriteAtracciones();
    favorites = favorites.filter(fav => fav.name !== atraccionName);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_ATRACCIONES, JSON.stringify(favorites));
    return favorites;
}

// ===== 4. GESTIÓN DEL HISTORIAL =====
function getHistory() {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
}

function addToHistory(countryName) {
    let history = getHistory();
    const now = new Date();
    const historyEntry = {
        country: countryName,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        timestamp: now.getTime()
    };
    history.unshift(historyEntry); // Agregar al inicio
    // Mantener solo los últimos 20 registros
    if (history.length > 20) history.pop();
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return history;
}

function clearHistory() {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
}

// ===== 5. GESTIÓN DEL TEMA =====
function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function applyTheme() {
    const theme = getTheme();
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    saveTheme(newTheme);
    applyTheme();
    return newTheme;
}