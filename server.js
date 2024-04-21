    const express = require('express');
    const axios = require('axios');
    const geminiai = require('./geminiai');


    const app = express()

    app.use(express.json())
    // Import Axios library (make sure you have Axios installed)
    // const axios = require('axios');

    // Define the latitude and longitude coordinates
    const latitude = 41.1412;
    const longitude = -81.3384;

    // Your OpenWeatherMap API key
    const api_key = 'ee771e79c014a157604d6e6621a6f06d';
    let completeweatherdata = ''
    // Fetch weather data
    const getWeather = async () => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const weatherdata = {
            temperature: `The current temperature is approximately ${response.data.main.temp} Kelvin, which translates to approximately ${273.15 - response.data.main.temp}°C.`,
            Feels_Like_Temperature: `It feels like ${response.data.main.feels_like} Kelvin, which is approximately  ${273.15 - response.data.main.feels_like}°C.`,
            Minimum_Temperature: `The lowest temperature recorded is approximately ${response.data.main.temp_min} Kelvin, equivalent to approximately ${273.15 - response.data.main.temp_min}°C.`,
            Maximum_Temperature: `The highest temperature recorded is approximately ${response.data.main.temp_max} Kelvin, equivalent to approximately ${273.15 - response.data.main.temp_max}°C.`,
            Pressure : `The atmospheric pressure is ${response.data.main.pressure} hPa.`,
            Humidity: `The relative humidity is ${response.data.main.humidity}%.`,
            Wind_Speed: `The wind speed is approximately ${response.data.wind.speed} meters pera second.`,
        }
        for (const key in weatherdata) {
            if (weatherdata.hasOwnProperty(key)) {
                // console.log(`${key}: ${weatherdata[key]}`);
                completeweatherdata = completeweatherdata + `${key}: ${weatherdata[key]}`
                // console.log("completeweatherdata",completeweatherdata)
            }
        }
        return weatherdata
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
    };

    // Call the function


    app.get('/weather',async  (req,res)=>{
        const weather =  await getWeather();
        // console.log("completeweatherdata12345",completeweatherdata)
        const geminiaii = await geminiai(`based on the below data give me exact word like rainy , cloudy , sunny , windy and accordingly  and just want only one word  ${completeweatherdata} `)
        // console.log("geminiai ",geminiaii)
        res.json(geminiaii)
        // res.json(weather)
    })
    app.get('/geminiai',async(req,res)=>{
        const geminiaii = await geminiai("what is api")
        console.log("geminiai 123 ",geminiaii)
        res.json(geminiaii)
    })

    app.listen(3000,()=>console.log('backend server running'))