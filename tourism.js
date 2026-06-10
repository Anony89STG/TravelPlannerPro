// ===== TOURISM.JS - Atracciones turísticas (OpenTripMap API) =====

// NOTA: Necesitas registrarte en https://opentripmap.io/ para obtener una API key
// Por ahora usaremos datos de ejemplo, pero puedes reemplazar con tu API key

const OPENTRIPMAP_API_KEY = 'TU_API_KEY_AQUI'; // ¡Regístrate gratis en opentripmap.io!

// Datos de ejemplo por si la API no está disponible
const FALLBACK_ATTRACTIONS = {
    'Francia': [
        { name: 'Torre Eiffel', category: 'monumento', description: 'Icono mundial de París' },
        { name: 'Museo del Louvre', category: 'museo', description: 'El museo más visitado del mundo' }
    ],
    'Japón': [
        { name: 'Monte Fuji', category: 'naturaleza', description: 'Montaña sagrada' },
        { name: 'Templo Kinkaku-ji', category: 'templo', description: 'Pabellón Dorado' }
    ]
};

// Función principal para obtener atracciones
async function getAttractions(countryName, lat, lng) {
    try {
        // Si tenemos API key, consultamos la API real
        if (OPENTRIPMAP_API_KEY && OPENTRIPMAP_API_KEY !== 'TU_API_KEY_AQUI') {
            return await fetchRealAttractions(lat, lng);
        } else {
            // Si no, usamos datos de ejemplo
            console.warn('Usando datos de ejemplo - Registra una API key de OpenTripMap');
            return getFallbackAttractions(countryName);
        }
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return getFallbackAttractions(countryName);
    }
}

// Función para consultar la API real de OpenTripMap
async function fetchRealAttractions(lat, lng, radius = 5000) {
    try {
        // Buscar lugares turísticos en un radio de 5km
        const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&format=json&apikey=${OPENTRIPMAP_API_KEY}&limit=10`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('API de atracciones no disponible');
        }
        
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
            throw new Error('No se encontraron atracciones');
        }
        
        // Procesar y formatear las atracciones
        const attractions = [];
        
        for (let feature of data.features.slice(0, 6)) { // Máximo 6 atracciones
            const props = feature.properties;
            
            // Intentar obtener una imagen (usamos placeholder si no hay)
            let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';
            
            attractions.push({
                name: props.name || 'Sin nombre',
                category: props.kinds ? props.kinds.split(',')[0] : 'turístico',
                description: props.name ? `Visita ${props.name} en esta increíble ubicación` : 'Lugar de interés turístico',
                lat: feature.geometry.coordinates[1],
                lon: feature.geometry.coordinates[0],
                image: imageUrl,
                wikipedia: props.wikipedia || null
            });
        }
        
        return attractions;
        
    } catch (error) {
        console.error('Error fetching real attractions:', error);
        throw error;
    }
}

// Datos de ejemplo para más países
function getFallbackAttractions(countryName) {
    const normalizedName = countryName.toLowerCase();
    
    const attractionsDB = {
        'colombia': [
            { name: 'Ciudad Perdida', category: 'arqueológico', description: 'Antigua ciudad Tayrona en la Sierra Nevada', image: 'https://images.unsplash.com/photo-1582656881775-76ecb7b4e8ab' },
            { name: 'Catedral de Sal', category: 'religioso', description: 'Catedral subterránea en Zipaquirá', image: '' },
            { name: 'Cafetal', category: 'naturaleza', description: 'Paisajes del eje cafetero', image: '' },
            { name: 'Castillo San Felipe', category: 'histórico', description: 'Fortaleza en Cartagena', image: '' },
            { name: 'Caño Cristales', category: 'naturaleza', description: 'El río de los 5 colores', image: '' }
        ],
        'japón': [
            { name: 'Monte Fuji', category: 'naturaleza', description: 'Montaña sagrada y símbolo de Japón', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
            { name: 'Templo Kinkaku-ji', category: 'templo', description: 'Pabellón Dorado en Kioto', image: '' },
            { name: 'Shibuya Crossing', category: 'urbano', description: 'El cruce peatonal más famoso del mundo', image: '' },
            { name: 'Castillo de Osaka', category: 'histórico', description: 'Castillo histórico japonés', image: '' },
            { name: 'Arashiayama Bamboo', category: 'naturaleza', description: 'Bosque de bambú en Kioto', image: '' }
        ],
        'francia': [
            { name: 'Torre Eiffel', category: 'monumento', description: 'Icono de París y Francia', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
            { name: 'Museo del Louvre', category: 'museo', description: 'Casa de la Mona Lisa', image: '' },
            { name: 'Palacio de Versalles', category: 'palacio', description: 'Palacio real francés', image: '' },
            { name: 'Arco del Triunfo', category: 'monumento', description: 'Monumento histórico parisino', image: '' },
            { name: 'Mont Saint-Michel', category: 'histórico', description: 'Isla fortificada', image: '' }
        ]
    };
    
    // Buscar atracciones para el país
    for (let [key, attractions] of Object.entries(attractionsDB)) {
        if (normalizedName.includes(key)) {
            return attractions;
        }
    }
    
    // Datos genéricos si no hay específicos
    return [
        { name: `Plaza principal de ${countryName}`, category: 'urbano', description: 'Centro histórico y cultural' },
        { name: `Museo Nacional de ${countryName}`, category: 'museo', description: 'Historia y arte del país' },
        { name: `Catedral de ${countryName}`, category: 'religioso', description: 'Arquitectura religiosa importante' },
        { name: `Parque Nacional de ${countryName}`, category: 'naturaleza', description: 'Belleza natural del país' },
        { name: `Mercado tradicional`, category: 'gastronomía', description: 'Sabores locales y artesanías' }
    ];
}