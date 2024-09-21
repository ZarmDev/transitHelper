# AI was used significantly here. Almost everything is not my code.
# But, it did take REALLY long to get here like I think it took a month for this to
# have the best results, even though I was just asking AI to make it

import pandas as pd

assetDir = './assets/trains/google_transit/'
stopsDir = assetDir + 'stops2.txt'
lateNightStopsDir = assetDir + 'night-stops2.txt'
routeDir = './assets/trains/routes/'

def getRouteOfEachLineNormalSchedule():
    routes = pd.read_csv(assetDir + 'routes.txt')
    trips = pd.read_csv(assetDir + 'trips.txt')
    stop_times = pd.read_csv(assetDir + 'stop_times.txt')
    stops = pd.read_csv(assetDir + 'stops.txt')
    transfers = pd.read_csv(assetDir + 'transfers.txt')
    calendar = pd.read_csv(assetDir + 'calendar.txt')  # Load service calendar
    trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "7", "7d", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "w", "z"]
    trainLinesWithIcons = [line.upper() for line in trainLinesWithIcons]

    # Determine the current day of the week
    # current_day = 'saturday'  # Change this based on the current day

    for currentTrain in trainLinesWithIcons:
        # Filter for the current train route
        route = routes[routes['route_short_name'] == currentTrain]

        # Get trips for the current train
        trip = trips[trips['route_id'].isin(route['route_id'])]

        # Filter trips based on the current service schedule
        # active_service_ids = calendar[calendar[current_day] == 1]['service_id']
        # trip = trip[trip['service_id'].isin(active_service_ids)]

        # Get stop times for the current train trips
        stop_time = stop_times[stop_times['trip_id'].isin(trip['trip_id'])]

        # Get stop details for the current train stops
        stop = stops[stops['stop_id'].isin(stop_time['stop_id'])]

        # Merge stop times with stop details
        route_stops = pd.merge(stop_time, stop, on='stop_id')

        # Select relevant columns and sort by trip and stop sequence
        route_stops = route_stops[['trip_id', 'stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'stop_sequence']]
        route_stops = route_stops.sort_values(by=['trip_id', 'stop_sequence'])

        # Remove duplicates based on stop_id, stop_sequence, and stop_name
        route_stops = route_stops.drop_duplicates(subset=['stop_id', 'stop_sequence', 'stop_name'])

        # Filter transfers based on stop_time
        transfer = transfers[transfers['from_stop_id'].isin(stop_time['stop_id'])]

        # print(f"Transfers for {currentTrain} train:\n", transfer.head())

        # Merge transfer information
        route_stops = pd.merge(route_stops, transfer, left_on='stop_id', right_on='from_stop_id', how='left')

        # Add route_id to the final DataFrame
        route_stops = pd.merge(route_stops, trip[['trip_id', 'route_id']], on='trip_id')

        # Remove lines where stop_sequence is 1 (except for the first stop)
        route_stops = route_stops[~((route_stops['stop_sequence'] == 1) & (route_stops.duplicated(subset=['route_id'], keep='first')))]
        
        # Keep only the stop_id, stop_name, stop_lat, and stop_lon columns and remove duplicates
        route_stops = route_stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon']].drop_duplicates()

        # Write to a txt file
        with open(f"{routeDir}stops-{currentTrain}.txt", 'w', newline='\n') as file:
            file.write("stop_id,stop_name,stop_lat,stop_lon\n")
            for index, row in route_stops.iterrows():
                file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']}\n")

        print(f"Route information for the {currentTrain} train has been written to '{routeDir}stops-{currentTrain}.txt'")

def modifyStopsToHaveTrainLines():
    routes = pd.read_csv(assetDir + 'routes.txt')
    trips = pd.read_csv(assetDir + 'trips.txt')
    stop_times = pd.read_csv(assetDir + 'stop_times.txt')
    stops = pd.read_csv(assetDir + 'stops.txt')

    # Merge data to get stops for each route
    route_trips = pd.merge(routes, trips, on='route_id')
    route_stop_times = pd.merge(route_trips, stop_times, on='trip_id')
    route_stops = pd.merge(route_stop_times, stops, on='stop_id')

    # Select relevant columns
    route_stops = route_stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'route_short_name']]

    # Group by stop_id and aggregate route_short_name
    grouped_stops = route_stops.groupby(['stop_id', 'stop_name', 'stop_lat', 'stop_lon'])['route_short_name'].apply(lambda x: '-'.join(sorted(set(x)))).reset_index()

    # Write to a txt file
    # Ensure it doesn't add \r by adding newline='\n'
    with open(stopsDir, 'w', newline='\n') as file:
        file.write('stop_id,stop_name,stop_lat,stop_lon,train_lines\n')
        for index, row in grouped_stops.iterrows():
            file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']},{row['route_short_name']}\n")

    print("Done!")

getRouteOfEachLineNormalSchedule()
modifyStopsToHaveTrainLines()