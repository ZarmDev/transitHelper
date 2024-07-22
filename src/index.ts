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
                        console.log(routesAffected, i)
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
        // console.log(routeID, line)
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
                            // console.log(stopID, (targetStopID + currentDirection))
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
    //  else if (["GS"].includes(line)) {
    //     // GS IS THE S LINE?!? bro what
    //     color = "#808183"
    // }
    // if (color == "") {
    //     console.log(line)
    // }
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
49418 lines
not using it:
706696 lines

Summary: It takes 93% less storage and is much faster`
export async function getTrainLineShapes(data : string) {
    var trainLines : TrainLineInterface = {};
    var splitByLine = data.split('\n');
    var sequence = -1;
    var shouldSkipToSavePerformance = false;
    // cut off last line because it's empty
    for (var i = 1; i < splitByLine.length - 1; i++) {
        const splitByComma = splitByLine[i].split(',')
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

interface TrainStopsInterface {
    [stopID: string]: {
        stopname: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        parent_station: string;
    };
}

// supply a stops.txt as data
export async function getAllTrainStopCoordinates(data: string) {
    var trainstops: TrainStopsInterface = {}
    // We can use this data and combine it with the other functions in getAllData
    const splitByLine = data.split('\n');
    for (var x = 0; x < splitByLine.length; x++) {
        if (splitByLine[x] == '') {
            continue;
        }
        const splitByComma = splitByLine[x].split(',')
        const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = splitByComma;
        // console.log(stop_id);
        // if the last character doesn't indicate direction (bad for performance)
        if (!["N", "S"].includes(stop_id.slice(stop_id.length - 1, stop_id.length))) {
            trainstops[stop_id] = {
                "stopname": stop_name,
                "coordinates": {
                    latitude: parseFloat(stop_lat),
                    longitude: parseFloat(stop_lon)
                },
                "parent_station": parent_station
            }
        }
    }
    return trainstops
}


export async function getAllData() {

}