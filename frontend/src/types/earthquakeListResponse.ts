import type { EarthquakeResponse } from "./earthquakeResponse";

export interface EarthquakeListResponse {
    data: EarthquakeResponse[];
    count: number;
    has_more: boolean;
    limit: number;
}