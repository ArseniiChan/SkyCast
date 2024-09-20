const key = '889dc49fc2e8fefb60e52c82b0e9309d';


async function search(ev) {
    const phrase = document.querySelector('input[type="text"]').value;
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
    const data = await response.json();
    const ul = document.querySelector('form ul');
    ul.innerHTML = ''; // Clear previous results
    for (let i = 0; i < data.length; i++) {
        const {name,lat,lon,country} = data[i];
        ul.innerHTML += `<li 
        data-lat="${lat}" 
        data-lon="${lon}" 
        data-name="${name}">
        ${name} <span>${country}</span></li>`;
    }
}
// Debounced search function to limit API calls
const debouncedSearch = _.debounce(() => {
    search();
}, 600);

async function showWeather(lat,lon,name) {
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
const data = await response.json();
const temp = Math.round(data.main.temp);
const feelsLike = Math.round(data.main.feels_like);
const humidity = Math.round(data.main.humidity);
const wind = Math.round(data.wind.speed);
const icon = data.weather[0].icon;

// Update weather UI with fetched data
document.getElementById('city').innerHTML = name;
document.getElementById('degrees').innerHTML = temp + '&#8451;';
document.getElementById('feelsLikeValue').innerHTML = feelsLike + '<span>&#8451;</span>';
document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

// Hide form and display weather info
document.querySelector('form').style.display = 'none';
document.getElementById('weather').style.display = 'block';
}

// Trigger search on keyup with debouncing
document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

// Handle list item click to fetch and show weather data
document.body.addEventListener('click', ev => {
    const li = ev.target;
    const {lat,lon,name} = li.dataset;
    // Store selected city data in localStorage
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    localStorage.setItem('name', name);
    if (!lat) {
        return;
    }
    showWeather(lat,lon,name);
});

// Show form to change city
document.getElementById('change').addEventListener('click', () => {
    document.getElementById('weather').style.display = 'none';
    document.querySelector('form').style.display = 'block';
});

// Load saved city from localStorage on page load
document.body.onload = () => {
    if (localStorage.getItem('lat')) {
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        showWeather(lat, lon, name)
    }
};
