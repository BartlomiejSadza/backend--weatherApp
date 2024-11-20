import express, { Request, Response } from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Siema z backendu w TypeScript!');
});

app.listen(PORT, () => {
    console.log(`Serwer hula na porcie ${PORT}`);
});