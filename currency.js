// ===== CURRENCY.JS - CON API ALTERNATIVA =====

async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const monto = parseFloat(amount);
        
        if (isNaN(monto) || monto <= 0) {
            throw new Error('Cantidad inválida');
        }
        
        if (fromCurrency === toCurrency) {
            return {
                success: true,
                amount: monto,
                from: fromCurrency,
                to: toCurrency,
                result: monto,
                rate: 1
            };
        }
        
        // USAR API ALTERNATIVA (ExchangeRate-API - gratis, sin API key)
        const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
        
        console.log('Usando API alternativa:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('API no disponible');
        }
        
        const data = await response.json();
        
        const rate = data.rates[toCurrency];
        
        if (!rate) {
            throw new Error(`No se puede convertir ${fromCurrency} a ${toCurrency}`);
        }
        
        return {
            success: true,
            amount: monto,
            from: fromCurrency,
            to: toCurrency,
            result: monto * rate,
            rate: rate
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function formatConversionResult(amount, fromCurrency, result, toCurrency) {
    return `${amount.toFixed(2)} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
}