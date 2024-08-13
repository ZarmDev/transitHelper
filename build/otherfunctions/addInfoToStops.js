// NOT USABLE WITH REACT-NATIVE!!! USES fs/promises!
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
import fs from 'fs/promises';
// add the train lines because mta doesn't provide it 😿
export function addTrainLinesToStopsFile(stopFilePath, shapeData, saveToFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var results = {};
        const splitShapeData = shapeData.split('\n');
        let stopData = yield fs.readFile(stopFilePath, 'utf-8');
        let splitStopData = stopData.split('\n');
        // for (var i = 1; i < splitShapeData.length - 1; i += 2) {
        for (var i = 1; i < splitShapeData.length - 1; i++) {
            const splitByComma = splitShapeData[i].split(',');
            const [shape_id, shape_pt_sequence, shape_pt_lat, shape_pt_lon] = splitByComma;
            let trainline = shape_id.slice(0, shape_id.indexOf('.'));
            // let stop_id = shape_id.slice(shape_id.indexOf('.') + 2, shape_id.length)
            let coordinates = [shape_pt_lat, shape_pt_lon];
            for (var j = 1; j < splitStopData.length; j++) {
                let splitByComma2 = splitStopData[j].split(',');
                const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma2;
                let coordinates2 = [stop_lat, stop_lon];
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
        for (var i = 1; i < splitStopData.length; i++) {
            let splitByComma = splitStopData[i].split(',');
            const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
            try {
                splitStopData[i] = splitStopData[i] + `,${Object.keys(results[stop_id]).join("-")}`;
            }
            catch (_a) {
            }
        }
        let modifiedContent = splitStopData.join('\n');
        yield fs.writeFile(saveToFilePath, modifiedContent);
        return "Success";
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
//# sourceMappingURL=addInfoToStops.js.map