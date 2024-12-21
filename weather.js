const fetch = require("node-fetch")

weatherMsg = (body, aqi, pm10, pm25) => {
    try{
        console.log(body);
        let tempRespParsed = body; 
        let tempStr = ' ' + String(tempRespParsed["main"]["temp"]) + String.fromCharCode(176) + 'C';
        let description = ', ' + tempRespParsed["weather"][0]["description"];
        let feelsLike = ' tuntuu kuin: ' + String(tempRespParsed["main"]["feels_like"]) + String.fromCharCode(176) + 'C';
        let humidity = ', ilmankosteus: ' + String(tempRespParsed["main"]["humidity"]) + '%';
        tempStr = tempStr + feelsLike + description + humidity;
        tempStr = tempStr + "\nAQI: " + aqi + " pm10: " + pm10 + " pm2.5: " + pm25;

        let aqi_level = "";
        if(aqi <= 50){
            aqi_level = "Hyvä";
        }
        else if(aqi <= 100){
            aqi_level = "Kohtalainen";
        }
        else if(aqi <= 150){
            aqi_level = "Epäterveellinen herkille ryhmille";
        }
        else if(aqi <= 200){
            aqi_level = "Epäterveellinen";
        }
        else if(aqi <= 300){
            aqi_level = "Erittäin Epäterveellinen";
        }
        else if(aqi > 300){
            aqi_level = "Vaarallinen";
        }
        console.log("AQI Level: " + aqi_level);
        tempStr = tempStr + " ( " + aqi_level + " )";
        console.log("tempStr", tempStr);
        return tempStr;
    }
    catch(e){
       return "";
    }
};

getWeather = async (city, msg) => {
    if(!city){
        return "anna kaupunki! esim: !sää Tampere"
    }
    else{
        try{
            // get AQI
            const aqi_url = `https://api.waqi.info/feed/${city}/?token=${process.env.AQI_API_TOKEN}`;
            const aqi_response = await fetch(aqi_url);
            const aqi_result = await aqi_response.json();
            console.log("AQI");
            console.log(aqi_result);
            let aqi = "-";
            if(aqi_result.data.aqi){
                aqi = aqi_result.data.aqi;
            }
            let pm10 = "-";
            let pm25 = "-";
            if(aqi_result.data.iaqi){
                if(aqi_result.data.iaqi.pm10){
                    pm10 = aqi_result.data.iaqi.pm10.v;
                }
                if(aqi_result.data.iaqi.pm25){
                pm25 = aqi_result.data.iaqi.pm25.v;
                }
            }

            let geo_loc_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.OPEN_WEATHER_API_KEY}`
            const geo_resp = await fetch(geo_loc_url);
            let geo = await geo_resp.json();
            console.log("GEO:" + JSON.stringify(geo));
            let lat = geo[0].lat;
            let lon = geo[0].lon;

            var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fi&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;
            
            const weather_resp = await fetch(url);
            console.log(weather_resp);
            if(weather_resp.status === 200){
                let weather_data = await weather_resp.json();
                const weatherStr = weatherMsg(weather_data, aqi, pm10, pm25);
                msg.reply(weatherStr);
            }
            else{
                msg.reply("Virhe sään hakemisessa!")
            }
        }
        catch(e){
            console.log(e);
            msg.reply("Virhe sään hakemisessa!")
        }
    }
};


module.exports = {
    getWeather
}