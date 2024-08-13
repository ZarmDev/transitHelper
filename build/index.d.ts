import GtfsRealTimeBindings from 'gtfs-realtime-bindings';
export declare function parseAndReturnFeed(url: string): Promise<GtfsRealTimeBindings.transit_realtime.FeedMessage>;
interface ServiceAlerts {
    [line: string]: {
        headerText: string;
        descriptionText: string | null;
    };
}
export declare function getTrainServiceAlerts(shouldIncludePlannedWork: boolean): Promise<Partial<ServiceAlerts>>;
export declare function unixTimestampToDateTime(unixTimestamp: number): Date;
interface ArrivalInterface {
    arrivalTime: number;
    direction: string;
    line: string;
}
type ArrivalsInterface = ArrivalInterface[];
export declare function getTrainArrivals(line: string, targetStopID: string, date: number, direction: string): Promise<string | ArrivalsInterface>;
interface BusArrival {
    MonitoredVehicleJourney: any;
    RecordedAtTime: string;
}
type BusArrivalInterface = BusArrival[];
export declare function getBusArrivals(busLine: string, targetStopID: string, date: number, direction: string, apiKey: string): Promise<BusArrivalInterface>;
interface TrainLineInterface {
    [trainLine: string]: {
        color: string;
        layers: [number, number][];
    };
}
export declare function getTrainLineShapes(data: string[]): Promise<TrainLineInterface>;
interface StopInterface {
    [stopID: string]: {
        stopname: string;
        coordinates: [number, number];
        parent_station: string;
        type: "bus" | "train";
        trainLine?: string;
    };
}
export declare function processBusStopData(stopData: string[]): StopInterface;
export declare function processTrainStopData(stopData: string[]): StopInterface;
/**
 * Function to get nearby bus stops.
 * @param processedStopData - The stop data as a string (just the contents of the stops.txt file)
 * @param location - The location in the format of [latitude, longitude].
 */
export declare function getNearbyStops(processedStopData: StopInterface, locationOfUser: [number, number], distance: number): StopInterface;
export declare function getNearbyBusStops(location: [string, string], latSpan: string, lonSpan: string, apiKey: string): Promise<any>;
export declare function getIconURLFromTrainString(): void;
export {};
