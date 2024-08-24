// Not usable in React-native!!! Uses fs/promises!
// Go to RNaddInfoToStops.ts if your using React-native
import fs from 'fs/promises'

// interface RoutesInterface {
//     [key: string]: string[];
// }

export async function addTrainLinesToStopsFile() {
    const trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "7", "7d", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "w", "z"]
    // for each train line, get the stops associated with it and compare it to stops.txt
    const stopData = await fs.readFile('./assets/trains/google_transit/stops.txt', 'utf-8')
    const splitStopData = stopData.split('\n');
    // const allRoutes : RoutesInterface= {}
    const allRoutes = {}
    for (var i = 0; i < trainLinesWithIcons.length; i++) {
        try {
            const routeData = await fs.readFile(`./assets/trains/routes/stops-${trainLinesWithIcons[i]}.txt`, 'utf-8')
            allRoutes[trainLinesWithIcons[i]] = routeData.split('\n');
        } catch {
            // if it doesn't exist, well...
        }
    }
    const eachTrainRouteKeys = Object.keys(allRoutes)
    const eachTrainRoute = Object.values(allRoutes)
    // var modifiedContent : string[] = [];
    var modifiedContent = [];
    // Skip the last one as well
    for (var i = 1; i < splitStopData.length - 1; i++) {
        let splitByComma = splitStopData[i].split(',')
        const [stop_id,stop_name,stop_lat,stop_lon,location_type,parent_station] = splitByComma;
        var linesFoundAtStop = [];
        // Skip the last one
        for (var j = 0; j < eachTrainRoute.length - 1; j++) {
            // Skip last one (empty)
            for (var t = 0; t < eachTrainRoute[j].length - 1; t++) {
                const currentStop = eachTrainRoute[j][t];
                const l = currentStop.length
                // console.log(stop_name, currentStop, eachTrainRouteKeys[j])
                // var shortenedRouteStopName = currentStop.slice(0, l-3);
                if (stop_name.includes(currentStop)) {
                    // console.log(stop_name, eachTrainRoute[j])
                    linesFoundAtStop.push(eachTrainRouteKeys[j])
                }
            }
        }
        if (linesFoundAtStop.length == 0) {
            // add empty value
            modifiedContent.push(splitStopData[i] + ',')
        } else {
            modifiedContent.push(splitStopData[i] + ',' + linesFoundAtStop.join('-'))
        }
        console.log(i)
    }
    fs.writeFile('./assets/trains/google_transit/stops2.txt', modifiedContent.join('\n'))
}

await addTrainLinesToStopsFile()
// interface ResultsInterface {
//     [stopID: string]: {
//         // thanks AI here: Basically, this object is just to hold all the train lines for a stopID
//         // An array could have been used, but duplicates would be a problem...
//         [key: string]: '';
//     };
// }

// // add the train lines because mta doesn't provide it 😿
// export async function addTrainLinesToStopsFile(stopData: string, shapeData: string, saveToFilePath: string) {
//     var results: ResultsInterface = {}
//     const splitShapeData = shapeData.split('\n');
//     const splitStopData = stopData.split('\n')
//     // for (var i = 1; i < splitShapeData.length - 1; i += 2) {
//     for (var i = 1; i < splitShapeData.length - 1; i++) {
//         if (splitShapeData[i] == "") {
//             continue;
//         }
//         const splitByComma = splitShapeData[i].split(',')
//         const [shape_id, shape_pt_sequence, shape_pt_lat, shape_pt_lon] = splitByComma;
//         let trainline = shape_id.slice(0, shape_id.indexOf('.'))
//         // let stop_id = shape_id.slice(shape_id.indexOf('.') + 2, shape_id.length)
//         let coordinates = [shape_pt_lat, shape_pt_lon]
//         for (var j = 1; j < splitStopData.length - 1; j++) {
//             // if (splitStopData[j] == "") {
//             //     continue;
//             // }
//             let splitByComma2 = splitStopData[j].split(',')
//             const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma2;
//             let coordinates2 = [stop_lat, stop_lon]
//             // console.log(coordinates[0], coordinates2[0])
//             if (coordinates[0] == coordinates2[0] && coordinates[1] == coordinates2[1]) {
//                 console.log(trainline, i, j);
//                 if (!results[stop_id]) {
//                     results[stop_id] = {}
//                 }
//                 if (results[stop_id][trainline] == "") {
//                     continue;
//                 }
//                 results[stop_id][trainline] = "";

//                 // make the line empty since we found a match
//                 // splitStopData[j] = ""
//             }
//         }
//         // make the line empty since we won't be checking it again
//         splitShapeData[i] = ""
//     }
//     // var newSplitStopData = stopData.split('\n')
//     var newSplitStopData = splitStopData;
//     for (var i = 1; i < splitStopData.length; i++) {
//         let splitByComma = newSplitStopData[i].split(',')
//         const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
//         if (results[stop_id]) {
//             newSplitStopData[i] = newSplitStopData[i] + `,${Object.keys(results[stop_id]).join("-")}`
//         } else {
//             // This means that no train lines were found for that stop_id (Gasp!)
//         }
//     }
//     let modifiedContent = newSplitStopData.join('\n')
//     await fs.writeFile(saveToFilePath, modifiedContent)
//     return "Success"
// }

// async function runThisFile() {
//     const shapeData = await fs.readFile("./assets/trains/google_transit/shapes.txt", 'utf-8')
//     const stopData = await fs.readFile("./assets/trains/google_transit/stops.txt", 'utf-8')
//     addTrainLinesToStopsFile(stopData, shapeData, "./assets/trains/google_transit/stops2222.txt")
// }
// runThisFile()

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