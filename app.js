const { log } = require("console");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const config = require("./config");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = config.apiKey;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);

        if (response.statusCode === 404) {
            // City not found in OpenWeatherMap
            return res.status(400).send('City not found. Please enter a valid city name');
        }
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const iconURL = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
             // Construct the entire HTML response
             const htmlResponse = `
             <h1>The temperature at ${query} is ${temp} degree Celsius.</h1>
             <h3>The weather is currently ${weatherDescription}</h3>
             <img src=${iconURL} alt="Weather Icon">
         `;

         // Send the HTML response
         res.send(htmlResponse);
        })
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});

