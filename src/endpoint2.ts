import { fetchWeatherApi } from 'openmeteo';

const params = {
    "latitude": 51.5085,
    "longitude": -0.1257,
    "hourly": "pressure_msl",
    "daily": ["temperature_2m_max", "temperature_2m_min", "daylight_duration", "precipitation_hours", "wind_speed_10m_max"],
    "timezone": "auto",
    "models": "ukmo_seamless"
};
const url = "https://api.open-meteo.com/v1/forecast";

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function fetchWeatherData() {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            pressureMsl: hourly.variables(0)!.valuesArray()!,
        },
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(0)!.valuesArray()!,
            temperature2mMin: daily.variables(1)!.valuesArray()!,
            daylightDuration: daily.variables(2)!.valuesArray()!,
            precipitationHours: daily.variables(3)!.valuesArray()!,
            windSpeed10mMax: daily.variables(4)!.valuesArray()!,
        },
    };

    // obliczanie tygodniowego podsumowania 
    const averagePressure = weatherData.hourly.pressureMsl.reduce((acc, v) => acc += v, 0) / weatherData.hourly.pressureMsl.length;
    const averageSunshineDuration = weatherData.daily.daylightDuration.reduce((acc, v) => acc += v, 0) / weatherData.daily.daylightDuration.length;
    const maxTemperature = Math.max(...weatherData.daily.temperature2mMax);
    const minTemperature = Math.min(...weatherData.daily.temperature2mMin);
    const precipitationDays = weatherData.daily.precipitationHours.filter(hours => hours > 0).length;
    const weatherSummary = precipitationDays > 3 ? 'z opadami' : 'bez opadów';

    // wiatr do dodania i inne parametry do 'summary'
    const summary = {
        averagePressure,
        averageSunshineDuration,
        maxTemperature,
        minTemperature,
        precipitationDays,
        weatherSummary
    }
    console.log('Tygodniowe podsumowanie:', summary);
    return summary;
}