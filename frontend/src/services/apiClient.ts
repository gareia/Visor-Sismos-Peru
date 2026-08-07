import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useConnectionStore } from "../stores/connectionStore";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    retryCount ?: number;
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000, //tiempo de espera en una petición
})

const MAX_RETRIES = 2;
const RETRY_DELAY = 10000; //tiempo de espera entre peticiones

function sleep(ms: number): Promise<void>{
    return new Promise((resolve)=>setTimeout(resolve, ms));
}

apiClient.interceptors.response.use(

    (response) => {
        
        const config = response.config as RetryAxiosRequestConfig;

        if(config.retryCount && config.retryCount > 0){
            console.log(`Interceptado positivo a la ${config.retryCount} vez`);
            useConnectionStore.getState().showReconnected();
        }

        return response;
    },

    async(error: AxiosError) => {
        
        const config = error.config as RetryAxiosRequestConfig | undefined;

        if (!config){
            return Promise.reject(error);
        }

        config.retryCount = config.retryCount ?? 0;

        const shouldRetry = !error.response || error.response.status >= 500;

        if (shouldRetry) {

            if(config.retryCount < MAX_RETRIES){

                config.retryCount += 1;
                useConnectionStore.getState().startRetry(config.retryCount, MAX_RETRIES);
                console.log(`Interceptado negativo. Intento ${config.retryCount}/${MAX_RETRIES}`);
                
                await sleep(RETRY_DELAY);
                return apiClient(config); //haz la misma petición

            } else{
                useConnectionStore.getState().showFailed();
                console.log(`Interceptado negativo. Conexión fallida`);
            }
        } 

        return Promise.reject(error);
    }
);

export default apiClient;