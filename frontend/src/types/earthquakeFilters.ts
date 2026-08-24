import type { SpatialFilter } from "./spatialFilter";

export interface EarthquakeFilters {
    date?: string;
    min_magnitude?: number;
    max_magnitude?: number;
    limit?: number;
    offset?: number;
    spatial_filter?: SpatialFilter;
}

export const NON_FILTER_FIELDS = ["limit", "offset"];