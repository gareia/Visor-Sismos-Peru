import axios from "axios";
import type {Earthquake} from "../types/earthquake";
import config from "../config"

const EARTHQUAKES_URL = `${config.apiUrl}/api/v1/earthquakes`;
const MAX_RETRIES = 6;
const RETRY_DELAY= 10000;

function sleep(ms: number): Promise<void>{
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wakeUpBackend(): Promise<void>{

    for(let attempt=1; attempt <= MAX_RETRIES; attempt++){

        try{
            await axios.get(`${config.apiUrl}/`);
            return;

        }catch(error){
            if(attempt === MAX_RETRIES){
                throw error;
            }

            console.log(`No se puede conectar al backend. Intento ${attempt}/${MAX_RETRIES}`);
            await sleep(RETRY_DELAY);
        }
    }

}

export const getEarthquakes = async(): Promise<Earthquake[]> => {

    await wakeUpBackend();

    const response = await axios.get<Earthquake[]>(
        `${EARTHQUAKES_URL}?limit=8`
    );

    return response.data;
}