const apiKey = "895f3f1697d308bd15bfb543fa575aef"; 

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const recentCities = document.getElementById("recentCities");
const currentLocBtn = document.getElementById("currentLocBtn");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Bruh, type a city name 😑");
    return;
  }
  fetchWeather(city);
  updateRecentCities(city);
});

recentCities.addEventListener("change", () => {
  const selectedCity = recentCities.value;
  if (selectedCity) {
    fetchWeather(selectedCity);
  }
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      const { name, main, wind, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      weatherInfo.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${name}</h3>
        <img src="${icon}" alt="${weather[0].description}" class="mx-auto">
        <p>🌡️ Temp: ${main.temp}°C</p>
        <p>💧 Humidity: ${main.humidity}%</p>
        <p>💨 Wind: ${wind.speed} m/s</p>
        <p>${weather[0].main} - ${weather[0].description}</p>
      `;
    })
    .catch(() => {
      weatherInfo.innerHTML = `<p class="text-red-400">City not found or API error ⚠️</p>`;
    });
}

function updateRecentCities(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (!cities.includes(city)) {
    cities.unshift(city); // Add to start
    if (cities.length > 5) cities.pop(); // Limit to 5
    localStorage.setItem("recentCities", JSON.stringify(cities));
  }

  renderCityDropdown();
}

function renderCityDropdown() {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (cities.length > 0) {
    recentCities.classList.remove("hidden");
    recentCities.innerHTML = `<option value="">Recent Cities</option>`;
    cities.forEach(city => {
      recentCities.innerHTML += `<option value="${city}">${city}</option>`;
    });
  } else {
    recentCities.classList.add("hidden");
  }
}

// Load dropdown on page load
renderCityDropdown();



currentLocBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Location fetch failed");
      return res.json();
    })
    .then(data => {
      const { name, main, wind, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      weatherInfo.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${name}</h3>
        <img src="${icon}" alt="${weather[0].description}" class="mx-auto">
        <p>🌡️ Temp: ${main.temp}°C</p>
        <p>💧 Humidity: ${main.humidity}%</p>
        <p>💨 Wind: ${wind.speed} m/s</p>
        <p>${weather[0].main} - ${weather[0].description}</p>
      `;
    })
    .catch(() => {
      weatherInfo.innerHTML = `<p class="text-red-400">Could not fetch location weather ⚠️</p>`;
    });
}

function error() {
  alert("Couldn't fetch location. Permission denied?");
}
