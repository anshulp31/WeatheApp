const userTab=document.querySelector("[data-user-weather]");
const searchTab=document.querySelector("[data-search-weather]");
const userContainer=document.querySelector(".user-info");
const searchWeather=document.querySelector(".form-container");
const grantAccess=document.querySelector(".grant-location-container");
const loadingScreen=document.querySelector(".loading-cont");
const grantAccessBtn=document.querySelector("[grantAccess]");
const searchinput=document.querySelector("[search-input]");




let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchWeather.classList.contains("active")){
            userContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchWeather.classList.add("active");
        }
        else{
            searchWeather.classList.remove("active");
            userContainer.classList.remove("active");
            getFromSessionStorage();
        }

    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});


searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

//check coordinate present or not in sessionstorage
function getFromSessionStorage(){
    console.log("Eneter in get from session storage");
    const localCordinates=sessionStorage.getItem("user-Coordinate");
    if(!localCordinates){
        //localCordinates is not present
        grantAccess.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    console.log("enter in fetch weather info");
    let{lat,lon}=coordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    // API_CALL

    try{
           const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
           console.log(lat);
           console.log(lon);
           const data=await response.json();
           loadingScreen.classList.remove("active");

           userContainer.classList.add("active");

           renderInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderInfo(data){
    console.log("Enter in get render info");
    const city=document.querySelector("[data-city]");
    const countryIcon=document.querySelector("[data-country]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[weather-icon]");
    const temp=document.querySelector("[data-temp]");
    const windpeed=document.querySelector("[windspeed]");
    const humi=document.querySelector("[humidity]");
    const cloudiness=document.querySelector("[cloud]");

    //fetch values 
    
    city.innerText=data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.textContent=data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.textContent=`${data?.main?.temp} °C`;
    windpeed.innerText=`${data?.wind?.speed}m/s`;
    humi.innerText=`${data?.main?.humidity}%`;
    cloudiness.innerText=`${data?.clouds?.all}%`;
    


}


function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //Hw show an alert for no geolocatin support aavailable
    }
}
function showPosition(position) {
    const userCoordinate={
        
     lat : position.coords.latitude,
     lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-Coordinate",JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
}

grantAccessBtn.addEventListener('click',getLocation);

searchWeather.addEventListener('submit',(e)=>{
    e.preventDefault();
     let cityName=searchinput.value;
     if(cityName==="")
        return;
     else
         fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
     loadingScreen.classList.add("active");
     userContainer.classList.remove("active");
     grantAccess.classList.remove("active");

     try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userContainer.classList.add("active");
        renderInfo(data);
     }
     catch(err){

     }
}



