# transitHelper
The plan is to make this a library that let's you do commands like:
```
// expects stopID (which is from stops.txt) and unixTime (which is the current time in unix format)
tH.getArrivals(stopID, unixTime)

tH.getRouteTo(data, fromstopID, tostopID)

tH.getServiceAlerts(data, optional: lineOrBus)

tH.getPlannedWork(data, optional: lineOrBus)

tH.getAllStopCoordinates(data, ) // returns all stop coordinates in NYC

tH.getTransfers(data, stopID) // will keep service alerts in mind?

tH.getLocationsOfVehicles(data, stopID)

tH.mapStopIDToLocation() // returns an object like {"RN20": "40.712783,-74.011667"} (just maps each stopID to a longitude and latitude in case you need it)
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