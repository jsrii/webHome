let today = new Date();
let todayDate = today.toString();
let timeHours = parseInt(today.getHours());
let timeMinutes = today.getMinutes();
let lastTime = getTime();
let lastWeatherCode = -99;
let lastWeatherDegrees = -99;


let weatherLatitude = 0;
let weatherLongitude = 0;
let city = "";
let backgroundArray = ["bg1.png", "bg2.png", "bg3.png", "bg4.png", "bg5.png", "bg6.png", "bg7.png", "bg8.png", "bg9.png", "bg10.png", "bg11.png", "bg12.png", "bg13.png"];
let name = "jsrii";

let username = document.getElementById("username");
let greeter = document.getElementById("greetingHeader");
let date = document.getElementById("date");
let time = document.getElementById("time");
let mainCard = document.getElementById("mainCardID");
let weatherIcon = document.getElementById("icon");
let weatherDegrees = document.getElementById("weather");
let weatherCity = document.getElementById("city");
let background = document.getElementById("mainBackgroundID");
let weatherContainer = document.getElementById("weatherContainerID");

setBackground();
getLocationData();
setUsername(name); 
setGreeter(today.getHours());
setDate("Today is: " + getFormattedDate());
setTime();
setLastWeatherData();
setInterval(() => { setTime() }, 1000);


console.log(backgroundArray[0]);

function getLocationData() {
    fetch("http://ip-api.com/json/?fields=61439")
        .then(response => response.json())
        .then(data => setLocationData(data));
}

function getInitialWeatherData() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + weatherLatitude + "&longitude=" + weatherLongitude + "&hourly=temperature_2m,precipitation_probability,precipitation,rain&current_weather=true")
        .then(response => response.json())
        .then(data => setInitialWeatherData(data));
}

function getTime() {
    today = new Date();
    timeHours = today.getHours();
    timeMinutes = today.getMinutes();
    let AMorPM = 'AM';

    if (timeHours >= 12) {
        AMorPM = 'PM';
    }

    if (timeHours > 12) {
        timeHours -= 12;
    }

    return timeHours + ':' + (timeMinutes < 10 ? '0' : '') + timeMinutes + ' ' + AMorPM;
}

function addSuffix(n) {
    if (n >= 11 && n <= 13) {
        return n + 'th';
    }
    switch (n % 10) {
        case 1: return n + 'st';
        case 2: return n + 'nd';
        case 3: return n + 'rd';
        default: return n + 'th';
    }
}

function getImageURL(data) {
    if (data.current_weather.is_day == 1) {//day
        switch (data.current_weather.weathercode) {
            case 0://clear
                return "icons/clearwhite.png";
                break;
            case 1: case 2: case 3: //partly cloudy
                return "icons/partlycloudywhite.png";
                break;
            case 45: case 48: //fog
                return "icons/fogwhite.png";
                break;
            case 61://slight rain
                return "icons/rainwhite.png";
                break;
            case 65://heavy rain
                return "icons/heavyrainwhite.png";
                break;
            case 66: case 67://freezing rain
                return "icons/freezingrainwhite.png";
                break;
            case 71://slight snowfall
                return "icons/snowwhite.png";
                break;
            case 75://heavy snowfall
                return "icons/heavysnowwhite.png";
                break;
        }
    }
    if (data.current_weather.is_day == 0) {//night
        switch (data.current_weather.weathercode) {
            case 0://clear 
                return "icons/clearnightwhite.png";
                break;
            case 1: case 2: case 3: //partly cloudy\
                return "icons/partlycloudynightwhite.png";
                break;
            case 61: //rain drizzle
                return "icons/drizzlenightwhite.png";
                break;
        }
    }
}

function setBackground() {
    let randomIndex = Math.floor(Math.random() * backgroundArray.length);
    let backgroundSel = backgroundArray[randomIndex];
    background.src = "backgrounds/" + backgroundSel;
    console.log(backgroundSel);

}

function setInitialWeatherData(data) {
    if (lastWeatherDegrees != -99) {
        unfade(weatherIcon);
        unfade(weatherDegrees);
        unfade(weatherCity);
        weatherIcon.src = getImageURL(data);
        weatherDegrees.innerHTML = Math.round(data.current_weather.temperature);
        weatherCity.innerHTML = city;
        lastWeatherCode = data.current_weather.weathercode;
        lastWeatherDegrees = data.current_weather.temperature;
        console.log(data.current_weather.temperature);
    }
}

function setLastWeatherData() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + weatherLatitude + "&longitude=" + weatherLongitude + "&hourly=temperature_2m,precipitation_probability,precipitation,rain&current_weather=true")
        .then(response => response.json())
        .then(data => setLastWeather(data));

}

function setLastWeather(data) {
    lastWeatherCode = data.current_weather.weathercode;
    lastWeatherDegrees = data.current_weather.temperature;
    setWeather(data);
}

function setLocationData(data) {
    weatherLatitude = data.lat;
    weatherLongitude = data.lon;
    city = data.city;
    getInitialWeatherData();
}

setInterval(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + weatherLatitude + "&longitude=" + weatherLongitude + "&hourly=temperature_2m,precipitation_probability,precipitation,rain&current_weather=true")
        .then(response => response.json())
        .then(data => setWeather(data));
}, 360000);

function getFormattedDate() {
    let options = { weekday: 'long', month: 'long', day: 'numeric' };
    today = new Date();
    let day = today.toLocaleDateString('en-US', options);
    let dayWithSuffix = addSuffix(today.getDate());
    return day;
}



function setUsername(user) {
    username.innerHTML = user;
}

function setGreeter(time) {
    if (time < 12) {
        greeter.innerHTML = "Good Morning,";
    } else if (time > 12 && time < 17) {
        greeter.innerHTML = "Good Afternoon,";
    } else if (time > 17 && time < 22) {
        greeter.innerHTML = "Good Evening,";
    } else if (time > 22 && time < 24) {
        greeter.innerHTML = "Good Night,";
    } else {
        greeter.innerHTML = "Welcome,";
    }
}

function setDate(today) {
    date.innerHTML = today;
}

function setTime() {
    if (lastTime != getTime()) {
        unfade(time);
        time.innerHTML = getTime();
        lastTime = getTime();
    } else {
        time.innerHTML = lastTime;
    }
}

function setWeather(data) {
    if (lastWeatherCode != data.current_weather.weathercode || lastWeatherDegrees != data.current_weather.temperature) {
        unfade(weatherIcon);
        unfade(weatherDegrees);
        unfade(weatherCity);
        weatherIcon.src = getImageURL(data);
        weatherDegrees.innerHTML = Math.round(data.current_weather.temperature);
        weatherCity.innerHTML = city;
        lastWeatherCode = data.current_weather.weathercode;
        lastWeatherDegrees = data.current_weather.temperature;
    }
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.2;
    }, 10);
}

weatherContainer.addEventListener('click', function () {
    getLocationData();
    if (weatherLongitude != 0 && weatherLatitude != 0) {
        fetch("https://api.open-meteo.com/v1/forecast?latitude=" + weatherLatitude + "&longitude=" + weatherLongitude + "&hourly=temperature_2m,precipitation_probability,precipitation,rain&current_weather=true")
            .then(response => response.json())
            .then(data => setWeather(data));
    }
});
