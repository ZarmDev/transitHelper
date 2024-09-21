# AI was used significantly here. Almost everything is not my code.
# But, it did take REALLY long to get here like I think it took a month for this to
# have the best results, even though I was just asking AI to make it

import pandas as pd

assetDir = './assets/trains/google_transit/'
stopsDir = assetDir + 'stops2.txt'
lateNightStopsDir = assetDir + 'night-stops2.txt'
routeDir = './assets/trains/routes/'
lateNightDir = './assets/trains/routes/late_night/'
normalScheduleDir = './assets/trains/routes/normal_schedule/'

# According to https://new.mta.info/document/9431 it's 12am - 6am for late night schedule
def getRouteOfEachLineNightSchedule():
    routes = pd.read_csv(assetDir + 'routes.txt')
    trips = pd.read_csv(assetDir + 'trips.txt')
    stop_times = pd.read_csv(assetDir + 'stop_times.txt')
    stops = pd.read_csv(assetDir + 'stops.txt')
    transfers = pd.read_csv(assetDir + 'transfers.txt')
    calendar = pd.read_csv(assetDir + 'calendar.txt')  # Load service calendar
    trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "7", "7d", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "w", "z"]
    trainLinesWithIcons = [line.upper() for line in trainLinesWithIcons]

    for currentTrain in trainLinesWithIcons:
        # Filter for the current train route
        route = routes[routes['route_short_name'] == currentTrain]

        # Get trips for the current train
        trip = trips[trips['route_id'].isin(route['route_id'])]

        # Get stop times for the current train trips
        stop_time = stop_times[stop_times['trip_id'].isin(trip['trip_id'])]

        # Convert arrival_time and departure_time to datetime
        stop_time['arrival_time'] = pd.to_datetime(stop_time['arrival_time'], format='%H:%M:%S', errors='coerce')
        stop_time['departure_time'] = pd.to_datetime(stop_time['departure_time'], format='%H:%M:%S', errors='coerce')

        # Filter for stop times after midnight and before 6am
        late_night_stop_time = stop_time[(stop_time['arrival_time'].dt.hour == 0) | (stop_time['departure_time'].dt.hour == 0) | (stop_time['arrival_time'].dt.hour <= 6) | (stop_time['departure_time'].dt.hour <= 6)]

        # Get stop details for the current train stops
        stop = stops[stops['stop_id'].isin(late_night_stop_time['stop_id'])]

        # Merge stop times with stop details
        route_stops = pd.merge(late_night_stop_time, stop, on='stop_id')

        # Select relevant columns and sort by trip and stop sequence
        route_stops = route_stops[['trip_id', 'stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'stop_sequence']]
        route_stops = route_stops.sort_values(by=['trip_id', 'stop_sequence'])

        # Remove duplicates based on stop_id, stop_sequence, and stop_name
        route_stops = route_stops.drop_duplicates(subset=['stop_id', 'stop_sequence', 'stop_name'])

        # Filter transfers based on stop_time
        transfer = transfers[transfers['from_stop_id'].isin(late_night_stop_time['stop_id'])]

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
        with open(f"{lateNightDir}stops-{currentTrain}.txt", 'w', newline='\n') as file:
            file.write("stop_id,stop_name,stop_lat,stop_lon\n")
            for index, row in route_stops.iterrows():
                file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']}\n")

        print(f"Route information for the {currentTrain} train has been written to '{routeDir}stops-{currentTrain}.txt'")

def getRouteOfEachLineNormalSchedule():
    routes = pd.read_csv(assetDir + 'routes.txt')
    trips = pd.read_csv(assetDir + 'trips.txt')
    stop_times = pd.read_csv(assetDir + 'stop_times.txt')
    stops = pd.read_csv(assetDir + 'stops.txt')
    transfers = pd.read_csv(assetDir + 'transfers.txt')
    calendar = pd.read_csv(assetDir + 'calendar.txt')  # Load service calendar
    trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "7", "7d", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "w", "z"]
    trainLinesWithIcons = [line.upper() for line in trainLinesWithIcons]

    for currentTrain in trainLinesWithIcons:
        # Filter for the current train route
        route = routes[routes['route_short_name'] == currentTrain]

        # Get trips for the current train
        trip = trips[trips['route_id'].isin(route['route_id'])]

        # Get stop times for the current train trips
        stop_time = stop_times[stop_times['trip_id'].isin(trip['trip_id'])]

        # Convert arrival_time and departure_time to datetime
        stop_time['arrival_time'] = pd.to_datetime(stop_time['arrival_time'], format='%H:%M:%S', errors='coerce')
        stop_time['departure_time'] = pd.to_datetime(stop_time['departure_time'], format='%H:%M:%S', errors='coerce')

        # Filter for stop times after midnight and before 6am
        late_night_stop_time = stop_time[(stop_time['arrival_time'].dt.hour < 22) | (stop_time['departure_time'].dt.hour < 22) | (stop_time['arrival_time'].dt.hour > 7) | (stop_time['departure_time'].dt.hour > 7)]

        # Get stop details for the current train stops
        stop = stops[stops['stop_id'].isin(late_night_stop_time['stop_id'])]

        # Merge stop times with stop details
        route_stops = pd.merge(late_night_stop_time, stop, on='stop_id')

        # Select relevant columns and sort by trip and stop sequence
        route_stops = route_stops[['trip_id', 'stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'stop_sequence']]
        route_stops = route_stops.sort_values(by=['trip_id', 'stop_sequence'])

        # Remove duplicates based on stop_id, stop_sequence, and stop_name
        route_stops = route_stops.drop_duplicates(subset=['stop_id', 'stop_sequence', 'stop_name'])

        # Filter transfers based on stop_time
        transfer = transfers[transfers['from_stop_id'].isin(late_night_stop_time['stop_id'])]

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
        with open(f"{normalScheduleDir}stops-{currentTrain}.txt", 'w', newline='\n') as file:
            file.write("stop_id,stop_name,stop_lat,stop_lon\n")
            for index, row in route_stops.iterrows():
                file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']}\n")

        print(f"Route information for the {currentTrain} train has been written to '{routeDir}stops-{currentTrain}.txt'")


getRouteOfEachLineNormalSchedule()
getRouteOfEachLineNightSchedule()

# def test():
#     # Load GTFS files
#     assetDir = './assets/trains/google_transit/'
#     routes = pd.read_csv(assetDir + 'routes.txt')
#     trips = pd.read_csv(assetDir + 'trips.txt')
#     stop_times = pd.read_csv(assetDir + 'stop_times.txt')
#     stops = pd.read_csv(assetDir + 'stops.txt')

#     # Filter for the 1 train route
#     route_1 = routes[routes['route_short_name'] == '1']

#     # Get trips for the 1 train
#     trips_1 = trips[trips['route_id'].isin(route_1['route_id'])]

#     # Get stop times for the 1 train trips
#     stop_times_1 = stop_times[stop_times['trip_id'].isin(trips_1['trip_id'])]

#     # Get stop details for the 1 train stops
#     stops_1 = stops[stops['stop_id'].isin(stop_times_1['stop_id'])]

#     # Merge stop times with stop details
#     route_1_stops = pd.merge(stop_times_1, stops_1, on='stop_id')

#     # Select relevant columns and sort by trip and stop sequence
#     route_1_stops = route_1_stops[['trip_id', 'stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'stop_sequence']]
#     route_1_stops = route_1_stops.sort_values(by=['trip_id', 'stop_sequence'])

#     # Write to a txt file
#     route_1_stops.to_csv(assetDir + 'stops2.txt', index=False)

#     print("Route information for the 1 train has been written to 'route_1_stops.txt'")

# test()

# def modifyStopsToHaveTrainLines():
#     routes = pd.read_csv(assetDir + 'routes.txt')
#     trips = pd.read_csv(assetDir + 'trips.txt')
#     stop_times = pd.read_csv(assetDir + 'stop_times.txt')
#     stops = pd.read_csv(assetDir + 'stops.txt')

#     # Merge data to get stops for each route
#     route_trips = pd.merge(routes, trips, on='route_id')
#     route_stop_times = pd.merge(route_trips, stop_times, on='trip_id')
#     route_stops = pd.merge(route_stop_times, stops, on='stop_id')

#     # Select relevant columns
#     route_stops = route_stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'route_short_name']]

#     # Group by stop_id and aggregate route_short_name
#     grouped_stops = route_stops.groupby(['stop_id', 'stop_name', 'stop_lat', 'stop_lon'])['route_short_name'].apply(lambda x: '-'.join(sorted(set(x)))).reset_index()

#     # Write to a txt file
#     # Ensure it doesn't add \r by adding newline='\n'
#     with open(stopsDir, 'w', newline='\n') as file:
#         file.write('stop_id,stop_name,stop_lat,stop_lon,train_lines\n')
#         for index, row in grouped_stops.iterrows():
#             file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']},{row['route_short_name']}\n")

#     print("Added regular stops2.txt!")

import pandas as pd

def modifyStopsToHaveTrainLines():
    assetDir = './assets/trains/google_transit/'
    routes = pd.read_csv(assetDir + 'routes.txt')
    trips = pd.read_csv(assetDir + 'trips.txt')
    stop_times = pd.read_csv(assetDir + 'stop_times.txt')
    stops = pd.read_csv(assetDir + 'stops.txt')

    # Merge data to get stops for each route
    route_trips = pd.merge(routes, trips, on='route_id')
    route_stop_times = pd.merge(route_trips, stop_times, on='trip_id')
    route_stops = pd.merge(route_stop_times, stops, on='stop_id')

    # Convert arrival_time and departure_time to datetime using .loc
    route_stops.loc[:, 'arrival_time'] = pd.to_datetime(route_stops['arrival_time'], format='%H:%M:%S', errors='coerce')
    route_stops.loc[:, 'departure_time'] = pd.to_datetime(route_stops['departure_time'], format='%H:%M:%S', errors='coerce')

    # Drop rows where conversion to datetime failed
    route_stops = route_stops.dropna(subset=['arrival_time', 'departure_time'])

    # Filter for stop times between 12 AM and 6 AM
    late_night_stops = route_stops[(route_stops['arrival_time'].dt.hour < 6) | (route_stops['arrival_time'].dt.hour == 0) |
                                   (route_stops['departure_time'].dt.hour < 6) | (route_stops['departure_time'].dt.hour == 0)]

    # Select relevant columns
    late_night_stops = late_night_stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'route_short_name']]

    # Group by stop_id and aggregate route_short_name
    grouped_stops = late_night_stops.groupby(['stop_id', 'stop_name', 'stop_lat', 'stop_lon'])['route_short_name'].apply(lambda x: '-'.join(sorted(set(x)))).reset_index()

    # Write to a txt file
    # Ensure it doesn't add \r by adding newline='\n'
    with open(f"{assetDir}stops2.txt", 'w', newline='\n') as file:
        file.write('stop_id,stop_name,stop_lat,stop_lon,train_lines\n')
        for index, row in grouped_stops.iterrows():
            file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']},{row['route_short_name']}\n")

    print("Done!")

modifyStopsToHaveTrainLines()

def modifyStopsToHaveTrainLinesLateNight():
    assetDir = './assets/trains/google_transit/'
    routes = pd.read_csv(assetDir + 'routes.txt')
    trips = pd.read_csv(assetDir + 'trips.txt')
    stop_times = pd.read_csv(assetDir + 'stop_times.txt')
    stops = pd.read_csv(assetDir + 'stops.txt')

    # Merge data to get stops for each route
    route_trips = pd.merge(routes, trips, on='route_id')
    route_stop_times = pd.merge(route_trips, stop_times, on='trip_id')
    route_stops = pd.merge(route_stop_times, stops, on='stop_id')

    # Convert arrival_time and departure_time to datetime
    route_stops['arrival_time'] = pd.to_datetime(route_stops['arrival_time'], format='%H:%M:%S', errors='coerce')
    route_stops['departure_time'] = pd.to_datetime(route_stops['departure_time'], format='%H:%M:%S', errors='coerce')

    # Filter for stop times between 12 AM and 6 AM
    late_night_stops = route_stops[(route_stops['arrival_time'].dt.hour < 6) | (route_stops['arrival_time'].dt.hour == 0) |
                                   (route_stops['departure_time'].dt.hour < 6) | (route_stops['departure_time'].dt.hour == 0)]

    # Select relevant columns
    late_night_stops = late_night_stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon', 'route_short_name']]

    # Group by stop_id and aggregate route_short_name
    grouped_stops = late_night_stops.groupby(['stop_id', 'stop_name', 'stop_lat', 'stop_lon'])['route_short_name'].apply(lambda x: '-'.join(sorted(set(x)))).reset_index()

    # Write to a txt file
    # Ensure it doesn't add \r by adding newline='\n'
    with open(lateNightStopsDir, 'w', newline='\n') as file:
        file.write('stop_id,stop_name,stop_lat,stop_lon,train_lines\n')
        for index, row in grouped_stops.iterrows():
            file.write(f"{row['stop_id']},{row['stop_name']},{row['stop_lat']},{row['stop_lon']},{row['route_short_name']}\n")

    print("Added late night stops2.txt!")

modifyStopsToHaveTrainLinesLateNight()
modifyStopsToHaveTrainLines()

