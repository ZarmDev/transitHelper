What will happen each render in react-native?

First, make a function to render each coordinate of the stops from stops.txt

Second, loop through the shapes.txt and render the transit lines

Third, make a function to match shapes.txt latitudes/longitudes
with stops.txt.

Fourth, go to each coordinate of the stops

get the station name AND id from the langitude and latitude

Fourth, use the backup.txt function with the station id to get the real time data

Notes:
In the react-native project, download google_transit every year
Cache the object from stops.txt in react-native