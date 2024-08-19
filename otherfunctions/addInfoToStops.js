"use strict";
// NOT USABLE WITH REACT-NATIVE!!! Go to RNaddInfoToStops.ts for react-native supprot
// This file adds the train line (add maybe bus line in the future) to stops.txt to allow you to get realtime data about that stop
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrainLinesToStopsFile = addTrainLinesToStopsFile;
var promises_1 = require("fs/promises");
// add the train lines because mta doesn't provide it 😿
function addTrainLinesToStopsFile(stopFilePath, shapeFilePath, saveToFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var results, shapeData, splitShapeData, stopData, splitStopData, i, splitByComma, shape_id, shape_pt_sequence, shape_pt_lat, shape_pt_lon, trainline, coordinates, j, splitByComma2, stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station, coordinates2, i, splitByComma, stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station, modifiedContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = {};
                    return [4 /*yield*/, promises_1.default.readFile(shapeFilePath, 'utf-8')];
                case 1:
                    shapeData = _a.sent();
                    splitShapeData = shapeData.split('\n');
                    return [4 /*yield*/, promises_1.default.readFile(stopFilePath, 'utf-8')];
                case 2:
                    stopData = _a.sent();
                    splitStopData = stopData.split('\n');
                    // for (var i = 1; i < splitShapeData.length - 1; i += 2) {
                    for (i = 1; i < splitShapeData.length - 1; i++) {
                        splitByComma = splitShapeData[i].split(',');
                        shape_id = splitByComma[0], shape_pt_sequence = splitByComma[1], shape_pt_lat = splitByComma[2], shape_pt_lon = splitByComma[3];
                        trainline = shape_id.slice(0, shape_id.indexOf('.'));
                        coordinates = [shape_pt_lat, shape_pt_lon];
                        for (j = 1; j < splitStopData.length; j++) {
                            splitByComma2 = splitStopData[j].split(',');
                            stop_id = splitByComma2[0], stop_name = splitByComma2[1], stop_lat = splitByComma2[2], stop_lon = splitByComma2[3], location_type = splitByComma2[4], parent_station = splitByComma2[5];
                            coordinates2 = [stop_lat, stop_lon];
                            // console.log(coordinates[0], coordinates2[0])
                            if (coordinates[0] == coordinates2[0] && coordinates[1] == coordinates2[1]) {
                                // console.log(trainline, i, j);
                                if (!results[stop_id]) {
                                    results[stop_id] = {};
                                }
                                if (results[stop_id][trainline] == "") {
                                    continue;
                                }
                                results[stop_id][trainline] = "";
                                console.log(trainline);
                            }
                        }
                    }
                    for (i = 1; i < splitStopData.length; i++) {
                        splitByComma = splitStopData[i].split(',');
                        stop_id = splitByComma[0], stop_name = splitByComma[1], stop_lat = splitByComma[2], stop_lon = splitByComma[3], location_type = splitByComma[4], parent_station = splitByComma[5];
                        try {
                            splitStopData[i] = splitStopData[i] + ",".concat(Object.keys(results[stop_id]).join("-"));
                        }
                        catch (_b) {
                        }
                    }
                    modifiedContent = splitStopData.join('\n');
                    return [4 /*yield*/, promises_1.default.writeFile(saveToFilePath, modifiedContent)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, "Success"];
            }
        });
    });
}
// ## Working on a function that gives train lines like the Transit app ##
// interface ExperimentalResultsInterface {
//     [trainLine: string]: {
//         locations: [number, number][]
//     };
// }
// export async function addTrainLinesToStopsFileExperimental(stopFilePath: string, shapeData: string, saveToFilePath: string) {
//     var results: ExperimentalResultsInterface = {}
//     const splitShapeData = shapeData.split('\n');
//     let stopData = await fs.readFile(stopFilePath, 'utf-8')
//     let splitStopData = stopData.split('\n')
//     // for (var i = 1; i < splitShapeData.length - 1; i += 2) {
//     for (var i = 1; i < splitShapeData.length - 1; i++) {
//         const splitByComma = splitShapeData[i].split(',')
//         const [shape_id, shape_pt_sequence, shape_pt_lat, shape_pt_lon] = splitByComma;
//         let trainline = shape_id.slice(0, shape_id.indexOf('.'))
//         // let stop_id = shape_id.slice(shape_id.indexOf('.') + 2, shape_id.length)
//         let coordinates = [shape_pt_lat, shape_pt_lon]
//         for (var j = 1; j < splitStopData.length; j++) {
//             let splitByComma2 = splitStopData[j].split(',')
//             const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma2;
//             let coordinates2 = [stop_lat, stop_lon]
//             // console.log(coordinates[0], coordinates2[0])
//             if (coordinates[0] == coordinates2[0] && coordinates[1] == coordinates2[1]) {
//                 // console.log(trainline, i, j);
//                 if (!results[stop_id]) {
//                     results[stop_id] = {}
//                 }
//                 if (results[stop_id][trainline] == "") {
//                     continue;
//                 }
//                 results[stop_id][trainline] = "";
//                 console.log(trainline);
//             }
//         }
//     }
//     for (var i = 1; i < splitStopData.length; i++) {
//         let splitByComma = splitStopData[i].split(',')
//         const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
//         try {
//             splitStopData[i] = splitStopData[i] + `,${Object.keys(results[stop_id]).join("-")}`
//         } catch {
//         }
//     }
//     let modifiedContent = splitStopData.join('\n')
//     await fs.writeFile(saveToFilePath, modifiedContent)
//     return "Success"
// }
