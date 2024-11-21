import express, { Request, Response } from 'express';
import { fetchWeatherData as fetchWeatherData1 } from './endpoint1.js';
import { fetchWeatherData as fetchWeatherData2 } from './endpoint2.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Siema z backendu w TypeScript!');
});

app.get('/endpoint1', async (req: Request, res: Response) => {
    const { lat, lon } = req.query;
    try {
        console.log('Received request for /endpoint1');
        const weatherData = await fetchWeatherData1(Number(lat), Number(lon));
        res.json(weatherData);
    } catch (error) {
        console.error('Error in /endpoint1 endpoint:', error);
        res.status(500).send('Error fetching endpoint1 data');
    }
});

app.get('/endpoint2', async (req: Request, res: Response) => {
    const { lat, lon } = req.query;
    try {
        console.log('Received request for /endpoint2');
        const weatherData = await fetchWeatherData2(Number(lat), Number(lon));
        res.json(weatherData);
    } catch (error) {
        console.error('Error in /endpoint2 endpoint:', error);
        res.status(500).send('Error fetching endpoint2 data');
    }
});

app.listen(PORT, () => {
    console.log(`Serwer hula na porcie ${PORT}`);
});