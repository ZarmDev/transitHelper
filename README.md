# transitHelper
The plan is to make this a library that let's you do commands like:
```
// expects stopID (which is from stops.txt) and unixTime (which is the current time in unix format)
// direction can either be "N", "S" or an empty string if you want both directions
tH.getArrivals(line, targetStopID, unixTime, direction)

tH.getRouteTo(data, fromstopID, tostopID)

tH.getServiceAlerts(data, optional: lineOrBus)

tH.getPlannedWork(data, optional: lineOrBus)

tH.getAllStopCoordinates(data, ) // returns all stop coordinates in NYC

tH.getTransfers(data, stopID) // will keep service alerts in mind?

tH.getLocationsOfVehicles(data, stopID)

tH.getAllData() // getAllData returns an object like:
{
    "stopID": {
        "coordinates": {longitude: "", latitude: ""},
        "trains": {},
        "name": "",
        "icon": "...",
        "alerts": []
    },
    >> example
    "R27": {
        "coordinates": {longitude: "40.703087", latitude: "-74.012994"},
        "trains": {"1": "#FFFFFF", "R": "#FFFD37", "W": "#FFFD37"},
        "name": "Whitehall St-South Ferry",
        "icon": "1.svg, r.svg, w.svg",
        "alerts": ["1 train is running with delays while we address a switch problem at 34st Penn Station"]
    }
}
```
Note: The library is preinstalled with subway icons but NOT
the google_transit folder - that you must supply to the library
yourself
# Why data parameter?
In the react-native app I was making, file reading didn't work.
So, I thought it would be good if:
- The user provides the data in whatever environment they are using
- The package is not preinstalled with every single google_transit
file - which reduces storage and let's user decide what to use
- The package can work in most places