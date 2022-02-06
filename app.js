const API_KEY = "d21c4cf5692fcd87081a6796bfc3c226";
//SEARCH
const inputEl = document.getElementById("input");
const searchBtn = document.getElementById("search");
//TIME
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const timezoneEl = document.getElementById("time-zone");
//FORCAST
const mainCurrentInformationEl = document.querySelector(
  ".main-current-information"
);
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const iconEl = document.getElementById("wicon");
const weatherForecastEl = document.getElementById("weather-forecast");

var timer = 0;

function search() {
  const city = inputEl.value;
  inputEl.placeholder = "Enter location";
  inputEl.classList.remove("err");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      let { lat, lon } = data.coord;
      clearInterval(timer);
      timer = setInterval(returnTime, 1000, data);
      showName(data);
      console.log(data);
      fetchWeatherFromApi(lat, lon).then(showWeatherData);
    })
    .catch((err) => {
      inputEl.placeholder = "Invalid name";
      inputEl.classList.add("err");
    });
  inputEl.value = "";
}

searchBtn.addEventListener("click", () => {
  search();
});

inputEl.addEventListener("keyup", function (e) {
  if (e.key == "Enter") {
    search();
  }
});

navigator.geolocation.getCurrentPosition((success) => {
  let { latitude, longitude } = success.coords;
  fetchWeatherFromApiCityName(latitude, longitude).then((data) => {
    timer = setInterval(returnTime, 1000, data);
    showName(data);
    console.log(data);
  });
  fetchWeatherFromApi(latitude, longitude).then(showWeatherData);
});

function fetchWeatherFromApi(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
  ).then((res) => res.json());
}
function fetchWeatherFromApiCityName(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  ).then((res) => res.json());
}

function returnTime(data) {
  let offset = data.timezone / 60;
  let time = moment().utcOffset(offset);
  let date = time.format("D. MMM YYYY");
  let clock = time.format("H:mm:ss");
  timeEl.innerHTML = clock;
  dateEl.innerHTML = date;
}
function showName(data) {
  const timezone = data.name;
  timezoneEl.innerHTML = timezone;
}

function showWeatherData(data) {
  let { humidity, pressure, wind_speed, temp } = data.current;
  let icon = "";
  let otherDayForcast = "";
  let arrW = [
    "01d",
    "01n",
    "02d",
    "02n",
    "03d",
    "03n",
    "04d",
    "04n",
    "09d",
    "09n",
    "10d",
    "10n",
    "11d",
    "11n",
    "13d",
    "13n",
    "50d",
    "50n",
  ];
  let arrL = [
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/clear-day.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/clear-night.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/overcast-day.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/overcast-night.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/cloudy.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/cloudy.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/overcast.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/overcast.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/rain.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/rain.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/partly-cloudy-day-drizzle.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/partly-cloudy-night-drizzle.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/thunderstorms-rain.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/thunderstorms-rain.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/snow.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/snow.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/fog-day.svg",
    "https://bmcdn.nl/assets/weather-icons/v2.1/fill/fog-night.svg",
  ];

  iconEl.src = `${arrL[arrW.indexOf(data.current.weather[0].icon)]}`;

  mainCurrentInformationEl.innerHTML = data.current.weather[0].main;

  switch (data.current.weather[0].main) {
    case "Clear":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-sun");
      break;
    case "Rain":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-rain");
      break;
    case "Snow":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-snow");
      break;
    case "Clouds":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-clouds");
      break;
    case "Thunder":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-thunder");
      break;
    case "Mist":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-mist");
      break;
    case "Fog":
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add("bg-img-mist");
      break;
    default:
      console.log(`Sorry, we are out of ${expr}.`);
  }

  currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
        <p>Current temp</p>
        <p>${Math.floor(temp)}&#176;C</p>
    </div>
    <div class="weather-item">
        <p>Humidity</p>
        <p>${Math.floor(humidity)}%</p>
    </div>
    <div class="weather-item">
        <p>Pressure</p>
        <p>${Math.floor(pressure)} hPa</p>
    </div>
    <div class="weather-item">
        <p>Wind speed</p>
        <p>${Math.floor(wind_speed)} km/h</p>
    </div>`;

  data.daily.forEach((day, idx) => {
    icon = day.weather[0].icon;

    if (idx > 0 && idx < 6) {
      otherDayForcast += `
        <div class="weather-forecast-item glass">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <img src="${
              arrL[arrW.indexOf(icon)]
            }" alt="weather icon" class="w-icon">
            <div class="main-current-info">${day.weather[0].main}</div>
            <div class="temp">${Math.floor(day.temp.day)}&#176;C</div>
        </div>
            `;
    }
  });
  weatherForecastEl.innerHTML = otherDayForcast;
}
