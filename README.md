## Note
This library is still very new and not polished, and many features will change in the coming time.

If you really want to use it (ahem, no one) then **you should be fine if you use the realtime functions**. The other functions work but are definitely going to heavily change in a month or two so beware...
# transitHelper
A Typescript library to make it easy (cough, cough) to create a transit app. (Only for NYC)

It only depends on gtfs-realtime-binding and typescript.

The express library is only used to test the library (due to CORS) and is only installed as a dev dependency.

This works with:
- React-native
- In the browser 
- Node.js

If you wanna know why you can trust this library (I also have my doubts when installing new libraries) then you can scroll down to "Is this trustworthy?"

*It explains every folder and what the files do.*

# Showcase
Proof that it works:
https://github.com/ZarmDev/OpenTransitApp

Note that this project is still being developed, if you have any questions please open an issue :))))))

# Requirements before using this
## Requirements for using ANY function that is in the "Not realtime data" section (see "All the commands and if they have been implemented")
To use any function that doesn't require stopdata, you **MUST** have the GTFS data from the MTA.
This repository includes the GTFS data in the assets folder for your convenience, but you can also download it from https://new.mta.info/developers

Whenever a function requires a "data" parameter, you have to supply one of the text files from the GTFS data.

There are examples in the "Examples" section and also examples in server-to-test.ts

**IMPORTANT**

If you choose to download the data from the MTA site and not from this repository, do know that for any function that requires stop data, you need to use the stops2.txt file from this repository.

The reason stops2.txt even exists is because it adds trainlines to the file 

It was a solution made because it was very hard to get arrivals from stops without the data added in stops2.txt 
stops2.txt is generated from a file in utilities/addInfoToStops.ts

**This is definitely going to change soon, as although it works for some stops, the data is mostly inaccurate**

**Therefore, please avoid any of the non-realtime functions as of now until replacements are made for it.**

*Also don't install stops2.txt unless your desperate to use the library*😒
## Requirements for getting *realtime* bus data 
As the MTA developer site (https://new.mta.info/developers) mentions, "Real-time bus data is provided via the Bus Time set of APIs. You will need to create an account and use an API key to access the feeds."

You have to request an api key before getting **realtime** bus data. That being said, you can still get bus stop data so it's only if you need realtime data.

Here's the link: http://bt.mta.info/wiki/Developers/Index

Or, just go to the MTA developer site and find it there.

Once you got your api key, you should put it in a .env file as BUS_API_KEY (example env file:
BUS_API_KEY=your_api_key)

# Quickstart
## In node.js
```npm i transit-helper```

(**See "Is this trustworthy?" below for more info on if you can trust this library**)

Orrrrr, just copy the index.js file in the build folder and put the file in your project.

Then, import it in your file that you want the functions to be available.
```import * as tH from './index.js'```

Or, just import whatever you need:
``` import { getTrainLineShapes, getTrainArrivals } from './index.js'```

## In React-native
```npm i transit-helper```

Orrrrr, just copy the index.js file in the build folder and put the file in your react-native project.

```import * as tH from './index.ts'```

OR

``` import { getTrainLineShapes, getTrainArrivals } from './index.ts'```

## In the browser
To use in a html file add this to your <head> tag: 

```<script src="https://cdn.jsdelivr.net/gh/ZarmDev/transitHelper@latest/dist/bundle.js"></script>```

(Note that sometimes it doesn't update immediately or I forget to deploy it to the bundle.js lol - if that happens just make an issue or you can run npm run deploy yourself to get a bundle.js file)

# Examples
```
check back later (😓)
```

# All the commands and if they have been implemented
(✅ if implemented, ❕if it works but isnt finished, ❌ if not working or not implemented)
```
Realtime functions:

✅tH.getTrainArrivals(line, targetStopID, unixTime, direction)

❕tH.getBusArrivals(line, targetStopID, unixTime, direction, apiKey)

❕tH.getTrainServiceAlerts(shouldIncludePlannedWork)

❌tH.getBusServiceAlerts(data, shouldIncludePlannedWork, apiKey)

❌tH.getLocationsOfTrains(data, stopID)

❌tH.getLocationsOfBuses(data, stopID)

Not realtime data: (but, it's updated according to MTA schedule https://new.mta.info/developers/gtfs-schedules-transition)

✅tH.getTrainLineShapes(data)

✅tH.getAllTrainStopCoordinates(stopData);

✅tH.getAllBusStopCoordinates(stopData);

❌tH.getAllFerryStopCoordinates(data)

✅tH.getNearbyStops(allTrainStopCoordinates, locationOfUser, distance)

✅tH.getNearbyBusStops(location: [string, string], latSpan: string, lonSpan: string, apiKey: string)

❌tH.getCurrentBorough(locationOfUser)

❌tH.getStopsOnRoute(data, shouldCheckForAlertsOnLine)

❌tH.getBusStopsOnRoute(data, shouldCheckForAlertsOnLine)

❌tH.getTransfersAtTrainStop(data, stopID) // When using this you should also inform users of service alerts
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

# Utility functions
In the utilities folder, there are many important functions.

- addInfoToStops.ts: If you use ANY bus function that requires stop data then you would need to run this function. However, if you copied stops2.txt from the assets folder or just installed the entire assets folder everything will work fine :)
- createBusSvgs.js: As the name implies, it creates an image of each bus in each borough. It's pretty cool honestly you can try it out. It's just there for now...
- getStopsForEachTrainLine.js: Experimental function to try to replace addInfoToStops or just to create a new function for transitHelper
- RNaddInfoToStops.ts: React-native version of addInfoToStops. Kind of useless - might delete it later

# Is this trustworthy?
1. **None of the code executes unless YOU execute it! Therefore, you can review the code before running it**
2. The data in assets is from the MTA developer site, so if you don't trust it you can download it at the site.
3. Each folder has a purpose:
- assets: Where MTA data (GTFS data) is stored and the modified stops2.txt
- build: Where Typescript files are converted to Javascript files because Typescript files can't be run by themselves (as of now...)
- dist: Where the bundle.js file is (to use in browsers)
- src: Where the main files are
index.ts: Where the main functions are
server-to-test.ts: An express server to test the functions. If you don't know what express is don't worry about it you can just ignore this file unless your trying to contribute
- utilities: Useful functions, some of them are very important. To see the importance of each function check out "Utility functions above"
- package.json: Part of every Javascript package - where the package data is and what packages you installed
- tsconfig.json: Just to configure Typescript, specifically, it tells Typescript where to put your built files (like after running npm run build)
- tsconfig2.json: Another configuration file, it's for running a file in the utilities folder
- webpack.config.mjs: Tell the bundler (the thing that lets you create a bundle.js for browsers) to include or exclude files/folders
4. The dependencies aren't uncommon except gtfs-realtime-bindings, which is from https://github.com/MobilityData/gtfs-realtime-bindings

# How to edit the code (for contributers)
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

# Full Documentation (work-in-progress)
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

# Legal/Advice for app developers
According to the MTA:

"By accessing our data feeds, you are agreeing to these Terms and Conditions. This agreement authorizes you to download and host the data on a non-MTA server (maintained by you or a third party) and to make the data available to others who will access that non-MTA server.

MTA prohibits the development of an app that would make the data available to others directly from MTA's server(s)."
> This library provides the GTFS data in the assets folder and it's recommended you bundle the GTFS data into your app or host a mirror for your app.