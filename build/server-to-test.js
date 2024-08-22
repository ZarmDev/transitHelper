var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
// import cors from 'cors';
import fs from 'fs/promises';
import * as tH from './index.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = 8082;
const busApiKeyErrorMsg = "You need a bus api key to use this! Set yours in a .env file or if you haven't already get your bus api key (check README.md)";
export function writeToFile(filename, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.writeFile(filename, content);
        }
        catch (err) {
            console.error('Error:', err);
        }
    });
}
app.get('/serviceAlerts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alerts = yield tH.getTrainServiceAlerts(false);
        res.json(alerts);
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.get('/realtimeTrainData', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to test
        const targetStopID = 'D26';
        const line = 'Q';
        const direction = "";
        const date = Date.now();
        const realtime = yield tH.getTrainArrivals(line, targetStopID, date, direction);
        res.json(realtime);
    }
    catch (error) {
        // Huh?!? AI said you could do this which I never knew...
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.get('/realtimeBusData', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // information we have in stops.txt
        const targetStopID = '305217';
        // M2, M3, M4
        // this is NOT information in stops.txt, however, you can get it from 
        const line = 'MTA NYCT_B63';
        const direction = "";
        const date = Date.now();
        if (process.env.BUS_API_KEY) {
            const realtime = yield tH.getBusArrivals(line, targetStopID, date, direction, process.env.BUS_API_KEY);
            // if you only need some basic data and your lazy
            // console.log(realtime)
            // let result = await tH.extractVehicleInformation(realtime);
            // res.json(result);
            res.json(realtime);
        }
        else {
            console.error(busApiKeyErrorMsg);
        }
    }
    catch (error) {
        // Huh?!? AI said you could do this which I never knew...
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.get('/getAllTrainStops', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to test
        const data = yield fs.readFile("./assets/trains/google_transit/stops2.txt", 'utf-8');
        // const realtime = await tH.getAllTrainStopCoordinates(data);
        const realtime = tH.getAllTrainStopCoordinates(data.split('\n'));
        res.json(realtime);
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.get('/getAllBusStops', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to test, in manhattan
        const data = yield fs.readFile("./assets/buses/google_transit_manhattan/stops.txt", 'utf-8');
        // const realtime = await tH.getAllTrainStopCoordinates(data);
        const realtime = tH.getAllBusStopCoordinates(data.split('\n'));
        res.json(realtime);
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.get('/getTrainLineShapes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to test
        const data = yield fs.readFile("./assets/trains/google_transit/shapes.txt", 'utf-8');
        const realtime = yield tH.getTrainLineShapes(data.split('\n'));
        res.json(realtime);
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
}));
// NOTE: This is a way to get nearby bus stops, however
// it's much better to just use the MTA bus api (I didn't know when creating this)
// app.get('/getNearbyBusStops', async (req, res) => {
//     try {
//         // as an example, this reads the stops in Manhattan - you can change it to whichever borough you want
//         // this just checks the stops near 14st union square because it's a busy stop
//         const data = await fs.readFile("./assets/buses/google_transit_manhattan/stops.txt", 'utf-8')
//         // save the processedStopData somewhere (to save performance)
//         var stopData: any = data;
//         var processedStopData = tH.processBusStopData(stopData)
//         let location: [number, number] = [40.735470, -73.9910]
//         const realtime = tH.getNearbyStops(processedStopData, location, 0.004);
//         res.json(realtime);
//     } catch (error) {
//         const e = error as Error;
//         res.status(500).send(e.message);
//     }
// })
app.get('/getNearbyBusStops', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Example: 14st union square
        const location = ["40.735470", "-73.9910"]; //.map((item) => {return String(item)})
        // No, I do not how to interpret latSpan and lonSpan (°ー°〃)
        // Default mta values (bruh)
        const latSpan = "0.005";
        const lonSpan = "0";
        if (process.env.BUS_API_KEY) {
            const realtime = yield tH.getNearbyBusStops(location, latSpan, lonSpan, process.env.BUS_API_KEY);
            res.json(realtime);
        }
        else {
            console.error(busApiKeyErrorMsg);
        }
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.get('/getNearbyTrainStops', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to test
        const data = yield fs.readFile("./assets/trains/google_transit/stops2.txt", 'utf-8');
        // const shapeData = await fs.readFile("./assets/trains/google_transit/shapes.txt", 'utf-8')
        let stopData = data;
        let processedStopData = tH.getAllTrainStopCoordinates(stopData.split('\n'));
        // 14 st union square as example
        let location = [40.735470, -73.9910];
        const realtime = tH.getNearbyStops(processedStopData, location, 0.009);
        let rKeys = Object.keys(realtime);
        let rVals = Object.values(realtime);
        // for (var i = 0; i < rKeys.length; i++) {
        //     let processedShapeData = await tH.getTrainLineShapes(shapeData.split('\n'))
        //     // console.log(tH.getTrainLineFromLocation(processedShapeData, rVals[i]["coordinates"]))
        // }
        res.json(realtime);
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server-to-test.js.map