import GtfsRealTimeBindings from 'gtfs-realtime-bindings'
import express from 'express';
// import cors from 'cors';
import fs from 'fs';

function saveToFile(content) {
  fs.writeFile('save.txt', content, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Content saved to save.txt');
    }
  });
}

async function parseAndReturnFeed(url) {
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

const app = express();
const PORT = 8082;

const trainAlerts = {}

async function getServiceAlerts() {
    const feed = await parseAndReturnFeed("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts")
    // Where all the data is. The other key is header, used for metadata
    const processed = feed["entity"]
    saveToFile(JSON.stringify(processed, null, 2))
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
        if (processed[i]["alert"] != undefined) {
            const alert = processed[i]["alert"]
            const routesAffected = alert["informedEntity"]           
            const header = alert["headerText"]
            console.log(header);
            const description = alert["descriptionText"]
            const headerTextTranslation = header["translation"]
            const descriptionTranslation = description == null ? null : description["translation"]
            // you can either use index 0 or 1 which either gives you the normal version or version in HTML
            const headerText = headerTextTranslation[1]["text"]
            const descriptionText = description == null ? null : descriptionTranslation[1]["text"]
            // console.log(routesAffected.length)
            const routeId = routesAffected[0]['routeId']
            trainAlerts[routeId] = `${headerText} \n${descriptionText}`
            // for (var i = 0; i < routesAffected.length; i++) {
            //     const routeId = routesAffected[i]['routeId']
            //     trainAlerts[routeId] = `${headerText} \n${descriptionText}`
            // }
        }
        if (i > 100) {
            console.log('damn')
            break;
        }
    }
    return trainAlerts
}

async function getRealTimeData() {
    const feed = await parseAndReturnFeed("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw")
    // console.log(feed);
    return feed
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
        const realtime = await getRealTimeData();
        res.json(realtime); // Send the alerts as JSON
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});