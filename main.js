const cityNameElement = document.querySelector('[data-js-city-name]')
const dateInfoElement = document.querySelector('[data-js-date-info]')

const weatherInfoDegreesElement = document.querySelector('[data-js-weather-info-degrees]')
const weatherInfoStateElement = document.querySelector('[data-js-weather-info-state]')
const weatherIconElement = document.querySelector('[data-js-weather-icon]')

const specWindSpeedElement = document.querySelector('[data-js-spec-wind-speed]')
const specHumidityElement = document.querySelector('[data-js-spec-humidity]')

const inputElement = document.querySelector('[data-js-input]')

const API_KEY = '77a2634227d5601e37e08ed31b2f713b'
const LOCAL_KEY = 'local-key'

dateInfoElement.textContent = getDate()

let cityWeather = {}

inputElement.addEventListener('keypress', async (e) => {
    if(e.key === "Enter"){
        e.preventDefault()

        if (inputElement.value.trim()) {
            const cityName = inputElement.value
            
            try {
                cityWeather = await getCurrentInfo(cityName)
                
                render()

            } catch (error) {
                alert('Город не найден или произошла ошибка')
                console.error(error)
            }

            inputElement.value = ''
        }    
    }
})

function render() {
    cityNameElement.textContent = cityWeather.cityName
    weatherInfoDegreesElement.textContent = cityWeather.temp
    specWindSpeedElement.textContent = cityWeather.windSpeed
    specHumidityElement.textContent = cityWeather.humidity
    weatherInfoStateElement.textContent = cityWeather.state
    weatherIconElement.src = cityWeather.weatherIcon
}

// function saveToLocalStorage() {
//     if(cityWeather)
//     localStorage.setItem(LOCAL_KEY, JSON.stringify(cityWeather))
// }

// function getFromLocalStorage() {
//     const rawData = localStorage.getItem(LOCAL_KEY)
//     if(rawData) cityWeather = JSON.parse(rawData)
// }

function getDate() {
    const date = new Date()

    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', {month: "short"})
    const weekday = date.toLocaleDateString('en-US', {weekday: "short"})

    return `${weekday}, ${day} ${month}`
}

function getWeatherType(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'foggy.svg'
    if (id === 800) return 'clear.svg'
    if (id <= 804) return 'cloud.svg'
    else return 'clear.svg'
}

async function getCurrentInfo(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
    
    if (!response.ok) {
        throw new Error('Город не найден')
    }
    
    const data = await response.json()
    console.log(data)
    
    return {
        cityName: data.name,
        temp: `${Math.round(data.main.temp)} °C`,
        humidity: data.main.humidity + ' %',
        windSpeed: data.wind.speed + ' m/s',
        state: data.weather[0].main,
        weatherIcon: getWeatherType(data.weather[0].id)
    }
}


    

