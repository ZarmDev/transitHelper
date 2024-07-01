# transitHelper
A Typescript library to make it easy to create a transit app. (Only for NYC)

It takes ~41MB (including node_modules) and depends on gtfs-realtime-binding, express and typescript.

The express library is only used to test the library (due to CORS) and will be added in a seperate file as a dev dependency.

This should work with any JS compatible library.
# All the commands and if they have been implemented
(✅ if implemented, ❕if it works but isnt finished, ❌ if not working or not implemented)
```
✅tH.getTrainArrivals(line, targetStopID, unixTime, direction)

❌tH.getBusArrivals(line, targetStopID, unixTime, direction)

❕tH.getTrainServiceAlerts(data, shouldIncludePlannedWork)

❌tH.getBusServiceAlerts(data, shouldIncludePlannedWork)

✅tH.getAllTrainStopCoordinates(data)

❌tH.getAllBusStopCoordinates(data)

❌tH.getAllFerryStopCoordinates(data)

❌tH.getAllStopCoordinates(data)

❌tH.getTransfers(data, stopID) // When using this keep in mind construction, service alerts, etc

❌tH.getLocationsOfTrains(data, stopID)

❌tH.getLocationsOfBuses(data, stopID)

❌tH.getTrainLineShapes(data)

❌tH.getAllData()
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

> tH.getAllData()

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
