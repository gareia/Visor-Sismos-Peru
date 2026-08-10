import type { EarthquakeListResponse } from "../types/earthquakeListResponse";
import config from "../config"
import apiClient from "./apiClient";
import type { EarthquakeFilters } from "../types/earthquakeFilters";

const EARTHQUAKES_URL = `${config.apiUrl}/api/v1/earthquakes`;

export const getEarthquakes = async(
    filters: EarthquakeFilters = {}
): Promise<EarthquakeListResponse> => {

    const response = await apiClient.get( //axios.get<Earthquake[]>(
        EARTHQUAKES_URL,{ params: filters }
    );

    return response.data;
}