# Just a function for contributers to use - it deletes unneccessary GTFS files

import os

input("Remember to create a copy of the assets folder before doing this.")

# Go to assets
os.chdir('assets')
# Go to trains folder
# os.chdir('trains')
# Go to google_transit
# os.chdir('google_transit')
currentDirectory = os.getcwd()

# Used AI to find out os.walk and os.path.join
for dirName, subdirList, fileList in os.walk(currentDirectory):
    print(f'Found directory: {dirName}')
    for file_name in fileList:
        print(f'\t{file_name}')
        if file_name in ['agency.txt', 'calendar_dates.txt', 'calendar.txt', 'routes.txt', 'stop_times.txt', 'trips.txt']:
            file_path = os.path.join(dirName, file_name)
            os.remove(file_path)

# for file_name in os.listdir(currentDirectory):
#     file_path = os.path.join(currentDirectory, file_name)
#     if file_name in ['agency.txt', 'calendar_dates.txt', 'calendar.txt', 'routes.txt', 'stop_times.txt', 'trips.txt']:
#         print(file_name)
#         os.remove(file_path)

# os.chdir('../buses')
# os.chdir()
# currentDirectory = os.getcwd()

# for file_name in os.listdir(currentDirectory):
#     file_path = os.path.join(currentDirectory, file_name)
#     if file_name in ['agency.txt', 'calendar_dates.txt', 'calendar.txt', 'routes.txt', 'stop_times.txt', 'trips.txt']:
#         print(file_name)
#         os.remove(file_path)