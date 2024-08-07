import GtfsRealTimeBindings from 'gtfs-realtime-bindings'

export async function parseAndReturnFeed(url: string) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            // ...
        },
    });
    if (!response.ok) {
        const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
        throw error;
    }
    const buffer = await response.arrayBuffer();
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);
    const feed = GtfsRealTimeBindings.transit_realtime.FeedMessage.decode(uint8Array);
    return feed
}

interface ServiceAlerts {
    [line: string]: {
        headerText: string,
        descriptionText: string | null
    }
}

// not done
export async function getTrainServiceAlerts(shouldIncludePlannedWork: boolean) {
    // Partial is here so Typescript doesn't attack the compiler :( (To let the object be empty at first)
    var trainAlerts: Partial<ServiceAlerts> = {}
    const feed = await parseAndReturnFeed("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts")
    // Where all the data is. The other key is header, used for metadata
    const processed = feed["entity"]
    // writeToFile('save.txt', JSON.stringify(processed, null, 2))
    for (var i = 0; i < processed.length; i++) {
        // console.log(processed[i])
        const id = processed[i]["id"]
        // make sure the id is a current alert and not planned alert
        // console.log(id, !id.includes('lmm:alert'))
        if (!id.includes('lmm:alert')) {
            // console.log(id);
            break
        } else {
            // console.log(id, true);
        }
        const alert = processed[i]["alert"]
        // make sure alert is not null/undefined
        if (alert) {
            const routesAffected = alert["informedEntity"]
            const header = alert["headerText"]
            if (header) {
                const description = alert["descriptionText"]
                const headerTextTranslation = header["translation"]
                const descriptionTranslation = description == null ? null : description["translation"]
                if (headerTextTranslation) {
                    // you can either use index 0 or 1 which either gives you the normal version or version in HTML
                    const headerText = headerTextTranslation[1]["text"]

                    if (routesAffected) {
                        // loop through each route affected
                        // console.log(routesAffected, i)
                        for (var j = 0; j < routesAffected.length; j++) {
                            const routeId = routesAffected[j]['routeId']
                            if (routeId) {
                                var descriptionText = null
                                if (descriptionTranslation != null) {
                                    descriptionText = descriptionTranslation[1]["text"]
                                }
                                trainAlerts[routeId] = { "headerText": headerText, "descriptionText": descriptionText }
                                // for (var i = 0; i < routesAffected.length; i++) {
                                //     const routeId = routesAffected[i]['routeId']
                                //     trainAlerts[routeId] = `${headerText} \n${descriptionText}`
                                // }
                            }
                        }
                    }
                }
            }
        }
    }
    return trainAlerts
}

export function unixTimestampToDateTime(unixTimestamp: number): Date {
    // generated by AI cuz im lazy
    const milliseconds = unixTimestamp * 1000; // Convert seconds to milliseconds
    const date = new Date(milliseconds);
    return date
}

interface ArrivalInterface {
    arrivalTime: number;
    direction: string;
    line: string;
}
//Huh?!?
type ArrivalsInterface = ArrivalInterface[];
export async function getTrainArrivals(line: string, targetStopID: string, date: number, direction: string) {
    console.log(targetStopID);
    if (targetStopID.length === 4) {
        let errormsg = "Error: The length of the stop ID should be 4. It's possible that you provided the stopID with the S or N at the end. If you did that, just slice off the last character of the stop ID before running this function."
        console.error(errormsg);
        return errormsg;
    }
    var arrivals: ArrivalsInterface = []
    let source = "";
    if (["A", "C", "E"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace"
    } else if (["B", "D", "F", "M"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm"
    } else if (["G"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g"
    } else if (["J", "Z"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz"
    } else if (["N", "Q", "R", "W"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw"
    } else if (["L"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l"
    } else if (["1", "2", "3", "4", "5", "6", "7"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs"
    } else if (["SIR"].includes(line)) {
        source = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si"
    }
    const feed = await parseAndReturnFeed(source)
    // writeToFile('save.txt', JSON.stringify(feed, null, 2))
    // console.log(feed);
    // what are entities? idk :/
    const entities = feed["entity"]
    // just to get both the north and south arrivals and combine them
    var numOfDirections = 1;
    if (direction === "") {
        numOfDirections = 2;
    }
    for (var i = 0; i < entities.length; i++) {
        // trip data for each train? not sure
        const tripUpdate = entities[i]["tripUpdate"]
        if (tripUpdate == null || tripUpdate == undefined) {
            continue;
        }
        const trip = tripUpdate["trip"]
        const tripID = trip["tripId"]
        const routeID = trip["routeId"]
        // not sure if this works for all lines... maybe not working for SIR
        if (routeID != line) {
            continue;
        }
        // all the arrivals for each stop in stops.txt (google_transit folder)
        const stopTimeUpdate = tripUpdate["stopTimeUpdate"]
        // make sure it's not null/undefined
        if (stopTimeUpdate) {
            for (let j = 0; j < stopTimeUpdate.length; j++) {
                if (stopTimeUpdate[j]) {
                    var stopID = stopTimeUpdate[j]["stopId"]
                    if (stopID) {
                        // the stopID looks like "R20N" and it can either be
                        // R20, R20S, R20N representing the direction the arrival times are bound

                        let currentDirection = direction;
                        if (currentDirection == "") {
                            currentDirection = "N"
                        }
                        for (var z = 0; z < numOfDirections; z++) {
                            // just a complicated way to make sure it checks both directions if you want both directions
                            if (direction == "" && z == 1) {
                                if (currentDirection == "N") {
                                    currentDirection = "S"
                                } else {
                                    currentDirection = "N"
                                }
                            }
                            console.log(stopID, (targetStopID + currentDirection))
                            if (stopID === (targetStopID + currentDirection)) {
                                const arrivalObject = stopTimeUpdate[j]["arrival"]
                                if (arrivalObject) {
                                    const time = Number(arrivalObject["time"])
                                    if (time) {
                                        // using .valueOf() to not annoy typescript: https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
                                        const unixToDate = unixTimestampToDateTime(time).valueOf();
                                        const currentDate = date.valueOf()
                                        let timeDifference = unixToDate - currentDate
                                        timeDifference = Math.round(timeDifference / (1000 * 60))
                                        arrivals.push({
                                            "arrivalTime": timeDifference,
                                            "direction": currentDirection,
                                            "line": line
                                        })
                                        // arrivals.push(`${line} arrives in ${timeDifference} minutes at ${realStopName} in the direction of ${}`)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return arrivals
}

function getTrainLineColor(line: string) {
    let color = "";
    // S is wierdly missing in shapes.txt...
    if (["A", "C", "E"].includes(line)) {
        color = "#0039A6"
    } else if (["B", "D", "F", "M"].includes(line)) {
        color = "#FF6319"
    } else if (["G"].includes(line)) {
        color = "#6CBE45"
    } else if (["J", "Z"].includes(line)) {
        color = "#996633"
    } else if (["N", "Q", "R", "W"].includes(line)) {
        color = "#FCCC0A"
    } else if (["L"].includes(line)) {
        color = "#A7A9AC"
    } else if (["1", "2", "3"].includes(line)) {
        color = "#EE352E"
    } else if (["4", "5", "6"].includes(line)) {
        color = "#00933C"
    } else if (["7"].includes(line)) {
        color = "#B933AD"
    } else if (["SI"].includes(line)) {
        // not official color, just added it quickly
        color = "#2A9FDD"
    }
    return color
}

// thanks AI!
interface TrainLineInterface {
    [trainLine: string]: {
        color: string,
        // in leaflet.js format: [lat, lng], [lat, lng], ...
        layers: [number, number][]
    }
}

`using shouldSkipToSavePerformance:
49322 lines
not using it:
706696 lines

Summary: It takes 93% less storage and is easier to work with`
export async function getTrainLineShapes(data: string[]) {
    var trainLines: TrainLineInterface = {};
    var sequence = -1;
    var shouldSkipToSavePerformance = false;
    // cut off last line because it's empty
    for (var i = 1; i < data.length - 1; i++) {
        const splitByComma = data[i].split(',')
        // var splitByComma2 = splitByLine[i + 1].split(',')
        const trainLine = splitByComma[0].slice(0, splitByComma[0].indexOf('.'))

        // If the trainLine found in shapes.txt doesn't already exist in our object
        if (!trainLines[trainLine]) {
            if (shouldSkipToSavePerformance) {
                // no longer need to skip data, because we are at a different train line
                shouldSkipToSavePerformance = false;
            }
            // restart the sequence
            sequence = -1;
            // fill in default values (might be useful to say that black indicates something went wrong)
            trainLines[trainLine] = { "color": "black", "layers": [] };
            trainLines[trainLine]["color"] = getTrainLineColor(trainLine);
        } else if (shouldSkipToSavePerformance) {
            continue;
        }
        // If you look in shapes.txt, each line has a "shape_pt_sequence" and it goes up until around 200 and something
        // This code is just trying to split every 0..200 intos portions
        // Because, in each train line, it can have a lot of these 0..200 portions for some reason
        // I'm still not sure how it works but I know this atleast gives some correct lines
        // Maybe they are for lines like the 6 with a local and express route. I don't know
        if (splitByComma[1] == "0") {
            // Only get the first 0...200 then skip the rest until the next train line appears in the data
            // Also no this doesn't run immediately because sequence will be -1 not 0
            if (sequence == 0) {
                shouldSkipToSavePerformance = true;
                continue;
            }
            sequence += 1;
            // trainLines[trainLine]["layers"].push([])
        }
        // Sometimes it gives an error to try an extract the coordinates, so just use try and catch (cuz it works 😎)
        try {
            // trainLines[trainLine]["layers"][sequence].push(
            //     [parseFloat(splitByComma[2]), parseFloat(splitByComma[3])]
            // )
            trainLines[trainLine]["layers"].push(
                [parseFloat(splitByComma[2]), parseFloat(splitByComma[3])]
            )
        } catch {

        }
    }
    return trainLines
}

// an interface made for stops.txt data
interface StopInterface {
    [stopID: string]: {
        stopname: string;
        coordinates: [number, number];
        parent_station: string;
        type: "bus" | "train";
        // example: "1", "2", "3"
    };
}

// supply a stops.txt as data
// export async function getAllTrainStopCoordinates(data: string) {
//     var trainstops: StopInterface = {}
//     // We can use this data and combine it with the other functions in getAllData
//     const splitByLine = data.split('\n');
//     for (var x = 0; x < splitByLine.length; x++) {
//         if (splitByLine[x] == '') {
//             continue;
//         }
//         const splitByComma = splitByLine[x].split(',')
//         const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
//         // console.log(stop_id);
//         // if the last character doesn't indicate direction (bad for performance)
//         if (!["N", "S"].includes(stop_id.slice(stop_id.length - 1, stop_id.length))) {
//             trainstops[stop_id] = {
//                 "stopname": stop_name,
//                 "coordinates": [parseFloat(stop_lat), parseFloat(stop_lon)],
//                 "parent_station": parent_station
//             }
//         }
//     }
//     return trainstops
// }

export function processBusStopData(stopData: string[]) {
    let stops: StopInterface = {};
    // let splitStopData = stopData.split('\n')
    for (var i = 1; i < stopData.length; i++) {
        if (stopData[i] == '') {
            continue;
        }
        let splitByComma = stopData[i].split(',')
        const [stop_id, stop_name, stop_desc, stop_lat, stop_lon, zone_id, stop_url, location_type, parent_station] = splitByComma;
        stops[stop_id] = {
            "stopname": stop_name,
            "coordinates": [parseFloat(stop_lat), parseFloat(stop_lon)],
            "parent_station": parent_station,
            "type": "bus"
        }
    }
    return stops
}

export function processTrainStopData(stopData: string[]) {
    let stops: StopInterface = {};
    for (var i = 1; i < stopData.length; i++) {
        // if the current line doesn't show it's direction ex: 101 vs 101N or 101S
        if (stopData[i][3] == ',' || stopData[i] == '') {
            // then, skip over it, because we only want train lines with directions, not any direction (should help performance as well)
            continue;
        }
        if (i === stopData.length - 1) {
            console.log(stopData[i])
        }
        let splitByComma = stopData[i].split(',')
        const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
        stops[stop_id] = {
            "stopname": stop_name,
            "coordinates": [parseFloat(stop_lat), parseFloat(stop_lon)],
            "parent_station": parent_station,
            "type": "train"
        }
    }
    return stops
}

// export function getTrainLineFromLocation(processedShapeData : TrainLineInterface, coordinates: [number, number]) {
//     let pSDKeys = Object.keys(processedShapeData)
//     let pSDVals = Object.values(processedShapeData)
//     for (var i = 0; i < pSDKeys.length; i++) {
//         return pSDVals[i]["layers"]
//         pSDVals[i]["layers"].forEach((item) => {
//             // if the coordinates are found, return the train line
//             if (item[0] == coordinates[0] && item[1] == coordinates[1]) {
//                 return pSDKeys[i]
//             }
//         })
//     }
//     return "Not found"
// }

/**
 * Function to get nearby bus stops.
 * @param processedStopData - The stop data as a string (just the contents of the stops.txt file)
 * @param location - The location in the format of [latitude, longitude].
 */
export function getNearbyStops(processedStopData: StopInterface, locationOfUser: [number, number], distance: number) {
    // TODO: Maybe skip stops we have already seen to save performane because MTA provides mutliple of the same stops with almost the same coordinates
    let stops: StopInterface = {};
    // let location = [location["latitude"], location["longitude"]] // .map((i) => parseFloat(i.toFixed(precision)));
    let sDKeys = Object.keys(processedStopData);
    let sDVals = Object.values(processedStopData);
    for (var i = 1; i < sDKeys.length; i++) {
        let currentVal = sDVals[i];
        let locationOfStop = currentVal["coordinates"];
        // let latSame = stopCoordinates[i][0] == location[0];
        // let longSame = stopCoordinates[i][1] == location[1];
        // let acceptableDifference = 0.004;
        let acceptableDifference = distance;
        // if the latitude/longitude is close enough by the acceptableDifference (plus or minus range)
        // console.log(`${parseFloat(location[0])} - ${acceptableDifference}`)
        /*
        let latMinus = (parseFloat(location[0]) - acceptableDifference);
        let latPlus = (parseFloat(location[0]) + acceptableDifference);
        let longMinus = (parseFloat(location[1]) - acceptableDifference);
        let longPlus = (parseFloat(location[1]) + acceptableDifference);
        */
        let latMinus = (locationOfStop[0] - acceptableDifference);
        let latPlus = (locationOfStop[0] + acceptableDifference);
        let longMinus = (locationOfStop[1] - acceptableDifference);
        let longPlus = (locationOfStop[1] + acceptableDifference);
        // multiply each side by 100000 or something and maybe the comparisons will work?
        let inRangeLat = (latMinus <= locationOfUser[0]) && (latPlus >= locationOfUser[0])
        let inRangeLong = (longMinus <= locationOfUser[1]) && (longPlus >= locationOfUser[1])
        // console.log(stopData[i].split(',')[1])
        // console.log(`${latMinus} <= ${location[0]} && ${latPlus} >= ${location[0]}`)
        // console.log(`${longMinus} <= ${location[1]} && ${longPlus} >= ${location[1]}`)
        // console.log(inRangeLat, inRangeLong)
        // if ((latSame && longSame)) {
        if (inRangeLat && inRangeLong) {
            // Just use the same values but only the ones that are nearby
            stops[sDKeys[i]] = sDVals[i];
        }
    }
    return stops
    // return `Failed ${stopData.length != 0} ${stopCoordinates.length == 0}`
}

// const iconToURL = {
//     "1": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "2": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "3": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "4": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "5": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "6": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "7": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "7d": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "a": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "b": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "c": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "d": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "e": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "f": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "g": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     "h": "https://github.com/louh/mta-subway-bullets/blob/main/svg/1.svg",
//     ""
// }
export function getIconURLFromString() {

}

// export function getNearbyTrainStops(stopData: string[], location: [number, number], stopCoordinates: string[][], stopNames: string[]) {
//     let stops = [];
//     // TODO: Maybe skip stops we have already seen to save performane because MTA provides mutliple of the same stops with almost the same coordinates
//     if (stopData.length != 0) {
//         // let precision = 6;
//         // keep it in the memory to save performance
//         if (stopCoordinates.length == 0) {
//             for (var i = 0; i < stopData.length; i++) {
//                 let split = stopData[i].split(',')
//                 let latlng = [split[2], split[3]]
//                 let stopname = split[1]
//                 // .map((coord) => parseFloat(coord).toFixed(precision))
//                 stopCoordinates.push(latlng)
//                 stopNames.push(stopname)
//             }
//             // for (var i = 0; i < stopCoordinates.length; i++) {
//             //     console.log(stopCoordinates[i], stopData[i].split(','))
//             // }
//             // console.log('----------------------------------')
//         }
//         // let location = [location["latitude"], location["longitude"]]
//         // .map((i) => parseFloat(i.toFixed(precision)));
//         for (var i = 0; i < stopCoordinates.length; i++) {
//             let location = stopCoordinates[i];
//             // console.log(location)
//             // let latSame = stopCoordinates[i][0] == location[0];
//             // let longSame = stopCoordinates[i][1] == location[1];
//             // let acceptableDifference = 0.004;
//             let acceptableDifference = 0.009;
//             // if the latitude/longitude is close enough by the acceptableDifference (plus or minus range)
//             // console.log(`${parseFloat(location[0])} - ${acceptableDifference}`)
//             let latMinus = (parseFloat(location[0]) - acceptableDifference);
//             // console.log(`hmmm ${latMinus}`)
//             let latPlus = (parseFloat(location[0]) + acceptableDifference);
//             let longMinus = (parseFloat(location[1]) - acceptableDifference);
//             let longPlus = (parseFloat(location[1]) + acceptableDifference);
//             // multiply each side by 100000 or something and maybe the comparisons will work?
//             let inRangeLat = (latMinus <= location[0]) && (latPlus >= location[0])
//             let inRangeLong = (longMinus <= location[1]) && (longPlus >= location[1])
//             // console.log(stopData[i].split(',')[1])
//             // console.log(`${latMinus} <= ${location[0]} && ${latPlus} >= ${location[0]}`)
//             // console.log(`${longMinus} <= ${location[1]} && ${longPlus} >= ${location[1]}`)
//             // console.log(inRangeLat, inRangeLong)
//             // if ((latSame && longSame)) {
//             if (inRangeLat && inRangeLong) {
//                 let stopname = stopNames[i]
//                 stops.push(stopname)
//             }
//         }
//         // console.log(stops)
//         return stops
//     }
//     return `Failed ${stopData.length != 0} ${stopCoordinates.length == 0}`
// }

// get an array of coordinates that correspond to the 4 corners and one middle of each borough
function getBorough() { }