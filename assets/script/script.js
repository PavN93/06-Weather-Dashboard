
const searchBtn = $("[data-button='search'");
const inputCityName = $("[data-input='city'");
const historyListTable = $("[data-history='list'");
const todayWeatherField = $("[data-weather='today']")
const apiKey = "6d33bf81156e3b1180bb72bf2a4518c6";
const fiveDaysCards = $("[data-five-days]");
const erase = $("[data-button='erase'");


// On page load
writeHistoryList();
writeWeatherOnLoad();

// Search button click
$(searchBtn).on("click", function (event) {
  event.preventDefault();
  console.log(moment().add(2, "d").format("YYYY-MM-DD"), "12:00:00");
  const cityName = inputCityName.val();
  todayWeatherUrl(cityName);
});

$(erase).on("click", function (event) {
  event.preventDefault();
  clearSearchHistory();
  writeWeatherOnLoad();
})

function clearSearchHistory() {
  localStorage.clear();
  writeHistoryList();
}

// Write most recent search on page load
function writeWeatherOnLoad() {
  const historyFromStorage = getSearchHistory();
  if (historyFromStorage.length > 0) {
    const mostRecentSearch = historyFromStorage[historyFromStorage.length - 1].name
    todayWeatherUrl(mostRecentSearch);
    $(inputCityName).val(mostRecentSearch.name);
  } else {
    todayWeatherField.empty();
    fiveDaysCards.empty();
  }
};

// Construct link for current weather
function todayWeatherUrl(cityName) {
  const todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;
  getTodayWeather(todayUrl, cityName);
};

// Get object for todays weather
function getTodayWeather(inputCityTodayUrl, cityName) {
  console.log("Today weather url requested");
  $.ajax({
    url: inputCityTodayUrl,
    success: function (todayWeatherDetails) {
      writeCurrentWeather(todayWeatherDetails, cityName);
      constructUVIndexUrl(todayWeatherDetails);
      forFiveDaysUrl(cityName);
    }
  }).catch(function () {
    console.log("There was an error when requesting todays weather");
  });
};

// Write todays weather and date
function writeCurrentWeather(todayWeatherDetails, cityName) {
  todayWeatherField.empty();
  const iconId = todayWeatherDetails.weather[0].icon;
  let writeWeatherDetails = "<img src='./assets/images/icons/" + iconId + ".png' style=width:50px;/>";
  let currentDate = moment().format('D-M-YYYY');
  writeWeatherDetails += "<h6>" + todayWeatherDetails.name + " (" + currentDate + ")</h6>";
  writeWeatherDetails += "<p>Temperature: " + Math.round(todayWeatherDetails.main.temp) + "\xB0C</p>";
  writeWeatherDetails += "<p>Humidity: " + todayWeatherDetails.main.humidity + "%</p>";
  writeWeatherDetails += "<p>Wind: " + todayWeatherDetails.wind.speed + " mph</p>";
  todayWeatherField.append(writeWeatherDetails);
  saveHistoryToStorage(cityName, todayWeatherDetails);
};


// Construct link for UV index
function constructUVIndexUrl(todayWeatherDetails) {
  const latitude = todayWeatherDetails.coord.lat;
  const longitude = todayWeatherDetails.coord.lon;
  const uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
  getUVIndexValue
  // return uvIndexUrl;
  getUVIndexValue(uvIndexUrl);
};

// Get UV Index value
function getUVIndexValue(uvIndexUrl) {
  $.ajax({
    url: uvIndexUrl
  }).then(function (uvIndexObject) {
    writeUVIndex(uvIndexObject.value);
  }).catch(function () {
    console.log("Error when requesting UV index");
  })
};

// Append UV index to current weather card
function writeUVIndex(uvIndexValue) {
  let color = "";
  if (uvIndexValue <= 2) {
    color = "Green";
  } else if (uvIndexValue > 2 && uvIndexValue <= 5) {
    color = "Gold";
  } else if (uvIndexValue > 5 && uvIndexValue <= 7) {
    color = "DarkOrange";
  } else if (uvIndexValue > 7 && uvIndexValue <= 10) {
    color = "Crimson"
  } else {
    color = "DarkViolet"
  };
  const appendIndex = "<p>UV Index: <span style='color:" + color + "'>" + uvIndexValue + "</span></p>";
  todayWeatherField.append(appendIndex);
}

// Construct link for five days weather
function forFiveDaysUrl(cityName) {
  const fiveDaysUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + apiKey;
  getFiveDaysWeather(fiveDaysUrl);
};

// Get object for five days weather
function getFiveDaysWeather(fiveDaysWeatherUrl) {
  console.log("Five days weather url requested");
  $.ajax({
    url: fiveDaysWeatherUrl,
    success: function (fiveDaysWeatherDetails) {
      writeFiveDaysWeather(fiveDaysWeatherDetails, fiveDaysWeatherUrl);
    }
  }).catch(function () {
    console.log("Couldn't find 5 days weather");
  })
};

// Write five days weather to cards
function writeFiveDaysWeather(fiveDaysWeatherDetails) {
  let fiveDaysArray = fiveDaysWeatherDetails.list;
  for (let index = 1; index <= 5; index++) {
    let cardToWriteData = $("[data-five-days='" + index + "']");
    cardToWriteData.empty();
    let nextDay = moment().add(index, "day").format("DD-MM-YYYY");
    let nextDayWeather = fiveDaysArray.filter(element => moment(element.dt_txt).format("DD-MM-YYYY") == nextDay);
    if (nextDayWeather.length >= 5) {
      // Get weather for 12 o'clock for every day if current time is past 12
      let nextDayWeatherToWrite = nextDayWeather[4];
      let iconId = nextDayWeatherToWrite.weather[0].icon;
      let writeOnCard = "<h6>" + nextDay + "</h6>";
      writeOnCard += "<img src='./assets/images/icons/" + iconId + ".png' style=width:30px;/>";
      writeOnCard += "<p>Temp: " + Math.round(nextDayWeatherToWrite.main.temp) + "\xB0C</p>";
      writeOnCard += "<p>Hum: " + nextDayWeatherToWrite.main.humidity + "%</p>";
      cardToWriteData.append(writeOnCard);
    } else {
      // If current time is before 12AM, get the last reported result
      let nextDayWeatherToWrite = nextDayWeather[nextDayWeather.length - 1];
      let iconId = nextDayWeatherToWrite.weather[0].icon;
      let writeOnCard = "<h6>" + nextDay + "</h6>";
      writeOnCard += "<img src='./assets/images/icons/" + iconId + ".png' style=width:30px;/>";
      writeOnCard += "<p>Temp: " + Math.round(nextDayWeatherToWrite.main.temp) + "\xB0C</p>";
      writeOnCard += "<p>Hum: " + nextDayWeatherToWrite.main.humidity + "%</p>";
      cardToWriteData.append(writeOnCard);
    }
  }
};

// Add searched city to history
function saveHistoryToStorage(cityName, todayWeatherDetails) {
  searchHistory = getSearchHistory();
  const result = {
    name: todayWeatherDetails.name,
    id: todayWeatherDetails.id
  }
  const id = result.id;
  searchHistory = searchHistory.filter(item => item.id !== id);
  if (searchHistory.length > 0 && searchHistory.length < 8) {
    searchHistory.push(result);
  } else if (searchHistory.length >= 8) {
    searchHistory.shift();
    searchHistory.push(result);
  } else {
    searchHistory.push(result);
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  writeHistoryList();
};

// Load history from local storage
function getSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory && Array.isArray(searchHistory) && searchHistory.length >= 1) {
    return searchHistory;
  }
  return [];
};

// Write history from storage to html
function writeHistoryList() {
  const historyFromStorage = getSearchHistory();
  historyListTable.empty();
  if (historyFromStorage.length > 0) {
    $.each(historyFromStorage, function (index, searchedCity) {
      const historyElement = "<tr><td><a href='#' data-history-city='" + searchedCity.name + "'>" + searchedCity.name + "</a></td></tr>";
      $(historyListTable).prepend(historyElement);
    })
  } else {
    $(historyListTable).prepend("<tr><td>Nothing here!</td></tr>");
  }
  handleHistoryLinkClick();
};

// Click event handling on history
function handleHistoryLinkClick() {
  const cityFromHistory = $("[data-history-city]");
  $(cityFromHistory).on("click", function (event) {
    event.preventDefault();
    const cityClicked = $(this).attr("data-history-city");
    $(inputCityName).val(cityClicked);
    todayWeatherUrl(cityClicked);
  })
};