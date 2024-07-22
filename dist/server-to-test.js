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
const app = express();
const PORT = 8082;
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
        const targetStopID = '112';
        const line = '1';
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
app.get('/getAllTrainStops', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // to test
        const data = yield fs.readFile("./assets/trains/google_transit/stops.txt", 'utf-8');
        const realtime = yield tH.getAllTrainStopCoordinates(data);
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
        const realtime = yield tH.getTrainLineShapes(data);
        res.json(realtime[1]);
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