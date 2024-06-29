import GtfsRealTimeBindings from 'gtfs-realtime-bindings'
import express from 'express';
// import cors from 'cors';
import fs from 'fs/promises';

const app = express();
const PORT = 8082;

async function writeToFile(filename: string, content: string) {
    try {
        await fs.writeFile(filename, content);
    } catch (err) {
        console.error('Error:', err);
    }
}

async function parseAndReturnFeed(url: string) {
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

// I needed AI help to make this, I honestly don't understand
// interfaces that much
interface SimpleTrainInterface {
    [key: string]: string
}

const trainAlerts: SimpleTrainInterface = {}

async function getServiceAlerts() {
    const feed = await parseAndReturnFeed("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts")
    // Where all the data is. The other key is header, used for metadata
    const processed = feed["entity"]
    // writeToFile(JSON.stringify(processed, null, 2))
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
                if (headerTextTranslation && descriptionTranslation) {
                    // you can either use index 0 or 1 which either gives you the normal version or version in HTML
                    const headerText = headerTextTranslation[1]["text"]
                    const descriptionText = description == null ? null : descriptionTranslation[1]["text"]
                    // console.log(routesAffected.length)
                    if (routesAffected) {
                        const routeId = routesAffected[0]['routeId']
                        if (routeId) {
                            trainAlerts[routeId] = `${headerText} \n${descriptionText}`
                            // for (var i = 0; i < routesAffected.length; i++) {
                            //     const routeId = routesAffected[i]['routeId']
                            //     trainAlerts[routeId] = `${headerText} \n${descriptionText}`
                            // }
                        }
                    }
                }
            }
        }
        if (i > 100) {
            console.log('damn')
            break;
        }
    }
    return trainAlerts
}

// generated by AI cuz im lazy
function unixTimestampToDateTime(unixTimestamp: number) : Date {
    const milliseconds = unixTimestamp * 1000; // Convert seconds to milliseconds
    const date = new Date(milliseconds);
    return date
}

async function getArrivals(line: string, targetStopID: string) {
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
    // console.log(feed);
    // what are entities? idk :/
    const entities = feed["entity"]
    var obj : SimpleTrainInterface = {}
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
                    let stopID = stopTimeUpdate[j]["stopId"]
                    // the stopID looks like "R20N" and it can either be
                    // R20, R20S, R20N representing the direction the arrival times are bound
                    if (stopID && stopID === targetStopID) {
                        const arrivalObject = stopTimeUpdate[j]["arrival"]
                        if (arrivalObject) {
                            const time = Number(arrivalObject["time"])
                            if (time) {
                                // using .valueOf() to not annoy typescript: https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
                                const unixToDate = unixTimestampToDateTime(time).valueOf();
                                const currentDate = Date.now().valueOf()
                                let timeDifference = unixToDate - currentDate
                                timeDifference = Math.round(timeDifference / (1000 * 60))
                                const data = await fs.readFile("./google_transit/stops.txt", 'utf-8')
                                const splitByLine = data.split('\n');
                                for (var x = 0; x < splitByLine.length; x++) {
                                    if (splitByLine[x] == '') {
                                        continue;
                                    }
                                    const splitByComma = splitByLine[x].split(',')
                                    // console.log(splitByComma[0], targetStopID)
                                    if (splitByComma[0].includes(targetStopID)) {
                                        let realStopName = splitByComma[1]
                                        obj[i] = `${line} arrives in ${timeDifference} minutes at ${realStopName}`
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return obj
}

async function getTrainLineCoordinates(data: string) {
    var splitByLine = data.split('\n');
    var trainLines = [
        { coordinates: [{ latitude: 37.78825, longitude: -122.4324 }, { latitude: 37.75825, longitude: -122.4424 }], color: '#FF0000' },
    ];
    var trainStops = [
        { latitude: 40.709166, longitude: -74.004901, title: 'Example' }
    ];
    for (var i = 0; i < splitByLine.length; i += 1) {
        var splitByComma = splitByLine[i].split(',')
        var splitByComma2 = splitByLine[i + 1].split(',')
        trainLines.push({
            coordinates: [
                { latitude: parseFloat(splitByComma[2]), longitude: parseFloat(splitByComma[3]) },
                { latitude: parseFloat(splitByComma2[2]), longitude: parseFloat(splitByComma2[3]) }
            ],
            color: '#FF0000'
        })
    }
}

async function getTrainStopCoordinates(data: string) {

}

// getAllData returns an object like:
/*
{
    "stopID": {
        "coordinates": {longitude: "", latitude: ""},
        "trains": {"N, Q, R, W"},
        "name": "34st Herald Square"
    },
    >> example
    "R27": {
        "coordinates": {longitude: "40.703087", latitude: "-74.012994"},
        "trains": {"N": "#FFFD37", Q: "#FFFD37", R: "#FFFD37", W: "#FFFD37"},
        "name": "Whitehall St-South Ferry",
        "icon": "1.svg, r.svg, w.svg"
    }
}
*/
async function getAllData() {

}

app.get('/serviceAlerts', async (req, res) => {
    try {
        const alerts = await getServiceAlerts();
        res.json(alerts); // Send the alerts as JSON
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/realtimeTrainData', async (req, res) => {
    try {
        // to test
        const currentCoords = '40.889248,-73.898583'
        const line = 'Q'
        const direction = "N"
        const realtime = await getArrivals(line, currentCoords, direction);
        res.json(realtime); // Send the alerts as JSON
    } catch (error) {
        // Huh?!? AI said you could do this which I never knew...
        const e = error as Error;
        res.status(500).send(e.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});