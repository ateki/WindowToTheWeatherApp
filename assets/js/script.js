console.log(`loading script.js`);

const NUM_DAYS_FORECAST = 5;
const NUM_FORECAST_PER_DAY = 1;


const apiKey = `7a3ba353070516aa0494967721651d31`;

const baseDataURL = `https://api.openweathermap.org/data/2.5/`;
const baseImgURL = `https://openweathermap.org/img/`;

/* const baseURL = `https://api.openweathermap.org/data/2.5/`; */

const currentWeatherURL = `${baseDataURL}weather?appid=${apiKey}&units=metric&cnt=${NUM_FORECAST_PER_DAY}&`;
const forecastURL = `${baseDataURL}forecast?appid=${apiKey}&units=metric&`;
const weatherIconURL = `${baseImgURL}w/`;
 



/* Data request URLs:
	1. Current weather for a city: https://api.openweathermap.org/data/2.5/weather?appid=YOUR_API_KEY&units=metric&q=CITY_NAME
	2. Forecast weather for a location: https://api.openweathermap.org/data/2.5/forecast?appid=YOUR_API_KEY&units=metric&lat=LATITUDE_VALUE&lon=LONGITUDE_VALUE
    3.Weather Icon URL: https://openweathermap.org/img/w/ + ICON_ID + .png
 */


/**
 *  Query Selectors 
 */

// grab html elements by id
var searchBtn = $("#search-button"); // document.querySelector("#search-button");
var searchInput = $("#search-input"); // document.querySelector("#search-input");

var historyListGroup = $("#history");

var todaySection = $("#today");
var forecastSection = $("#forecast");


// display weather data
function getWeatherData(event) {
    console.log(`getWeather data triggered on search click`);

    event.preventDefault();

    var searchCity = searchInput.val().trim().toLowerCase(); // using jquery
    // .trim().toLowerCase()

    //validate not empty
    if (searchCity) { // not falsey = empty string is falsey searchText !==''
        console.log(`searchCity = $searchCity`);

    }

    console.log(`search weather request for ${searchCity}`)
    displayCurrentWeather(searchCity); // temp hardcode for now
    display5DayForecast();


        // update local storage
        //updateLocalStorage();  proj

        // refresh the page
        //location.reload(true); proj
}

// retrieve from local storage - see seperate class...or create obj for...
function displayHistory() {

    console.log(`displayHistory...`);

}


const degrees = new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: 'celsius',
  });
  



               /*  Temp2: ${degrees.format(${currTemp}))  */
// by city
// TODO rename getCurrentWeather 
function displayCurrentWeather(cityName) {
    console.log(`displayCurrentWeather( ${cityName})`);

    

    console.log(degrees.format(22));
 
    
    $.get(currentWeatherURL + `q=${cityName}`)
        .then(function(currWeather) {
            console.log(currWeather); // currWeather weather

            console.log(`*${currWeather.main.temp}`);

            var currTemp =  Math.round(currWeather.main.temp);
            console.log(degrees.format(Math.round(currTemp)));

            console.log(`
                Temp1: ${degrees.format(Math.round(currWeather.main.temp))}  
                Feels Like: ${degrees.format(Math.round(currWeather.main.feels_like))}
                Humidity: ${currWeather.main.humidity}%
                Wind: ${currWeather.wind.speed} KPH
                Icon: ${currWeather.weather[0].icon}
                IconDescription: ${currWeather.weather[0].description} icon for image alt tag
                IconURL: ${weatherIconURL + currWeather.weather[0].icon} + .png
            `);
                /* main.object
                    main.temp
                    main.feels_like
                    main.humidity
                        wind.speed
                 */
                // TODO call displayCurrentWeather
                // Then call getForecast

                // THEN change to MAKE MORE ADVANCED REQUEST

            $.get(forecastURL + `lat=${currWeather.coord.lat}&lon=${currWeather.coord.lon}`)
                .then(function(forecastData) {
                        console.log(forecastData);
                        // loop over forecastData.list array pull data for 5 days
                        
                        // TODO Need to search for 5 whole data... 
                       /*  for(let i=0; i< NUM_DAYS_FORECAST; i++) { */
                       for (var forecastObj of forecastData.list) {
                            console.log(`${weatherIconURL + forecastObj.weather[0].icon} + .png`);

                           /*  let currForecast = forecastData.list[i]; */
                            console.log(forecastObj);

                            console.log(`
                                    Date: ${forecastObj.dt_txt} 
                                    Temp2: ${Math.round(forecastObj.main.temp)}  
                                    Temp: ${degrees.format(Math.round(forecastObj.main.temp))} 
                                    Feels Like: ${degrees.format(Math.round(forecastObj.main.feels_like))}
                                    Humidity: ${forecastObj.main.humidity}% 
                                    Wind: ${forecastObj.wind.speed} KPH
                                    Icon: ${forecastObj.weather[0].icon}
                                    IconURL: ${weatherIconURL + forecastObj.weather[0].icon} + .png
                                    IconDescription: ${forecastObj.weather[0].description} icon for image alt tag
                            `);

                          /*   let weatherIconId = currForecast.weather[0].icon;   //use this

                            console.log(`URL = ${weatherIconURL} + ${weatherIconId} + .png`); */

               /*              $.get(`${weatherIconURL}${weatherIconId}.png`)
                            .then(function(data) {
                                    console.log(data);
                                    // loop over forecastData.list array pull data for 5 days


                                    //weatherIcon
                            }); */
                         

                            //todo: fILTER OUIT 5 DAYS
                        }

                    });

           
             } );
}


/* $.each(data.list, function(index, val) {
    wf += "<p>" // Opening paragraph tag
    wf += "<b>Day " + index + "</b>: " // Day
    wf += val.main.temp + "&degC" // Temperature
    wf += "<span> | " + val.weather[0].description + "</span>"; // Description
    wf += "<img src='https://openweathermap.org/img/w/" + val.weather[0].icon + ".png'>" // Icon
    wf += "</p>" // Closing paragraph tag
  });
 */

// by location
function display5DayForecast(location) {
    console.log(`display5DayForecast...`);
}
// by id - utility func
function retrieveWeatherIcon(id) {
    console.log(`retrieveWeatherIcon...`);
}

function setupEventListeners() {
    console.log(`event listeners setup...`);

    //searchInput.addEventListener('click', getCurrentWeather);
    searchBtn.click(getWeatherData);
}


function init() {
    setupEventListeners();
    displayHistory();
}

//key: e578f69e
//  http://www.omdbapi.com/?i=tt3896198&apikey=e578f69e


init();