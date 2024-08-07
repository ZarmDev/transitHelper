# transitHelper
A Typescript library to make it easy (cough, cough) to create a transit app. (Only for NYC)

It takes ~41MB (including node_modules) and depends on gtfs-realtime-binding, express and typescript.

The express library is only used to test the library (due to CORS) and is used as a dev dependency.

This works with:
- React-native
- In the browser 
- Node.js

Please follow the instructions below (including "Requirements"!!!) to use the library.

# Showcase
Proof that it works:
https://github.com/ZarmDev/OpenTransitApp

Note that this project is still being developed, if you have any questions please open an issue :))))))

# Credits
Louh for the subway icons:

https://github.com/louh/mta-subway-bullets?tab=readme-ov-file

# All the commands and if they have been implemented
(✅ if implemented, ❕if it works but isnt finished, ❌ if not working or not implemented)
```
Realtime functions:

✅tH.getTrainArrivals(line, targetStopID, unixTime, direction)

❌tH.getBusArrivals(line, targetStopID, unixTime, direction, apiKey)

❕tH.getTrainServiceAlerts(shouldIncludePlannedWork)

❌tH.getBusServiceAlerts(data, shouldIncludePlannedWork, apiKey)

❌tH.getTransfers(data, stopID) // When using this keep in mind construction, service alerts, etc

❌tH.getLocationsOfTrains(data, stopID)

❌tH.getLocationsOfBuses(data, stopID)

Not realtime data: (Updated every x months according to https://new.mta.info/developers/gtfs-schedules-transition)

⛔ (removed - use tH.processTrainStopData instead) tH.getAllTrainStopCoordinates(data)

❌tH.getAllBusStopCoordinates(data)

❌tH.getAllFerryStopCoordinates(data)

❌tH.getAllStopCoordinates(data)

✅tH.getTrainLineShapes(data)

✅tH.processTrainStopData(stopData);

✅tH.processBusStopData(stopData);

✅tH.getNearbyStops(processedStopData, locationOfUser, distance)

❌tH.getBorough(locationOfUser)

⛔ (redundant - just use tH.processTrainStopData/tH.processBusStopData) tH.getAllData(shouldAttemptToMerge)
```
Maybe in the far future:
```
// to get streets/avenues shapes and also find walking routes
tH.getCityGrid()
// use Overhead API to download open street map data
tH.getOpenStreetMapData()
// also maybe use https://algs4.cs.princeton.edu/44sp/ (nyc.txt) to get routes to places
tH.getRouteTo()
```

# Requirements
## 1. Requirements for doing anything with this library
Regardless if your testing, using or whatever with this project, **you need to install the assets beforehand**.

To install the assets, which is GTFS data, you can go to
https://new.mta.info/developers and go to "Static GTFS data"

Then, you can click Regular GTFS Data for the train data and you can click the links in the "Buses" sections for bus data (if you need it)

If you use server-to-test.ts, you must put the **unzipped** folders you downloaded in assets and put the bus data in a folder called "buses" and all the train data "trains" folder.
**Otherwise, it will not work!!! (Unless you change each of the data variables in server-to-test.ts but do you really want to do that...)**

## 2. Requirements for getting *realtime* bus data
As the MTA developer site (https://new.mta.info/developers) mentions, "Real-time bus data is provided via the Bus Time set of APIs. You will need to create an account and use an API key to access the feeds."

You have to request an api key before getting **realtime** bus data. That being said, you can still get bus stop data so it's only if you need realtime data.

Here's the link: http://bt.mta.info/wiki/Developers/Index

Or, just go to the MTA developer site and find it there.

# How to use it
## In the browser
To use in a html file add this to your <head> tag: 

```<script src="https://cdn.jsdelivr.net/gh/ZarmDev/transitHelper@latest/dist/bundle.js"></script>```

(Note that sometimes it doesn't update immediately or I forget to deploy it to the bundle.js lol - if that happens just make an issue or you can run npm run deploy yourself to get a bundle.js file)

## In node.js
Just copy the index.js file in the build folder and put the file in your project.

Then, import it in your file that you want the functions to be available.
```import * as tH from './index.js'```

Or, just import whatever you need:
``` import { getTrainLineShapes, getTrainArrivals } from './index.js'```

## In React-native
You can just copy the src/index.ts file and put it in your React-native project. Then, you can import it anyway you want:

```import * as tH from './index.ts'```

OR

``` import { getTrainLineShapes, getTrainArrivals } from './index.ts'```

# Is this trustworthy?
Well the data is from the MTA site and the actual code is pretty short so you could review it. The dependencies aren't uncommon except gtfs-realtime-bindings, which is from https://github.com/MobilityData/gtfs-realtime-bindings and the example is here: https://github.com/MobilityData/gtfs-realtime-bindings/blob/master/nodejs/README.md

# How to edit the code (short explanation)
If you are considering using this, use the file src/server-to-test.ts and it has examples for every function that work.

To see how to use a function, find the app.get with the function name. (scroll through the file)

To actually try the function, clone the repository and
run ```npm run start```. Wait until you see localhost://whateveritshows and then you can open that link and put the function name in the url.

For example:

After running npm run start and going to ```http://localhost:8082/getTrainLineShapes``` you should
see output in the console.

**All the routes are specified in server-to-test.ts**

# How to edit the code (long explanation)
To edit the code:
1. Clone the repo
2. Add your changes
3. Run npm install
4. Run npm run start
- You will see localhost:8082 appear. You can hold crtl and click it to see it in the browser.
- Say I wanted to see the train arrivals, you would go to the browser and go to the url of "localhost:8082/realtimeTrainData"
- By default, it's going to give you a 1 train stop which I forgot where it was
- If you want to see other stop arrivals, you can go to server-to-test.ts and find ```app.get('/realtimeTrainData', async (req, res) => {```
- In the ```try {}``` block of code, you can add your own stop id and the corresponding line.
- What is a stop id? Well, basically in your assets folder you should see a stops.txt file in the google_transit folder or whatever the folder is called from the MTA developer site. (if you followed the instructions earlier)
- To find a stop id, use the find tool (crtl + f on windows) and look for whichever stop you want.
- For example, the second line in stops.txt is:
"106,Marble Hill-225 St,40.874561,-73.909831,1,"
- The stop id is 106
- Now, in server-to-test, set the targetStopID to 106, the line to 1 (you can search up what the line is online) and the direction to either "", "N" or "S". North and south are "N" and "S" and putting an empty string ("") means you want both directions.
- Do note that you should never put the targetStopID with the N or S for example, in "101N,Van Cortlandt Park-242 St,40.889248,-73.898583,,101" there are versions without and with N or S. Just put 101 without the N or S.
5. If you want to deploy it to a bundle, then run ```npm run deploy```
- A bundle is just using webpack to put everything in one JS file that can be used in the browser or even in Node.js.
- The bundles are provided for users in dist/bundle.js

# Notes
If you use tH.getTrainLineShapes, you may be wondering what FS, GS and SI are in the return value.
When testing on the map, it shows that **FS represents the Franklin Shuttle, GS stands for the Grand Central Shuttle, SI is the Staten Island Transit and H is the Rockaway Park
Shuttle**

# Documentation (work-in-progress)
> tH.getArrivals(line, targetStopID, unixTime, direction)

Example usage: (Please read the stuff below to understand this)
```
const targetStopID = '112'
const line = '1'
const direction = ""
const date = Date.now()
const realtime = await getTrainArrivals(line, targetStopID, date, direction);
```

> tH.getAllData(shouldAttemptToMerge)

Returns an object like:
```
{
    "stopID": {
        "coordinates": {longitude: "", latitude: ""},
        "trains": {},
        "stopname": "",
        "icon": "...",
        "alerts": []
    },
}
HOW IT (WOULD) ACTUALLY LOOK WITH WHITEHALL-ST FERRY (I made it up, not real data)
{
    "R27": {
        "coordinates": {longitude: "40.703087", latitude: "-74.012994"},
        "trains": {"1": "#FFFFFF", "R": "#FFFD37", "W": "#FFFD37"},
        "stopname": "Whitehall St-South Ferry",
        "icon": "1.svg, r.svg, w.svg",
        "alerts": ["1 train is running with delays while we address a switch problem at 34st Penn Station"]
    }
}
```

shouldAttemptToMerge is just a parameter to try to merge the google_transit folder with the new folder online just like in:
https://github.com/google/transitfeed/blob/104b5a5b339c62a94c1579d7209a41c7c0833e35/merge.py

MTA says:

"We ask that you do not manipulate the calendar.txt or calendar_dates.txt to extend the effective dates of any schedules. Instead, we encourage you to adopt one of the following strategies to mitigate any issues. This should get the best information to your users:

Hold newly-published datasets until they become active, and deploy them on that date.

Use a GTFS merge tool to prepare a merged GTFS dataset spanning the current and future timetables. There are several tools available for merging GTFS datasets, including:"

> tH.getAllTrainLineShapes(data)

Gets train line shapes to use in maps.
It's given like:
```
example {
    "1": {
        color: "red",
        // in leaflet.js format: [lat, lng], [lat, lng]
        layers: [[0.5, 1], [0.6, 0.7], ...]
    }
}
```

Although the MTA provides multiple stop "sequences," (not really sure what that is)

> tH.getNearbyStops() / tH.getNearbyTrainStops()


# FAQ

## Why the data parameter?
In the react-native app I was making, file reading didn't work.
So, I thought it would be good if:
- The user provides the data in whatever environment they are using
- The package is not preinstalled with every single google_transit
file - which reduces storage and let's user decide what to use
- The package can work in most places
For example, if you wanted to get the bus arrivals, you would have to go to https://new.mta.info/developers and under "Static GTFS data", you would have to install "Regular GTFS".
Finally, you would put the contents of the stops.txt folder as the data argument.

## How to get a route to a certain place?
Use leaflet routing machine (Node.js) or use react-native-maps directions (React Native)
This library does not provide any functions for that.

## Is it possible to use this for other cities?
Nope. Maybe https://mobilitydatabase.org/ will be used for other cities in the future.
