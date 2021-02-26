var Client = require('node-rest-client').Client;
var client = new Client();
const fetch = require("node-fetch")

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

            const API_KEY = process.env.API_KEY_OPEN_WEATHER;
            var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=fi&appid=${API_KEY}&units=metric`
            
            client.get(url,function(data,response){
                
                //console.log("response");
                //console.log(response);
                if(response.statusCode === 200){
                    callBack(data, msg, aqi, pm10, pm25);
                }
            });
        }
        catch(e){
            console.log(e);
            msg.reply("Virhe sään hakemisessa!")
        }
    }
};

function callBack(body, msg, aqi, pm10, pm25) {
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
        msg.reply(tempStr);
    }
    catch(e){
        msg.reply("");
    }
};

module.exports = {
    getWeather
}