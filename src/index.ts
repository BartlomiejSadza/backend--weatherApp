import express, { Request, Response } from 'express';
import { fetchWeatherData } from './fetchApi.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Siema z backendu w TypeScript!');
});

app.get('/weather', async (req: Request, res: Response) => {
    try {
        const weatherData = await fetchWeatherData();
        res.json(weatherData);
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(PORT, () => {
    console.log(`Serwer hula na porcie ${PORT}`);
});