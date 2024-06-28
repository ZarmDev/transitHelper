# transitHelper
The plan is to make this a library that let's you do commands like:

tH.getArrivals(stopID, unixTime)

tH.getRouteTo(fromstopID, tostopID)

tH.getServiceAlerts(optional: lineOrBus)

tH.getPlannedWork(optional: lineOrBus)

tH.getAllStopCoordinates() // returns all stop coordinates in NYC

tH.getTransfers(stopID) // will keep service alerts in mind?

tH.getLocationsOfVehicles(stopID)

tH.mapStopIDToLocation() // returns an object like {"RN20": "40.712783,-74.011667"} (just maps each stopID to a longitude and latitude in case you need it)

Note: The library is preinstalled with subway icons but NOT
the google_transit folder - that you must supply to the library
yourself