import GtfsRealTimeBindings from 'gtfs-realtime-bindings';
export declare function parseAndReturnFeed(url: string): Promise<GtfsRealTimeBindings.transit_realtime.FeedMessage>;
interface ServiceAlerts {
    [line: string]: {
        headerText: string;
        descriptionText: string | null;
    };
}
export declare function getTrainServiceAlerts(inHTMLFormat: boolean, shouldIncludePlannedWork: boolean): Promise<ServiceAlerts>;
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
        type: "bus" | "train";
        trainLine?: string;
    };
}
export declare function getAllBusStopCoordinates(stopData: string[]): StopInterface;
export declare function getAllTrainStopCoordinates(stopData: string[]): StopInterface;
/**
 * Function to get nearby bus stops.
 * @param allTrainStopCoordinates - The stop data as a string (just the contents of the stops.txt file)
 * @param location - The location in the format of [latitude, longitude].
 */
export declare function getNearbyStops(allTrainStopCoordinates: StopInterface, locationOfUser: [number, number], distance: number): StopInterface;
export declare function getNearbyBusStops(location: [string, string], latSpan: string, lonSpan: string, apiKey: string): Promise<any>;
export declare function getIconToURL(): {
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "7": string;
    "7d": string;
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    h: string;
    j: string;
    l: string;
    m: string;
    n: string;
    q: string;
    r: string;
    s: string;
    sf: string;
    sir: string;
    sr: string;
    w: string;
    z: string;
};
export declare function getTrainLinesWithIcons(): string[];
export {};
