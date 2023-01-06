let input = document.getElementById("cityInput");
let appId = "&appid=4c4cc2a0e9c2426c470227c0d2510cb2";
let coordinatesApi = "https://api.openweathermap.org/geo/1.0/direct?q=";
let weatherApi = "https://api.openweathermap.org/data/2.5/forecast?units=metric";
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        search();
    }
});
document.getElementById("savedC").addEventListener("click", function (e) {
    if (e.target && e.target.matches("li.history-bg")) {
        document.getElementById("cityInput").value = e.target.innerHTML;
        search();
    }
});

function search() {
    let cityInput = document.getElementById("cityInput").value;
    document.getElementById("cityInput").style.border = "1px solid black";
    document.getElementById("err").innerHTML = "";
    if (cityInput == "") { return; }
    else {
        let savedCity = localStorage.getItem('cities');
        if (savedCity == null) {
            let cities = [];
            let searchedCity = { c: cityInput };
            cities.push(searchedCity);
            localStorage.setItem("cities", JSON.stringify(cities));
            document.getElementById("savedC").innerHTML = "<li class=\"history-bg rounded mt-2 mb-2 p-2 text-center \">" + cityInput + "</li>";
        }
        else {
            let storedCities = JSON.parse(localStorage.getItem("cities"));
            let receivedCity = { c: cityInput };
            storedCities.forEach(elem => {
                if (elem.c == cityInput) {
                    storedCities = storedCities.filter(val => val.c !== cityInput)
                }
            });
            storedCities.unshift(receivedCity);
            localStorage.setItem("cities", JSON.stringify(storedCities));
            let result = JSON.parse(localStorage.getItem("cities"));
            let listBtn = "";
            result.forEach(elem => {
                listBtn += "<li class=\"history-bg rounded mt-2 mb-2 p-2 text-center\">" + elem.c + "</li>";
            });
            document.getElementById("savedC").innerHTML = listBtn;
        }
        extractCordinates(cityInput);
        document.getElementById("cityInput").value = "";
    }
}

function extractCordinates(cityInput) {
    fetchCity = cityInput;
    let url = coordinatesApi + fetchCity + appId
    let lat;
    let lon;
    fetch(url)
        .then(res => { return res.json(); })
        .then(res => {
            if (res != "") { lat = res[0].lat; lon = res[0].lon; return { lati: lat, longi: lon } }
            else { return "no city found"; }
        })
        .then(res => {
            if (res == "no city found") {
                document.getElementById("cityInput").style.border = "1px solid #FF0000";
                document.getElementById("err").innerHTML = "Invalid City Name";
            }
            else {
                getWeather(lat, lon);
            }

        });
}

function getWeather(lat, lon) {
    fetch(weatherApi + "&lat=" + lat + "&lon=" + lon + appId)
        .then(res => { return res.json() })
        .then(res => {
            let date = new Date(),
                dd = date.getDate(),
                mm = date.getMonth() + 1,
                yy = date.getFullYear();
            let days = {};
            for (i = 0; i <= 5; i++) {
                let curdate = new Date(yy, mm, dd + i)
                days[i] = curdate.getDate();
            }
            let n = 0;
            let fetchedData = [];
            res.list.forEach(el => {
                let cd = new Date(yy, mm, dd + n)
                let day = cd.getDate();
                let month = cd.getMonth();
                let year = cd.getFullYear();
                let formattedDate = "(" + year + "/" + month + "/" + day + ")";
                let d = new Date(el.dt * 1000);
                dt = d.getDate();
                if (dt == days[n]) {
                    let icon = "http://openweathermap.org/img/wn/" + el.weather[0].icon + ".png";
                    let data = { "date": formattedDate, "icon": icon, "weather": el.weather[0].main, "temp": el.main.temp, "wind": el.wind.speed, "humid": el.main.humidity };
                    fetchedData.push(data);
                    ++n;
                }
            })
            let weatherDataJson = JSON.stringify(fetchedData)
            showWeather(weatherDataJson);
        });
}

function showWeather(weatherDataJson) {
    let result = JSON.parse(weatherDataJson);
    document.getElementById("currCity").innerHTML = input.value + " " + result[0].date;
    document.getElementById("toayTemp").innerHTML = result[0].temp;
    document.getElementById("todayWind").innerHTML = result[0].wind;
    document.getElementById("todayHumid").innerHTML = result[0].humid;
    document.getElementById("currCityImg").src = result[0].icon;
    let card = "";
    result.forEach((el, index) => {
        if (index > 0) {
            card += "  <div class=\"bg-card pl-2 mt-2 mr-4 text-white w-20\"><h4>" + result[index].date + "</h4><p><img src=" + result[index].icon + "></p><p>Temp " + result[index].temp + "&#8451;</p><p>Wind " + result[index].wind + "MPH</p><p>Humidity: " + result[index].humid + "%</p></div>";
            document.getElementById("cards-container").innerHTML = card;
        }
    })
    document.getElementById("greet").style.display = "none";
    document.getElementById("res1").style.display = "block";
    document.getElementById("res2").style.display = "block";
}

function loadBtns() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (!storedCities) {
        return;
    }
    localStorage.setItem("cities", JSON.stringify(storedCities));
    let result = JSON.parse(localStorage.getItem("cities"));
    let listBtn = "";
    result.forEach(elem => {
        listBtn += "<li class=\"history-bg rounded mt-2 mb-2 p-2 text-center\">" + elem.c + "</li>";
    });
    document.getElementById("savedC").innerHTML = listBtn;
}

window.onload = function () {
    loadBtns();
};