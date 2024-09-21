// Only usable in react-native! Use this in your own project :)))
import * as FileSystem from 'expo-file-system';

interface ResultsInterface {
    [stopID: string]: {
        // thanks AI here: Basically, this object is just to hold all the train lines for a stopID
        // An array could have been used, but duplicates would be a problem...
        [key: string]: '';
    };
}

// add the train lines because mta doesn't provide it 😿
export async function addTrainLinesToStopsFile(stopData: string, shapeData: string, saveToFilePath: string) {
    var results: ResultsInterface = {}
    const splitShapeData = shapeData.split('\n');
    const splitStopData = stopData.split('\n')
    // for (var i = 1; i < splitShapeData.length - 1; i += 2) {
    for (var i = 1; i < splitShapeData.length - 1; i++) {
        if (splitShapeData[i] == "") {
            continue;
        }
        const splitByComma = splitShapeData[i].split(',')
        const [shape_id, shape_pt_sequence, shape_pt_lat, shape_pt_lon] = splitByComma;
        let trainline = shape_id.slice(0, shape_id.indexOf('.'))
        // let stop_id = shape_id.slice(shape_id.indexOf('.') + 2, shape_id.length)
        let coordinates = [shape_pt_lat, shape_pt_lon]
        for (var j = 1; j < splitStopData.length - 1; j++) {
            // if (splitStopData[j] == "") {
            //     continue;
            // }
            let splitByComma2 = splitStopData[j].split(',')
            const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma2;
            let coordinates2 = [stop_lat, stop_lon]
            // console.log(coordinates[0], coordinates2[0])
            if (coordinates[0] == coordinates2[0] && coordinates[1] == coordinates2[1]) {
                console.log(trainline, i, j);
                if (!results[stop_id]) {
                    results[stop_id] = {}
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
        splitShapeData[i] = ""
    }
    // var newSplitStopData = stopData.split('\n')
    var newSplitStopData = splitStopData;
    for (var i = 1; i < splitStopData.length; i++) {
        let splitByComma = newSplitStopData[i].split(',')
        const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
        if (results[stop_id]) {
            newSplitStopData[i] = newSplitStopData[i] + `,${Object.keys(results[stop_id]).join("-")}`
        } else {
            // This means that no train lines were found for that stop_id (Gasp!)
        }
    }
    let modifiedContent = newSplitStopData.join('\n')
    await FileSystem.writeAsStringAsync(saveToFilePath, modifiedContent);
    return "Success"
}

// const shapeData = await FileSystem.readAsStringAsync("./assets/trains/google_transit/shapes.txt")
// const stopData = await FileSystem.readAsStringAsync("./assets/trains/google_transit/stops.txt")
// addTrainLinesToStopsFile(stopData, shapeData, "./assets/trains/google_transit/stop2.txt")