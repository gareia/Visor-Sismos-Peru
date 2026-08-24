import type { EarthquakeFilters } from "../types/earthquakeFilters";

export const NON_FILTER_FIELDS = ["limit", "offset"];

export const hasActiveFilters = (filters: EarthquakeFilters): boolean => {

    return Object.entries(filters).some(
        ([key, value])=> 
            !NON_FILTER_FIELDS.includes(key) 
            && value !== undefined
            && value !== null
    );
}
