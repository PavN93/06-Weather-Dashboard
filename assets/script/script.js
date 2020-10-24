
const searchBtn = $("[data-button='search'");
const inputCityName = $("[data-input='city'");
const historyListTable = $("[data-history='list'");
const todayWeatherField = $("[data-weather='today']")
const apiKey = "6d33bf81156e3b1180bb72bf2a4518c6";


// on page load
writeHistoryList();

// search button click
$(searchBtn).on("click", function() {
  console.log(moment().add(2, "d").format("YYYY-MM-DD"), "12:00:00");
  const cityName = inputCityName.val();
  inputCityTodayUrl = todayWeatherUrl(cityName);
});



// Construct current weather link
function todayWeatherUrl(cityName) {
  const todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;
  getTodayWeather(todayUrl, cityName) ;
};

// Construct 5 days weather link
function forFiveDaysUrl(cityName) {
  const fiveDaysUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + apiKey;
  getFiveDaysWeather(fiveDaysUrl);
};

// get object for todays weather
function getTodayWeather(inputCityTodayUrl, cityName) { 
  $.ajax({
    url : inputCityTodayUrl,
    success : function (todayWeatherDetails) {
      // successfulSearch(cityName);
      writeCurrentWeather(todayWeatherDetails, cityName);
      forFiveDaysUrl(cityName)
    }
  }).catch(function() {
    console.log("There was an error");
  });
};

// get object for five days weather
function getFiveDaysWeather(fiveDaysWeatherUrl) {
  $.ajax({
    url : fiveDaysWeatherUrl,
    success : function (fiveDaysWeatherDetails) {
      writeFiveDaysWeather(fiveDaysWeatherDetails, fiveDaysWeatherUrl);
    }
  }).catch(function() {
    console.log("Couldn't find 5 days weather");
  })
};

// write todays weather and date
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

// write five days weather to cards
function writeFiveDaysWeather(fiveDaysWeatherDetails, fiveDaysWeatherUrl){
  console.log("five days object:", fiveDaysWeatherDetails);
  console.log("five days URL:", fiveDaysWeatherUrl);
};

// function to add searched city to history
function saveHistoryToStorage(cityName, todayWeatherDetails){
  searchHistory = getSearchHistory();
  const result = {
    name : cityName,
    id : todayWeatherDetails.id
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

// load history from local storage
function getSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory && Array.isArray(searchHistory) && searchHistory.length >= 1) {
    return searchHistory;
  }
  return [];
};

// write history from storage to html
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

// click event handling on history
function handleHistoryLinkClick() {
  const cityFromHistory = $("[data-history-city]");
  $(cityFromHistory).on("click", function() {
  const cityClicked = $(this).attr("data-history-city");
  $(inputCityName).val(cityClicked);
  todayWeatherUrl(cityClicked);
})
}