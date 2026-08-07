import type {Earthquake} from "../types/earthquake";
import config from "../config"
import apiClient from "./apiClient";

const EARTHQUAKES_URL = `${config.apiUrl}/api/v1/earthquakes`;

export const getEarthquakes = async(): Promise<Earthquake[]> => {

    const response = await apiClient.get<Earthquake[]>( //axios.get<Earthquake[]>(
        `${EARTHQUAKES_URL}?limit=8`
    );

    return response.data;
}