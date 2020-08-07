// Data
let favorites = {};

let sentence = "";

let currentCity = {
  name: "Houston",
  data: {
    coord: {
      lon: -95.36,
      lat: 29.76,
    },
    weather: [
      {
        id: 211,
        main: "Thunderstorm",
        description: "thunderstorm",
        icon: "11d",
        base: "stations",
      },
    ],
    main: {
      temp: 29.24,
      feels_like: 33.43,
      temp_min: 26,
      temp_max: 32,
      pressure: 1015,
      humidity: 88,
    },
    visibility: 10000,
    wind: {
      speed: 5.1,
      deg: 250,
      gust: 8.2,
    },
    clouds: {
      all: 75,
    },
    dt: 1595440017,
    sys: {
      type: 1,
      id: 4850,
      country: "US",
      sunrise: 1595417710,
      sunset: 1595467218,
    },
    timezone: -18000,
    id: 4699066,
    name: "Houston",
    cod: 200,
  },
};

const apiKey = "cce07da6a69974d4cbb12e9fb81759f5";

let apiUrl = null;

let lat = null;

let long = null;

let currentPosition = null;

let currentCityName = null;

let sunrise = null;
let sunset = null;

const currentDate = new Date();

let currentDay = null;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// common
const handleCreateDate = (stamp) => {
  return new Date(stamp * 1000);
};

const handleCelsiusToFahrenheit = (value) => {
  const temp = (value * 9) / 5 + 32;
  return temp;
};

const handleFahrenheitToCelsius = (value) => {
  const temp = ((value - 32) * 5) / 9;
  return temp;
};

const handleDisplayContent = (array) => {
  array.forEach((element) => {
    const item = document.querySelector(element.class);

    item.innerHTML = element.content;
  });
};

const handleDisplayWeatherDescription = (element, value, data, v) => {
  element.className.split(" ").forEach((item) => {
    if (item.includes("today__text--description-")) {
      element.classList.remove(item);
    }
  });

  data.forEach((item) => {
    handleAddClass(element, `${value}${item.icon}`);
  });
};

const handleAddClass = (element, value) => {
  element.classList.add(value);
};
const handleGetCurrentLocation = (event) => {
  navigator.geolocation.getCurrentPosition(handlePosition);
};

const handleDisplayCurrentWeatherLocation = () => {
  sunrise = handleCreateDate(currentCity.data.current.sunrise);
  sunset = handleCreateDate(currentCity.data.current.sunset);

  const elements = [
    {
      class: "#location",
      content: currentCity.name,
    },
    {
      class: "#temp",
      content: currentCity.data.current.temp.toFixed(1),
    },
    {
      class: "#rain",
      content: currentCity.data.current.rain
        ? `${currentCity.data.current.rain}mm/h`
        : `0mm/h`,
    },
    {
      class: "#humidity",
      content: `${currentCity.data.current.humidity}%`,
    },
    {
      class: "#tempCold",
      content: currentCity.data.daily[0].temp.min.toFixed(1),
    },
    {
      class: "#tempHot",
      content: currentCity.data.daily[0].temp.max.toFixed(1),
    },
    {
      class: "#wind",
      content: `${currentCity.data.current.wind_speed}m/sec`,
    },
    {
      class: "#weather__description",
      content: currentCity.data.current.weather[0].description,
    },
    {
      class: "#sunrise",
      content: `${
        sunrise.getHours() < 10 ? "0" + sunrise.getHours() : sunrise.getHours()
      }: ${
        sunrise.getMinutes() < 10
          ? "0" + sunrise.getMinutes()
          : sunrise.getMinutes()
      }`,
    },
    {
      class: "#sunset",
      content: `${
        sunset.getHours() < 10 ? "0" + sunset.getHours() : sunset.getHours()
      }: ${
        sunset.getMinutes() < 10
          ? "0" + sunset.getMinutes()
          : sunset.getMinutes()
      }`,
    },
  ];

  const div = document.querySelector("#weather__description");

  for (const [key, value] of Object.entries(
    JSON.parse(localStorage.getItem("favorites"))
  )) {
    if (value.name === currentCity.name) {
      document.querySelector("#favorite").checked = "checked";
    }
  }

  handleDisplayWeatherDescription(
    div,
    "today__text--description-",
    currentCity.data.current.weather
  );

  handleDisplayContent(elements);
};

const handleDisplayHourlyWeatherLocation = () => {
  const list = document.querySelector("#today__temperatureList");
  list.innerHTML = "";

  currentCity.data.hourly.map((item, i) => {
    const div = document.createElement("div");
    const timestamp = item.dt;

    const date = handleCreateDate(timestamp);

    div.innerHTML = `<dt class='today__title today__title--hide'>
        00:30
      </dt>

      <dd>
        <article>
          <h4 class='today__title today__title--nowrap today__title--center'>
            ${item.temp.toFixed(1)}&#176;
            <span>
              C
            </span>
          </h4>

          <p class='today__text today__text--description today__text--center' id='weather__description--${i}-hourly'></p>

          <p class='today__text today__text--center'>
            ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }
          </p>
        </article>
      </dd>`;

    handleAddClass(div, "today__temperatureItem");

    list.appendChild(div);

    const p = document.querySelector(`#weather__description--${i}-hourly`);

    handleDisplayWeatherDescription(
      p,
      "today__text--description-",
      item.weather
    );
  });
};

const handleDisplayDailyWeatherLocation = () => {
  const list = document.querySelector("#week__list");
  list.innerHTML = "";
  let tempCurrentDay = currentDay;

  currentCity.data.daily.map((item, i) => {
    if (i !== 0) {
      if (tempCurrentDay < 6) {
        tempCurrentDay = tempCurrentDay + 1;
      } else if (tempCurrentDay === 6) {
        tempCurrentDay = 0;
      }

      const div = document.createElement("div");
      div.innerHTML = `<div class='card shadow p-3 mb-5 bg-white rounded'>
        <div class='cardbody'>
          <dt class='today__title today__title--hide'>
            Saturday
          </dt>

          <dd class='week__content'>
            <article>
              <h4 class='today__title today__title--center'>
                ${item.temp.day.toFixed(1)}&#176;
                <span>
                  C
                </span>
              </h4>

              <p class='today__text today__text--description today__text--center' id='weather__description--${i}-daily'></p>
              
              <p class='today__text today__text--center'>
                <small>
                  ${days[tempCurrentDay]}
                </small>
              </p>
            </article>
          </dd>
        </div>
      </div>`;

      handleAddClass(div, "col");
      handleAddClass(div, "col-12");
      handleAddClass(div, "col-sm-6");
      handleAddClass(div, "week__item");

      list.appendChild(div);

      const p = document.querySelector(`#weather__description--${i}-daily`);

      handleDisplayWeatherDescription(
        p,
        "today__text--description-",
        item.weather
      );
    }
  });
};

// Date
const handleChangeDate = () => {
  const minutes =
    currentDate.getMinutes() < 10
      ? "0" + currentDate.getMinutes()
      : currentDate.getMinutes();

  currentDay = currentDate.getDay();

  const elements = [
    {
      class: "#dayName",
      content: days[currentDay],
    },
  ];

  handleDisplayContent(elements);
};

// SearchEngine
const handleSubmitCity = (event) => {
  event.preventDefault();

  handleUnCheckFavorites("all");
  document.querySelector("#favorite").checked = "";

  const city = document.querySelector("#searchForm__field--city").value;

  const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl1)
    .then((response) => {
      currentCityName = response.data.name;
      lat = response.data.coord.lat;
      long = response.data.coord.lon;

      apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minute&appid=${apiKey}&units=metric`;
      axios
        .get(apiUrl)
        .then((response) => {
          currentCity.data = response.data;
          handleCurrentForcast(response);
        })
        .catch((error) => {
          console.log(error.response);
        });
    })
    .catch((error) => {
      console.log(error.response);
      sentence = `Sorry, we do not know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`;
      handleGreeting(sentence);
    });
};

const handleGreeting = (greeting) => {
  alert(greeting);
};

// Denoting temperature

const handleCheckCelsius = (event) => {
  const tempCurrentCity = currentCity;

  currentCity.data.current.temp = handleFahrenheitToCelsius(
    tempCurrentCity.data.current.temp
  );

  currentCity.data.hourly.map((item, i) => {
    item.temp = handleFahrenheitToCelsius(item.temp);
  });

  handleDisplayCurrentWeatherLocation();
  handleDisplayHourlyWeatherLocation();
};

const handleCheckFahrenheit = (event) => {
  const tempCurrentCity = currentCity;

  currentCity.data.current.temp = handleCelsiusToFahrenheit(
    tempCurrentCity.data.current.temp
  );

  currentCity.data.hourly.map((item, i) => {
    item.temp = handleCelsiusToFahrenheit(item.temp);
  });

  handleDisplayCurrentWeatherLocation();
  handleDisplayHourlyWeatherLocation();
};

// favorites
const handleClickFavoriteItem = (event) => {
  handleUnCheckFavorites(event.target.id);

  document.querySelector("#favorite").checked = "checked";

  const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${event.target.id.toLowerCase()}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl1)
    .then((response) => {
      currentCity.name = response.data.name;

      lat = response.data.coord.lat;
      long = response.data.coord.lon;

      apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minute&appid=${apiKey}&units=metric`;
      axios
        .get(apiUrl)
        .then((response) => {
          currentCity.data = response.data;
          handleDisplayCurrentWeatherLocation();
        })
        .catch((error) => {
          console.log(error.response);
        });
    })
    .catch((error) => {
      console.log(error.response);
    });
};

const handleUnCheckFavorites = (value) => {
  document.querySelectorAll(".favorites__field").forEach((element) => {
    if (element.id !== value || value === "all") {
      element.checked = "";
    }
  });
  document.querySelector("#fahrenheit").checked = "";
  document.querySelector("#celcius").checked = "checked";
};

const handleClickFavorite = (event) => {
  if (event.target.checked) {
    handleAddFavorite();
  } else {
    handleDeleteFavorite();
  }
};

const handleAddFavorite = (event) => {
  // get item
  favorites = JSON.parse(localStorage.getItem("favorites"));
  // add current city
  favorites[currentCity.name.toLowerCase()] = currentCity;
  // save to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  handleDisplayFavorites();
};

const handleDeleteFavorite = () => {
  // get item
  favorites = JSON.parse(localStorage.getItem("favorites"));
  // remove current city
  delete favorites[currentCity.name.toLowerCase()];
  // save to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  handleDisplayFavorites();
};

const handleDisplayFavorites = () => {
  const list = document.querySelector("#favoritesList");

  list.innerHTML = "";

  for (const [key, value] of Object.entries(
    JSON.parse(localStorage.getItem("favorites"))
  )) {
    const li = document.createElement("li");

    li.innerHTML = `
      <input class='favorites__field favorites__field--hide favorites__field--${key}' type='checkbox' id='${value.name.toLowerCase()}' />
      <label class='favorites__text' for='${value.name.toLowerCase()}'>${
      value.name
    }</label>`;

    li.classList.add("favorites__item");

    list.appendChild(li);

    document
      .querySelectorAll(".favorites__field")
      .forEach((element) =>
        element.addEventListener("click", handleClickFavoriteItem)
      );
  }
};

// Weather API

const handleGetWeatherCurrentPosition = () => {
  const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minute&appid=${apiKey}&units=metric`;

  if (lat && long) {
    axios
      .get(apiUrl1)
      .then((response) => {
        currentCityName = response.data.name;
        axios
          .get(apiUrl)
          .then((response) => {
            currentCity.data = response.data;
            handleCurrentForcast(response);
          })
          .catch((error) => {
            console.log(error.response);
          });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
};

// Geolocation API
const handlePosition = (response) => {
  currentPosition = response;
  lat = currentPosition.coords.latitude;
  long = currentPosition.coords.longitude;

  handleGetWeatherCurrentPosition();
};

function handleCurrentForcast(response) {
  currentCity.name = currentCityName;

  handleDisplayCurrentWeatherLocation();
  handleDisplayHourlyWeatherLocation();
  handleDisplayDailyWeatherLocation();
}

const init = () => {
  if (
    JSON.parse(localStorage.getItem("favorites")) === undefined ||
    JSON.parse(localStorage.getItem("favorites")) === null
  ) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  handleGetCurrentLocation();

  document
    .querySelectorAll("#button--currentLocation")
    .forEach((element) =>
      element.addEventListener("click", handleGetCurrentLocation)
    );

  document
    .querySelector("#searchForm--city")
    .addEventListener("submit", handleSubmitCity);

  document
    .querySelector("#celcius")
    .addEventListener("change", handleCheckCelsius);

  document
    .querySelector("#fahrenheit")
    .addEventListener("change", handleCheckFahrenheit);

  document
    .querySelectorAll(".favorites__field")
    .forEach((element) =>
      element.addEventListener("click", handleClickFavoriteItem)
    );

  document
    .querySelector("#favorite")
    .addEventListener("change", handleClickFavorite);

  handleChangeDate();

  handleDisplayFavorites();
};

init();
