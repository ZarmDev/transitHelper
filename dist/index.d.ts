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
export declare function getTrainArrivals(line: string, targetStopID: string, date: number, direction: string): Promise<ArrivalsInterface>;
interface TrainLineInterface {
    [coordinates: string]: [
        {
            latitude: number;
            longitude: number;
        },
        {
            latitude: number;
            longitude: number;
        }
    ];
}
type TrainLinesInterface = TrainLineInterface[];
export declare function getTrainLineShapes(data: string): Promise<TrainLinesInterface>;
interface TrainStopsInterface {
    [stopID: string]: {
        stopname: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        parent_station: string;
    };
}
export declare function getAllTrainStopCoordinates(data: string): Promise<TrainStopsInterface>;
export declare function getAllData(): Promise<void>;
export {};
