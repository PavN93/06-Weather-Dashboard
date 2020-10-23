
const searchBtn = $("[data-button='search'");
const inputCityName = $("[data-input='city'");
const apiKey = "6d33bf81156e3b1180bb72bf2a4518c6";


// search button click
$(searchBtn).on("click", function() {
  inputCityTodayUrl = todayWeatherUrl();
  todayWeatherDetails = getTodayWeather(inputCityTodayUrl);
  // console.log("Weather object:", todayWeatherDetails);

});

// Construct current weather link
function todayWeatherUrl() {
  const cityName = inputCityName.val();
  const todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;
  return todayUrl;
};

function getTodayWeather(inputCityTodayUrl) { 
  $.ajax({
    url : inputCityTodayUrl,
    success : function (todayWeatherDetails) {
      writeCurrentWeather(todayWeatherDetails);
    }
  }).catch(function() {
    console.log("There was an error");
  });
};

function writeCurrentWeather(todayWeatherDetails) {
  console.log("write weather", todayWeatherDetails);
  const todayWeatherField = $("[data-weather='today']").empty();
  const iconId = todayWeatherDetails.weather[0].icon;
  let writeWeatherDetails = "<img class='img-fluid' src='./assets/images/icons/" + iconId + ".png'/>"; 
  todayWeatherField.append(writeWeatherDetails);
  // had to split appending due to styling issues
  let currentDate = moment().format('D-M-YYYY');
  writeWeatherDetails = "<h6>" + todayWeatherDetails.name + " (" + currentDate + ")<h6>";
  todayWeatherField.append(writeWeatherDetails);
  writeWeatherDetails = "<p>Temperature: " + Math.round(todayWeatherDetails.main.temp) + "\xB0C<p>";
  writeWeatherDetails += "<p>Humidity: " + todayWeatherDetails.main.humidity + "%<p>";
  writeWeatherDetails += "<p>Wind: " + todayWeatherDetails.wind.speed + " mph<p>";
  todayWeatherField.append(writeWeatherDetails);
};

