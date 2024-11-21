import { fetchWeatherApi } from 'openmeteo';
// Helper function to form time ranges
const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
export async function fetchWeatherData(lat, lon) {
    const params = {
        "latitude": lat,
        "longitude": lon,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "daylight_duration", "sunshine_duration", "precipitation_hours"],
        "models": "ukmo_seamless"
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    try {
        console.log('Fetching weather data...');
        const responses = await fetchWeatherApi(url, params);
        console.log('API response:', responses);
        const response = responses[0];
        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();
        const daily = response.daily();
        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                weatherCode: daily.variables(0)?.valuesArray() ?? [],
                temperature2mMax: daily.variables(1)?.valuesArray() ?? [],
                temperature2mMin: daily.variables(2)?.valuesArray() ?? [],
                sunrise: daily.variables(3)?.valuesArray() ?? [],
                sunset: daily.variables(4)?.valuesArray() ?? [],
                daylightDuration: daily.variables(5)?.valuesArray() ?? [],
                sunshineDuration: daily.variables(6)?.valuesArray() ?? [],
                precipitationHours: daily.variables(7)?.valuesArray() ?? [],
            },
        };
        // Szacowanie wygenerowanej energii w kWh
        const installationPower = 2.5; // kW
        const panelEfficiency = 0.2; // 20%
        const estimatedEnergy = weatherData.daily.daylightDuration.map((duration, index) => {
            const hoursOfdaylight = duration / 3600;
            return installationPower * hoursOfdaylight * panelEfficiency;
        });
        // zwracanie wymaganych parametrów dla endpointu nr.1
        const result = weatherData.daily.time.map((date, index) => ({
            date: date.toISOString(),
            weatherCode: weatherData.daily.weatherCode[index],
            temperature2mMax: weatherData.daily.temperature2mMax[index],
            temperature2mMin: weatherData.daily.temperature2mMin[index],
            estimatedEnergy: estimatedEnergy[index]
        }));
        console.log('Weather data:', result);
        return result;
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
/**
 * {
"date": "2024-11-20T00:00:00.000Z",
"weatherCode": 3,
"temperature2mMax": 5.550000190734863,
"temperature2mMin": -0.25,
"estimatedEnergy": 4.304243087768555
},
 */ 
