import { fetchWeatherApi } from 'openmeteo';

const params = {
    "latitude": 51.5085,
    "longitude": -0.1257,
    "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "daylight_duration", "sunshine_duration", "precipitation_hours"],
    "models": "ukmo_seamless"
};
const url = "https://api.open-meteo.com/v1/forecast";

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function fetchWeatherData() {
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

        const daily = response.daily()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
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

        // `weatherData` now contains a simple structure with arrays for datetime and weather data
        for (let i = 0; i < weatherData.daily.time.length; i++) {
            console.log(
                weatherData.daily.time[i].toISOString(),
                weatherData.daily.weatherCode[i],
                weatherData.daily.temperature2mMax[i],
                weatherData.daily.temperature2mMin[i],
                weatherData.daily.sunrise[i],
                weatherData.daily.sunset[i],
                weatherData.daily.daylightDuration[i],
                weatherData.daily.sunshineDuration[i],
                weatherData.daily.precipitationHours[i]
            );
        }

        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}