# transitHelper
A Typescript library to make it easy to create a transit app. (Only for NYC)

It takes ~41MB (including node_modules) and depends on gtfs-realtime-binding, express and typescript.

The express library is only used to test the library (due to CORS) and will be added in a seperate file as a dev dependency.

This should work with any JS compatible library.

In the future (if this is published) you should run:

```npm install --production transitHelper```

To edit the code, just clone the repo and run:

```npm install```

# All the commands and if they have been implemented
(✅ if implemented, ❕if it works but isnt finished, ❌ if not working or not implemented)
```
Realtime functions:

✅tH.getTrainArrivals(line, targetStopID, unixTime, direction)

❌tH.getBusArrivals(line, targetStopID, unixTime, direction)

❕tH.getTrainServiceAlerts(shouldIncludePlannedWork)

❌tH.getBusServiceAlerts(data, shouldIncludePlannedWork)

❌tH.getTransfers(data, stopID) // When using this keep in mind construction, service alerts, etc

❌tH.getLocationsOfTrains(data, stopID)

❌tH.getLocationsOfBuses(data, stopID)

Not realtime data: (Updated every x months according to https://new.mta.info/developers/gtfs-schedules-transition)

> if you are making a transit app, you should probably ignore all of these functions below and only use tH.getAllData()

✅tH.getAllTrainStopCoordinates(data)

❌tH.getAllBusStopCoordinates(data)

❌tH.getAllFerryStopCoordinates(data)

❌tH.getAllStopCoordinates(data)

✅tH.getTrainLineShapes(data, shouldMatchWithColors)

❌tH.getAllData(shouldAttemptToMerge)
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