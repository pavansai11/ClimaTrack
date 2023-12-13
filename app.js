const { log } = require("console");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const config = require("./config");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = config.apiKey;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const iconURl = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
            res.write("<h1>The temperature at " + query + " is " + temp + " degree celcius.</h1>");
            res.write("<h3>\nThe weather is currently " + weatherDescription + "</h3>");
            res.write("<img src=" + iconURl + ">");
            res.send();
        })
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});

