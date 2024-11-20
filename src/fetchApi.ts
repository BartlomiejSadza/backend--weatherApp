import { fetchWeatherApi } from 'openmeteo';
	
const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"hourly": "temperature_2m"
};
const url = "https://api.open-meteo.com/v1/forecast";

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function fetchWeatherData() {
    // Process first location. Add a for-loop for multiple locations or weather models
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();
    
    const hourly = response.hourly()!;
    
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        timezone,
        timezoneAbbreviation,
        latitude,
        longitude,
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
        },
    };

    return weatherData;
}
