var apiKey = "4a4ba7986298497e8db193518201409";
var currentURL = `http://api.weatherapi.com/v1/current.json?key=${apiKey}`;
var forecastURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=`;

// current.condition.icon

function getData(fullURL) {
  $.get(fullURL, function (data) {
    // console.log(data);
    displayCurrentWeather(data);
    $("#message").addClass("hidden");
  }).catch(function (error) {
    console.log("BAD ZIP", error);
    $("#message").removeClass("hidden");
  });
}

function displayCurrentWeather(data) {
  $(".currentWeatherContent").html(
    ` <div class="weatherTop">

        <h3>Current Weather:</h3>
        <br>
        <h2>${data.location.name}, ${data.location.region}</h2>
        <p>${data.current.condition.text}</p>

        <div class="currentTemp">
          <h1>${data.current.temp_f}&deg;</h1>
          <img src="${data.current.condition.icon}">
        </div>

      </div>

      <div class="weatherBottom">
          <h4>Other Info:</h4>
          <div class="otherInfo">

            <div class="otherInfoLeft">
              <p>
                High: ${data.forecast.forecastday[0].day.maxtemp_f}&deg;
              </p>
              <p>
                Low:  ${data.forecast.forecastday[0].day.mintemp_f}&deg;
              </p>
              <p>
                Feels Like: ${data.current.feelslike_f}&deg;
              </p>
              <p> 
                Humidity: ${data.current.humidity}%
              </p>
              <p>
                Pressure: ${data.current.pressure_in} in
              </p>
            </div>

            <div class="otherInfoRight">
              <p>
                Visibility: ${data.current.vis_miles} mi
              </p>
              <p>
                Wind: ${data.current.wind_mph} mph ${data.current.wind_dir}
              </p>
              <p>
                UV Index: ${data.current.uv}
              </p>
              <p>
                Sunrise: ${data.forecast.forecastday[0].astro.sunrise}
              </p>
              <p>
                Sunset: ${data.forecast.forecastday[0].astro.sunset}
              </p> 
            </div>

          </div>
      </div>
      `
  );

  $(".day2").html(
    `
    <h2>${data.forecast.forecastday[0].date}</h2>
    <h1>${data.forecast.forecastday[0].day.maxtemp_f}&deg;</h1>
    <h3>${data.forecast.forecastday[0].day.mintemp_f}&deg;</h3>
    <img src="${data.forecast.forecastday[0].day.condition.icon}">
    <p><i class="fas fa-tint"></i> ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
    `
  );

  $(".day3").html(
    `
    <h2>${data.forecast.forecastday[1].date}</h2>
    <h1>${data.forecast.forecastday[1].day.maxtemp_f}&deg;</h1>
    <h3>${data.forecast.forecastday[1].day.mintemp_f}&deg;</h3>
    <img src="${data.forecast.forecastday[1].day.condition.icon}">
    <p><i class="fas fa-tint"></i> ${data.forecast.forecastday[1].day.daily_chance_of_rain}%</p>
    `
  );

  $(".day4").html(
    `
    <h2>${data.forecast.forecastday[2].date}</h2>
    <h1>${data.forecast.forecastday[2].day.maxtemp_f}&deg;</h1>
    <h3>${data.forecast.forecastday[2].day.mintemp_f}&deg;</h3>
    <img src="${data.forecast.forecastday[2].day.condition.icon}">
    <p><i class="fas fa-tint"></i> ${data.forecast.forecastday[2].day.daily_chance_of_rain}%</p>
    `
  );
}

function initListeners() {
  $("#getWeather").click(function () {
    let zip = $("#zipcode").val();
    let fullURL = forecastURL + zip + "&days=5";
    // console.log(fullURL);
    getData(fullURL);
  });
}

$(document).ready(function () {
  initListeners();
});
