import express from 'express';
import { fetchWeatherData as fetchWeatherData1 } from './endpoint1.js';
import { fetchWeatherData as fetchWeatherData2 } from './endpoint2.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Siema z backendu w TypeScript!');
});
const validateCoordinates = (lat, lon) => {
    const latitude = Number(lat);
    const longitude = Number(lon);
    return !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};
app.get('/endpoint1', async (req, res) => {
    const { lat, lon } = req.query;
    if (!validateCoordinates(lat, lon)) {
        res.status(400).send('Invalid latitude or longitude');
        return;
    }
    try {
        console.log('Received request for /endpoint1');
        const weatherData = await fetchWeatherData1(Number(lat), Number(lon));
        res.json(weatherData);
    }
    catch (error) {
        console.error('Error in /endpoint1 endpoint:', error);
        res.status(500).send('Error fetching endpoint1 data');
    }
});
app.get('/endpoint2', async (req, res) => {
    const { lat, lon } = req.query;
    if (!validateCoordinates(lat, lon)) {
        res.status(400).send('Invalid latitude or longitude');
        return;
    }
    try {
        console.log('Received request for /endpoint2');
        const weatherData = await fetchWeatherData2(Number(lat), Number(lon));
        res.json(weatherData);
    }
    catch (error) {
        console.error('Error in /endpoint2 endpoint:', error);
        res.status(500).send('Error fetching endpoint2 data');
    }
});
app.listen(PORT, () => {
    console.log(`Serwer hula na porcie ${PORT}`);
});
