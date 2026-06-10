// ===== APP.JS - Lógica principal de la aplicación =====

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Aplicar tema guardado
    applyTheme();
    
    // 2. Verificar si el usuario ya está registrado
    if (!isUserRegistered()) {
        showRegisterModal();
    } else {
        updateWelcomeMessage();
        displayFavorites();
        displayHistory();
        updateDashboard();
        displayFavoriteAttractions();
    }
    
    // 3. Configurar el botón de búsqueda
    const searchBtn = document.getElementById('searchBtn');
    const countryInput = document.getElementById('countryInput');
    
    searchBtn.addEventListener('click', () => {
        const countryName = countryInput.value.trim();
        if (countryName === '') {
            showError('Por favor ingresa un nombre de país');
            return;
        }
        updateAllUIAfterSearch(countryName);
    });
    
    // Permitir buscar con Enter
    countryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const countryName = countryInput.value.trim();
            if (countryName !== '') {
                updateAllUIAfterSearch(countryName);
            }
        }
    });
    
    // 4. Configurar el botón de tema oscuro
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const newTheme = toggleTheme();
        themeToggle.textContent = newTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });
    
    // Actualizar texto del botón según el tema actual
    if (getTheme() === 'dark') {
        themeToggle.textContent = '☀️ Modo Claro';
    } else {
        themeToggle.textContent = '🌙 Modo Oscuro';
    }
    
});

// Mostrar modal de registro
function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    const form = document.getElementById('registerForm');
    
    modal.style.display = 'flex';
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const country = document.getElementById('userCountry').value.trim();
        
        if (name === '' || email === '' || country === '') {
            alert('Por favor completa todos los campos');
            return;
        }
        
        const userData = {
            name: name,
            email: email,
            country: country,
            registeredAt: new Date().toISOString()
        };
        
        saveUser(userData);
        modal.style.display = 'none';
        updateWelcomeMessage();
        showError(`✨ ¡Bienvenido ${name}! ¡Comienza a planificar tus viajes!`);
    });
}

// Funciones globales para usar desde HTML (onclick)
window.toggleFavoriteAttraction = toggleFavoriteAttraction;
window.removeFavoriteAndUpdate = removeFavoriteAndUpdate;