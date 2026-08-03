import axios from "axios";
import type {Earthquake} from "../types/earthquake";
import config from "../config"

export const getEarthquakes = async(): Promise<Earthquake[]> => {
    const response = await axios.get<Earthquake[]>(
        `${config.apiUrl}/earthquakes?limit=8`
    );
    return response.data;
}