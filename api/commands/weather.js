const fetch = require("node-fetch");

// Helper function to generate the weather message
const weatherMsg = (body, aqi, pm10, pm25) => {
    try {
        console.log(body);
        const tempRespParsed = body;
        let tempStr = `${tempRespParsed["main"]["temp"]}°C`;
        const description = `, ${tempRespParsed["weather"][0]["description"]}`;
        const feelsLike = ` tuntuu kuin: ${tempRespParsed["main"]["feels_like"]}°C`;
        const humidity = `, ilmankosteus: ${tempRespParsed["main"]["humidity"]}%`;
        tempStr += feelsLike + description + humidity;
        tempStr += `\nAQI: ${aqi} pm10: ${pm10} pm2.5: ${pm25}`;

        let aqiLevel = "";
        if (aqi <= 50) aqiLevel = "Hyvä";
        else if (aqi <= 100) aqiLevel = "Kohtalainen";
        else if (aqi <= 150) aqiLevel = "Epäterveellinen herkille ryhmille";
        else if (aqi <= 200) aqiLevel = "Epäterveellinen";
        else if (aqi <= 300) aqiLevel = "Erittäin Epäterveellinen";
        else if (aqi > 300) aqiLevel = "Vaarallinen";

        tempStr += ` (${aqiLevel})`;
        console.log("Generated weather message:", tempStr);
        return tempStr;
    } catch (e) {
        console.error("Error generating weather message:", e);
        return "Virhe sään hakemisessa!";
    }
};

// Command logic for getting weather
module.exports = async (interaction) => {
    const city = interaction.options.getString('city');
    if (!city) {
        return interaction.reply("Anna kaupunki! Esim: Tampere");
    }

    try {
        // Get AQI data
        const aqiUrl = `https://api.waqi.info/feed/${city}/?token=${process.env.AQI_API_TOKEN}`;
        const aqiResponse = await fetch(aqiUrl);
        const aqiResult = await aqiResponse.json();
        console.log("AQI Response:", aqiResult);

        let aqi = "-";
        let pm10 = "-";
        let pm25 = "-";

        if (aqiResult.data) {
            aqi = aqiResult.data.aqi || "-";
            if (aqiResult.data.iaqi) {
                pm10 = aqiResult.data.iaqi.pm10?.v || "-";
                pm25 = aqiResult.data.iaqi.pm25?.v || "-";
            }
        }

        // Get geolocation
        const geoLocUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.OPEN_WEATHER_API_KEY}`;
        const geoResp = await fetch(geoLocUrl);
        const geoData = await geoResp.json();

        if (!geoData || geoData.length === 0) {
            return interaction.reply("Kaupunkia ei löytynyt!");
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // Fetch weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fi&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;
        const weatherResp = await fetch(weatherUrl);

        if (weatherResp.status === 200) {
            const weatherData = await weatherResp.json();
            const weatherStr = weatherMsg(weatherData, aqi, pm10, pm25);
            return interaction.reply(weatherStr);
        } else {
            return interaction.reply("Virhe sään hakemisessa!");
        }
    } catch (e) {
        console.error("Error fetching weather:", e);
        return interaction.reply("Virhe sään hakemisessa!");
    }
};
