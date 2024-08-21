var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Not usable in React-native!!! Uses fs/promises!
// Go to RNaddInfoToStops.ts if your using React-native
import fs from 'fs/promises';
// add the train lines because mta doesn't provide it 😿
export function addTrainLinesToStopsFile(stopData, shapeData, saveToFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var results = {};
        const splitShapeData = shapeData.split('\n');
        const splitStopData = stopData.split('\n');
        // for (var i = 1; i < splitShapeData.length - 1; i += 2) {
        for (var i = 1; i < splitShapeData.length - 1; i++) {
            if (splitShapeData[i] == "") {
                continue;
            }
            const splitByComma = splitShapeData[i].split(',');
            const [shape_id, shape_pt_sequence, shape_pt_lat, shape_pt_lon] = splitByComma;
            let trainline = shape_id.slice(0, shape_id.indexOf('.'));
            // let stop_id = shape_id.slice(shape_id.indexOf('.') + 2, shape_id.length)
            let coordinates = [shape_pt_lat, shape_pt_lon];
            for (var j = 1; j < splitStopData.length - 1; j++) {
                // if (splitStopData[j] == "") {
                //     continue;
                // }
                let splitByComma2 = splitStopData[j].split(',');
                const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma2;
                let coordinates2 = [stop_lat, stop_lon];
                // console.log(coordinates[0], coordinates2[0])
                if (coordinates[0] == coordinates2[0] && coordinates[1] == coordinates2[1]) {
                    console.log(trainline, i, j);
                    if (!results[stop_id]) {
                        results[stop_id] = {};
                    }
                    if (results[stop_id][trainline] == "") {
                        continue;
                    }
                    results[stop_id][trainline] = "";
                    // make the line empty since we found a match
                    // splitStopData[j] = ""
                }
            }
            // make the line empty since we won't be checking it again
            splitShapeData[i] = "";
        }
        // var newSplitStopData = stopData.split('\n')
        var newSplitStopData = splitStopData;
        for (var i = 1; i < splitStopData.length; i++) {
            let splitByComma = newSplitStopData[i].split(',');
            const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
            if (results[stop_id]) {
                newSplitStopData[i] = newSplitStopData[i] + `,${Object.keys(results[stop_id]).join("-")}`;
            }
            else {
                // This means that no train lines were found for that stop_id (Gasp!)
            }
        }
        let modifiedContent = newSplitStopData.join('\n');
        yield fs.writeFile(saveToFilePath, modifiedContent);
        return "Success";
    });
}
function runThisFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const shapeData = yield fs.readFile("./assets/trains/google_transit/shapes.txt", 'utf-8');
        const stopData = yield fs.readFile("./assets/trains/google_transit/stops.txt", 'utf-8');
        addTrainLinesToStopsFile(stopData, shapeData, "./assets/trains/google_transit/stops2222.txt");
    });
}
runThisFile();
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