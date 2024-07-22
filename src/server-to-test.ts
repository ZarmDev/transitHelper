import express from 'express';
// import cors from 'cors';
import fs from 'fs/promises'
import * as tH from './index.js'

const app = express();
const PORT = 8082;

export async function writeToFile(filename: string, content: string) {
    try {
        await fs.writeFile(filename, content);
    } catch (err) {
        console.error('Error:', err);
    }
}

app.get('/serviceAlerts', async (req, res) => {
    try {
        const alerts = await tH.getTrainServiceAlerts(false);
        res.json(alerts);
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
});


app.get('/realtimeTrainData', async (req, res) => {
    try {
        // to test
        const targetStopID = '112'
        const line = '1'
        const direction = ""
        const date = Date.now()
        const realtime = await tH.getTrainArrivals(line, targetStopID, date, direction);
        res.json(realtime);
    } catch (error) {
        // Huh?!? AI said you could do this which I never knew...
        const e = error as Error;
        res.status(500).send(e.message);
    }
});

app.get('/getAllTrainStops', async (req, res) => {
    try {
        // to test
        const data = await fs.readFile("./assets/trains/google_transit/stops.txt", 'utf-8')
        const realtime = await tH.getAllTrainStopCoordinates(data);
        res.json(realtime);
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
});

app.get('/getTrainLineShapes',  async (req, res) => {
    try {
        // to test
        const data = await fs.readFile("./assets/trains/google_transit/shapes.txt", 'utf-8')
        const realtime = await tH.getTrainLineShapes(data);
        res.json(realtime[1]);
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});