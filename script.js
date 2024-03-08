console.log("Jitenderchauhan2020@outlook.com");
//tabs
let yourWeatherTab = document.querySelector("[your-weather]");
let searchWeatherTab = document.querySelector("[search-weather]");

let submitForm = document.querySelector("[search-screen]");
let grantAccessBtn = document.querySelector(".grant-access-btn");

//screens
let searchScreen = document.querySelector("[search-screen]");
let grantAccessScreen = document.querySelector("[grant-access-screen]");
let loadingscreen = document.querySelector("[loading-screen]");
let userContainer = document.querySelector(".weather-container");
let userScreen = document.querySelector("[user-screen]");
let currentTab = yourWeatherTab;

let errorScreen = document.querySelector(".error-screen");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getFromLocalStorage();

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchScreen.classList.contains("active")){
            // stand in search screen 
            //visible the search screen
            userScreen.classList.remove("active");
            errorScreen.classList.remove("active");
            grantAccessScreen.classList.remove("active");
            searchScreen.classList.add("active");
        }else{
            //now stand in user  screen 
            // check is  corrdinates exist , if we haved saved them there.
            searchScreen.classList.remove("active");
            errorScreen.classList.remove("active");
            userScreen.classList.remove("active");
            getFromLocalStorage();
        }
    }
}

yourWeatherTab.addEventListener("click", ()=>{
    switchTab(yourWeatherTab)
});

searchWeatherTab.addEventListener("click", ()=>{
    switchTab(searchWeatherTab)
});

function getFromLocalStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //coordinates not found
        grantAccessScreen.classList.add("active");
    }else{
        //coordinates found
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessScreen.classList.remove("active");
    errorScreen.classList.remove("active");
    loadingscreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingscreen.classList.remove("active");
        userScreen.classList.add("active");
        renderWeatherData(data);
    }catch(e){
        loadingscreen.classList.remove("active");
        console.error("Api network issue " + e);
    }
}

function renderWeatherData(data){

    let cityName = document.querySelector("[city-name]");
    let countryflag = document.querySelector("[country-flag]");
    let weatherDesc = document.querySelector("[weather-desc]");
    let weatherIcon = document.querySelector("[weather-icon]");
    let temp = document.querySelector("[temprature]");
    let dataWindspeed = document.querySelector("[data-windspeed]");
    let dataHumidity = document.querySelector("[data-humidity]");
    let dataCloud = document.querySelector("[data-cloud]");

    cityName.innerText = data?.name;
    countryflag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temp.innerText = `${data?.main?.temp} °C`
    dataWindspeed.innerText = `${data?.wind?.speed} m/s`;
    dataHumidity.innerText = `${data?.main?.humidity}%`;
    dataCloud.innerText = `${data?.clouds?.all}%`;
}

function getCurrentPosition(position){
    
    const userCoordinates = {
        lat :position.coords.latitude,
        lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

function getCoordinates(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getCurrentPosition);
    }else{
        document.innerText = "Your browser doen't support geolaction features";
    }
}

grantAccessBtn.addEventListener("click", ()=>{
    getCoordinates();
});

const inputForm = document.querySelector(".input-form");
submitForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let city = inputForm.value;
    if(city == "")
        return;
    else{
        fetchCityWeather(city);
        inputForm.value = "";
    }
})


async function fetchCityWeather(city){
    // searchScreen.classList.remove("active");
    errorScreen.classList.remove("active");
    userScreen.classList.remove("active");
    loadingscreen.classList.add("active");
    grantAccessScreen.classList.remove("active");
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingscreen.classList.remove("active");
        userScreen.classList.add("active");

        let cod = data?.cod;
        if(cod == 404){
            console.log("error wala");
            userScreen.classList.remove("active");
            errorScreen.classList.add("active");
        }else{
            renderWeatherData(data);
        }
    }catch(err){
        
        console.error("undefined erroe");
    }
}



