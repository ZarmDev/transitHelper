- Shorten the routes folder and stops2.txt (all stop data files) to not include North and South data and instead just one of them with no directions to greatly shorten lookup times + storage
- Fix the GTFS data not including service changes and stuff
- Fix npm package

- Filter service alerts for planned work that is happening within this time
- For getArrivals make it so you can just supply an array for line because that's probably better for performance, as running the function in a for loop is bad and will read the same txt files multiple times (also change the parameter name to lines)
- Maybe gonna use this to help in the future: https://github.com/Bus-Data-NYC/shape-with-stops
- In the future, maybe just query this for colors? https://data.ny.gov/Transportation/MTA-Colors/3uhz-sej2/about_data
- Add instructions on how to deal with stops2.txt in README.md 
- Add instructions in utilties README.md
- Find a way to deal with trainLinesWithIcons variable and how to make it consistent
- Create a function to delete all unneccessary fiels in the assets folder (and if you do actually do that commit an assets folder that is purged but keep one with all the files you need)
# last updated GTFS data:
...