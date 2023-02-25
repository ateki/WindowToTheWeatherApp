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


const degrees = new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: 'celsius',
  });
  

/** ----------------------------------------
 * Functions to  dynamically generate and/or 
 * update HTML and customise css.
 -------------------------------------------*/

/**
 * Utility Functions
 */

/**
 * Sets up the element not to be shown:
 * - using bootstrap and so adds 'invisible' to the element's classlist not hide.
 * Note function will not impact any other classes that are currently on the element
 * and so multi classes should be allowed along with the 'hide'.
 * No dupes are possible as classlist represents set of tokens it will only hold unique items.
 * @param {*} element
 */
function hide(element) {
    element.addClass('invisible');
  }
  
  /**
   * Ensures class of element no longer includes 'visible'.
   * - using bootstrap and so adds 'visible' to the element's classlist not show.
   * Note function will only remove 'hide' class and have no impact on any other classes
   * that are currently on the element before function call.
   * @param {*} element
   */
  function show(element) {
    element.removeClass('invisible');
  }


 


/**
 * Display functions - add to DOM
 */

/**
 * Reads user's search city input and paceRetrieve open weather data (current weather and forecast) for city being searched.
 * @param {*} event 
 */
// Rename showWeatherByCity   loadWeatherByCity???
function getWeatherByCity(event) {
    event.preventDefault();
    
    console.log(`getWeatherByCity: ${searchCity}`);
    
    // Validate user's input - search criteria 
    var searchCity = searchInput.val().trim().toLowerCase(); 
    if (! searchCity) { // not falsey = empty string is falsey searchText !==''
        alert('please enter a city name');
        // TODO: Display alert /modal or display message no city provided..choose if alert or on page to display error
        //recipeResultsSection.html('<p class="no-search" >Please enter a city to retrieve daa for. </p>');
        return;
    }
    

    // retrieve todays weather by city
    $.get(currentWeatherURL + `q=${searchCity}`)
        .then(function (todaysWeatherData) {

                injectTodaysWeather(todaysWeatherData); 

                // retrieve 5 day forecast for city
                let longitude = todaysWeatherData.coord.lon;
                let latitude = todaysWeatherData.coord.lat;
                $.get(forecastURL + `lat=${latitude}&lon=${longitude}`)
                    .then(function(forecast5DayData) {
                            // loop over forecastData.list array pull data for 5 days
                            // TODO Grab only 5 days - 1 forecast per day.
                            // Poss display hi and low of day?
                            
                            // for(let i=0; i< NUM_DAYS_FORECAST; i++) {
                            for (var forecastObj of forecast5DayData.list) {
                               
                                console.log(`Galling injectDayForecast with city=${searchCity} forecastObj=${forecastObj}`);
                                injectDayForecast(searchCity, forecastObj);
                            }
                    })
        })

    
} 
             



/**
 * 
 * @param {*} currWeather  - matched object from api search, representing today's weather given search criteria
 */
function injectTodaysWeather(currWeather) {
    // Parses result data from api and generates 
    // matchObj = matched results from api call weather cureent matching city


    if (!currWeather) {
        todaySection.html('<p class="no-search" >No weather information found</p>');
        return;
    }

    console.log(currWeather); 
    console.log(`
        City: ${currWeather.main.name}    
        Temp1: ${degrees.format(Math.round(currWeather.main.temp))}  
        Feels Like: ${degrees.format(Math.round(currWeather.main.feels_like))}
        Humidity: ${currWeather.main.humidity}%
        Wind: ${currWeather.wind.speed} KPH
        Icon: ${currWeather.weather[0].icon}
        Lat: ${currWeather.coord.lat}
        Lon: ${currWeather.coord.lon}
        IconDescription2: ${currWeather.weather[0].description} icon for image alt tag
        IconURL2: ${weatherIconURL + currWeather.weather[0].icon}.png
    `);

  

    let todaysDate = moment().format('DD/MM/YYYY')
    todaySection.append(`
        <div  class="card-body" style="width: 18rem;">

            <h5 class="card-title">
                ${currWeather.name} (${todaysDate}) 
                <img src="${weatherIconURL + currWeather.weather[0].icon}.png" alt="${currWeather.weather[0].description}" class="weather-img">
            </h5>
            <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
            <p class="card-text">Temp: ${degrees.format(Math.round(currWeather.main.temp))}  </p>
            
            <p class="card-text">Feels like: ${degrees.format(Math.round(currWeather.main.feels_like))}</p>
            <p class="card-text">Wind: ${currWeather.wind.speed} KPH</p>
            <p class="card-text">Humidity: ${currWeather.main.humidity}%</p>
        </div>
    `);
    
  show(todaySection);

}


/**
 * Generate Day Forecast Card  generateDayForecast Card
 * Inject into forecastSection
 * @param forecastObj - data object representing one day's forecast
 */
//injectDayForecast
function injectDayForecast(cityName, forecastObj) {
    console.log(`injectDayForecast calling city=${cityName} forecastObj=${forecastObj}`);
            
    console.log(`
            Date: ${forecastObj.dt_txt} 
            Temp2: ${Math.round(forecastObj.main.temp)}  
            Temp: ${degrees.format(Math.round(forecastObj.main.temp))} 
            Feels Like: ${degrees.format(Math.round(forecastObj.main.feels_like))}
            Humidity: ${forecastObj.main.humidity}% 
            Wind: ${forecastObj.wind.speed} KPH
            Icon: ${forecastObj.weather[0].icon}
            IconURL: ${weatherIconURL + forecastObj.weather[0].icon}.png
            IconDescription: ${forecastObj.weather[0].description} icon for image alt tag
    `);

    let forecastDate = moment(`${forecastObj.dt_txt}`).format('DD/MM/YYYY')
    forecastSection.append(`
        <div class="card">
                <div class="card-body">
                    <h5 class="card-title">
                        ${forecastObj.name} (${forecastDate} ) 
                        <img src="${weatherIconURL + forecastObj.weather[0].icon}.png" alt="${forecastObj.weather[0].description}" class="weather-img">
                    </h5>
                    <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
                    <p class="card-text">Temp: ${degrees.format(Math.round(forecastObj.main.temp))}  </p>
                    <p class="card-text">Feels like: ${degrees.format(Math.round(forecastObj.main.feels_like))}</p>
                    <p class="card-text">Wind: ${forecastObj.wind.speed} KPH</p>
                    <p class="card-text">Humidity: ${forecastObj.main.humidity}%</p>
                </div>
        </div>
    `);

    show(forecastSection);
  
}


/*             display5DayForecast(todaysWeatherData.coord.lat, todaysWeatherData.coord.lon);
*/

// TODO .error
        // update local storage
        //updateLocalStorage();  proj

        // refresh the page
        //location.reload(true); proj


// retrieve from local storage - see seperate class...or create obj for...

/**
 * Generates html for history buttons
 */
function displayHistory() {

    console.log(`displayHistory...`);

}



               /*  Temp2: ${degrees.format(${currTemp}))  */
// by city
// TODO rename getCurrentWeather 



/** ----------------------------------------
 * Functions to retrieve weather data from API 
 * and display
 * 
 -------------------------------------------*/


 function displayCurrentWeather(cityName) {

    console.log(`displayCurrentWeather( ${cityName})`);


    console.log(degrees.format(22));
 
    
    $.get(currentWeatherURL + `q=${cityName}`)
        .then(function(currWeather) {
            console.log(currWeather); 
  /*           console.log(currWeather); 
            var currTemp =  Math.round(currWeather.main.temp);
            console.log(degrees.format(Math.round(currTemp))); */

            //TODO: Check data returned and no error
            // add .error

            console.log(`
                City: ${currWeather.main.name}    
                Temp1: ${degrees.format(Math.round(currWeather.main.temp))}  
                Feels Like: ${degrees.format(Math.round(currWeather.main.feels_like))}
                Humidity: ${currWeather.main.humidity}%
                Wind: ${currWeather.wind.speed} KPH
                Icon: ${currWeather.weather[0].icon}
                Lat: ${currWeather.coord.lat}
                Lon: ${currWeather.coord.lon}
                IconDescription2: ${currWeather.weather[0].description} icon for image alt tag
                IconURL2: ${weatherIconURL + currWeather.weather[0].icon}.png
            `);

            console.log(`
                lat = ${currWeather.coord.lat}
                lon = ${currWeather.coord.lon}`);
                console.log(currWeather);

            show(todaySection);

                // THEN change to MAKE MORE ADVANCED REQUEST

    } );
}

// by location
// call get5DayForecast  -> display5DayForecast
// call getTodaysForecast -> displayTOdaysForecast
//              also calls get5DayForecat
function display5DayForecast(lat, lon) {
    console.log(`display5DayForecast...`);
    console.log(`
        lat = ${lat}
        lon=${lon}`);

    
    $.get(forecastURL + `lat=${lat}&lon=${lon}`)
    .then(function(forecastData) {
            console.log(forecastData);
            // loop over forecastData.list array pull data for 5 days
            
            // TODO Need to search for 5 whole data... 
           // for(let i=0; i< NUM_DAYS_FORECAST; i++) {
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
                        IconURL: ${weatherIconURL + forecastObj.weather[0].icon}.png
                        IconDescription: ${forecastObj.weather[0].description} icon for image alt tag
                `);
              
            }

    });

} // end display5DayForecast


/**
 * Retrives current weather for specified city and displays on page
 * @param { } cityName 
 */
function displayCurrentWeatherCombined(cityName) {

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
                       // for(let i=0; i< NUM_DAYS_FORECAST; i++) {
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
                         
                        }

                    });
             } );
}



// by id - utility func
function buildWeatherIconURL(id) {
    console.log(`retrieveWeatherIcon...`);
}




function displayCurrentWeatherCombined(cityName) {

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



function setupEventListeners() {
    console.log(`event listeners setup...`);

    //searchInput.addEventListener('click', getWeatherByCity);
    searchBtn.click(getWeatherByCity);
}

function clearResults() {

    todaySection.html('');
    forecastSection.html('');
    hide(todaySection);
    hide(forecastSection);

}


/** ----------------------------------------
 * Init onload functionality - to be triggered on page load.
 * -----------------------------------------*/

function init() {
    setupEventListeners();
    clearResults(); // ensure no results currently shown

    //TODO: displayHistory();
}




init();