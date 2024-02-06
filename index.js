// console.log('hello jee');
// const API_KEY="4ea50b9d1e21b8e148a19adab1ba94ca";
// function renderWeatherInfo(data){
//     let newPara=document.createElement('p');
//          newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
//          document.body.appendChild(newPara);
// }
//     async function fetchWeatherDetails(){
//         try {
//         let city="Goa";
//         let lat=22.5;
//         let lon=73.4;
//         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) ;
        
//         const data=await response.json();
//         console.log("weather data",data);
//         // let newPara=document.createElement('p');
//         // newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
//         // document.body.appendChild(newPara);
//         renderWeatherInfo(data);
//     }  
//  catch (err) {
//     console.log("error found",err);
// }
//     }
//     function getLocation(){
//         if(navigator.geolocation){
//             navigator.geolocation.getCurrentPosition(showPosition);
//         }
//         else{
//             console.log("no geolocation availabe")
//         }
//     }
//     function showPosition(position) {
//         let lat=position.coords.latitude;
// let lon=position.coords.longitude;
// console.log(lat);
// console.log(lon);
//     }

const userTab = document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAcessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//initially variable need
let currentTab=userTab;
const API_KEY ="4ea50b9d1e21b8e148a19adab1ba94ca";
currentTab.classList.add("current-tab");
//ek kAm pending woh neeche kra
getFromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        //a to b jana chahte h
        //color htana h
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
    }
    if(!searchForm.classList.contains("active")){
 userContainer.classList.remove("active");
 grantAcessContainer.classList.remove("active");
 searchForm.classList.add("active");
}
else{
    //main search wale tab pr tha 
    searchForm.classList.remove("active");
    userContainer.classList.remove("active");
    //ab main your weather tab m aagya hu weather bhi didsplay krna pdega so lets chceck local storage 
    //for coordinate , if we have saved them there
        getFromSessionStorage();
}
}
userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});
 function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates")
    if(!localCoordinates){
        //agr local coordinates nhi mile
grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
 }
 async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    //make grant access container invisible
grantAcessContainer.classList.remove("active");
loadingScreen.classList.add("active");
try {
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) ;
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    //jo bhi mara data bna h usse ys data m s value bna ktoh userinfo m add krega
    renderWeatherInfo(data);
} catch (err) {
    loadingScreen.classList.remove("active");
}
 }
 function renderWeatherInfo(weatherInfo){
    //firsty we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryName=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
//fetch value from weather info object and put it ui elements
cityName.innerText=weatherInfo?.name;
countryName.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText=weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText=`${weatherInfo?.main?.temp}°C`;
windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
humidity.innerText=`${weatherInfo?.main?.humidity}%`;
cloudiness.innerText=`${weatherInfo?.clouds?.all}`;


 }
 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert

    }
    function showPosition(position){
        const userCoordinates={
            lat:position.coords.latitude,
            lon:position.coords.longitude,
        }
        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);  
    }
 }

 const grantAcessButton=document.querySelector("[data-grantAcess]");
 grantAcessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    //default method ko hta deta h
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else
        fetchSearchWeatherInfo(cityName);
    
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("actve");
    grantAcessContainer.classList.remove("active");
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`) ;
        const data= await response.json();
        loadingScreen.classList.remove("active");
        renderWeatherInfo(data);

    } catch (err) {
        //hw
        console.log("exception ocuur",err);

    }
}