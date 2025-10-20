if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

const OPENWEATHER_API_KEY = "fd45af88bc5343154a05dfc20d8b515e"; 

const DEFAULT_CITY = "Windhoek,NA";

const $ = (id) => document.getElementById(id);
const timeEl = $("time");
const dateEl = $("date");
const countdownEl = $("countdown");
const holidaysListEl = $("holidays-list");

const tempEl = $("temp");
const conditionsEl = $("conditions");
const locationEl = $("location");
const feelsLikeEl = $("feelslike");
const weatherIconEl = $("weather-icon");

function updateClock(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");
  const ss = String(now.getSeconds()).padStart(2,"0");
  timeEl.textContent = `${hh}:${mm}:${ss}`;

  const options = { weekday: "long", year:"numeric", month:"short", day:"numeric" };
  dateEl.textContent = now.toLocaleDateString(undefined, options);
}
setInterval(updateClock, 1000);
updateClock();

function getNextSaturdayMidnight(){
  const now = new Date();
  const today = now.getDay();
  let daysUntilSat = (6 - today + 7) % 7;
  if (daysUntilSat === 0){
    daysUntilSat = 7;
  }
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSat);
  target.setHours(0,0,0,0);
  return target;
}
let weekendTarget = getNextSaturdayMidnight();

function updateCountdown(){
  const now = new Date();
  const diff = weekendTarget - now;
  if (diff <= 0){
    weekendTarget = getNextSaturdayMidnight();
  }
  const totalSeconds = Math.floor((weekendTarget - now) / 1000);
  const days = Math.floor(totalSeconds / (3600*24));
  const hours = Math.floor((totalSeconds % (3600*24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

async function loadHolidays(){
  try{
    const resp = await fetch("holidays.json");
    if (!resp.ok) throw new Error("holidays.json not found");
    const data = await resp.json();
    renderHolidays(data.holidays || []);
  }catch(err){
    const sample = [
      { name: "Independence Day", date: "2025-03-21" },
      { name: "New Year's Day", date: "2026-01-01" }
    ];
    renderHolidays(sample);
  }
}
function renderHolidays(list) {
  const now = new Date();
  const todayStart = new Date(now);  // Create a copy to avoid modifying now
  todayStart.setHours(0, 0, 0, 0);
  const todayHolidays = list.filter(h => new Date(h.date).toDateString() === todayStart.toDateString());
  if (todayHolidays.length > 0) {
    const banner = document.createElement('div');
    banner.className = 'holiday-banner';
    banner.textContent = `Today: ${todayHolidays.map(h => h.name).join(', ')} 🎉`;
    document.querySelector('.holidays-card').prepend(banner);
  }

  const parsed = list.map(h => ({...h, dt: new Date(h.date)}))
                     .filter(h => h.dt >= todayStart)
                     .sort((a, b) => a.dt - b.dt);

  holidaysListEl.innerHTML = "";
  if (parsed.length === 0) {
    holidaysListEl.innerHTML = "<li>No upcoming holidays in the data.</li>";
    return;
  }

  parsed.slice(0, 6).forEach(h => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.innerHTML = `<strong>${h.name}</strong><div class="small-text">${h.dt.toLocaleDateString()}</div>`;
    const daysAway = Math.ceil((h.dt - todayStart) / (1000 * 3600 * 24));
    const right = document.createElement("div");
    right.className = "small-text";
    right.textContent = daysAway >= 0 ? `${daysAway} day(s)` : "passed";  // Will always be >=0 due to filter
    li.appendChild(left);
    li.appendChild(right);
    holidaysListEl.appendChild(li);
  });
}
loadHolidays();

async function fetchWeatherByCoords(lat, lon){
  if (!OPENWEATHER_API_KEY){
    // fallback mock
    renderWeatherMock();
    return;
  }
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("weather api error");
    const data = await resp.json();
    renderWeatherFromAPI(data);
  }catch(e){
    console.warn("Weather fetch failed:", e);
    renderWeatherMock();
  }
}

async function fetchWeatherByCity(city){
  if (!OPENWEATHER_API_KEY){
    renderWeatherMock();
    return;
  }
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("weather api error");
    const data = await resp.json();
    renderWeatherFromAPI(data);
  }catch(e){
    console.warn("Weather fetch by city failed:", e);
    renderWeatherMock();
  }
}

function renderWeatherFromAPI(data){
  const t = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  tempEl.textContent = `${t}°C`;
  feelsLikeEl.textContent = `Feels like: ${feels}°C`;
  conditionsEl.textContent = `${data.weather[0].description}`;
  locationEl.textContent = `Location: ${data.name}, ${data.sys.country}`;
  const iconCode = data.weather[0].icon;
  const emoji = weatherEmojiFromCode(iconCode, data.weather[0].main);
  weatherIconEl.textContent = emoji;
}

function weatherEmojiFromCode(icon, main){
  if (icon.startsWith("01")) return "☀";
  if (icon.startsWith("02")) return "🌤";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧";
  if (icon.startsWith("11")) return "⛈";
  if (icon.startsWith("13")) return "❄";
  if (icon.startsWith("50")) return "🌫";
  // fallback by main
  const map = {
    Clear: "☀", Clouds: "☁", Rain: "🌧", Snow: "❄", Thunderstorm: "⛈", Drizzle: "🌦", Mist: "🌫"
  };
  return map[main] || "🌤";
}

function renderWeatherMock(){
  tempEl.textContent = `22°C`;
  conditionsEl.textContent = `Partly cloudy`;
  locationEl.textContent = `Location: ${DEFAULT_CITY}`;
  feelsLikeEl.textContent = `Feels like: 21°C`;
  weatherIconEl.textContent = "⛅";
}

if ("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    err => { console.warn("geolocation denied", err); fetchWeatherByCity(DEFAULT_CITY); },
    { timeout: 6000 }
  );
} else {
  fetchWeatherByCity(DEFAULT_CITY);
}

setInterval(()=>{
  timeEl.style.transform = "scale(1.02)";
  setTimeout(()=> timeEl.style.transform = "", 250);
}, 60*1000);

const cityForm = document.getElementById('city-form');
cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('city-input').value || DEFAULT_CITY;
  fetchWeatherByCity(city);
});

const toggle = document.getElementById('dark-mode-toggle');
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', toggle.checked);
  localStorage.setItem('darkMode', toggle.checked);
});
// Load from storage
if (localStorage.getItem('darkMode') === 'true') {
  toggle.checked = true;
  document.body.classList.add('dark');
}