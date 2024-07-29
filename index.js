const axios = require('axios');
const fs = require('fs');
const https = require('https');

// Nuevos valores de API ID y API Key
const APP_ID = 'eb5074c4';
const APP_KEY = '4f488cc981b5961fe176833cedf9d3d3';

// Lista de ingredientes en inglés
const ingredients = [
    "Pepperoni"
];

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function getNutritionalData(ingredient) {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(ingredient)}`;
    try {
        const response = await axios.get(url, { httpsAgent });
        const food = response.data.hints[0].food;
        const nutrients = food.nutrients;
        return {
            name: food.label,
            calories: nutrients.ENERC_KCAL ? parseFloat(nutrients.ENERC_KCAL).toFixed(2) : 0,
            carbohydrates: nutrients.CHOCDF ? parseFloat(nutrients.CHOCDF).toFixed(2) : 0,
            fat: nutrients.FAT ? parseFloat(nutrients.FAT).toFixed(2) : 0,
            protein: nutrients.PROCNT ? parseFloat(nutrients.PROCNT).toFixed(2) : 0,
            image: food.image ? food.image : null
        };
    } catch (error) {
        console.error(`Error fetching nutritional data for ${ingredient}: ${error.message}`);
        return null;
    }
}

async function fetchAndSaveNutritionalData(ingredients) {
    const data = {};

    for (const ingredient of ingredients) {
        const nutritionalData = await getNutritionalData(ingredient);
        if (nutritionalData) {
            data[ingredient] = nutritionalData;
        }
    }

    fs.writeFileSync('NutritionalData1.json', JSON.stringify(data, null, 2), 'utf-8');
}

fetchAndSaveNutritionalData(ingredients);
