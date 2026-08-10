import { useEffect, useState } from "react";
import type { EarthquakeResponse } from "../types/earthquakeResponse";
import type { EarthquakeFilters } from "../types/earthquakeFilters";
import EarthquakeMap from "./EarthquakeMap";
import FilterPanel from "./FilterPanel";
import type { EarthquakeListResponse } from "../types/earthquakeListResponse";
import { getEarthquakes } from "../services/earthquakeService";

function EarthquakeViewer(){

    const [earthquakes, setEarthquakes] = useState<EarthquakeResponse[]>([]);
    
    const [earthquakeCount, setEarthquakeCount] = useState(0);
    const [hasMoreEarthquakes, setHasMoreEarthquakes] = useState(false);
    const [earthquakeLimit, setEarthquakeLimit] = useState(0);


    const loadEarthquakes = async (newFilters: EarthquakeFilters = {}) => {

        try {
            console.log("llamando al endpoint con los nuevos filtros");
            const response: EarthquakeListResponse = await getEarthquakes(newFilters);
            setEarthquakes(response.data);
            setEarthquakeCount(response.count);
            setHasMoreEarthquakes(response.has_more);
            setEarthquakeLimit(response.limit);

        } catch(error) {
            console.error("Error loading earthquakes: ", error);
        }
    }

    const handleApplyFilters = ( newFilters: EarthquakeFilters = {}) => {
        loadEarthquakes(newFilters);
    }

    useEffect(()=>{loadEarthquakes();}, []);

    return (
        <>
           
            <FilterPanel
                onApply={handleApplyFilters}

                count={earthquakeCount}
                hasMore={hasMoreEarthquakes}
                limit={earthquakeLimit}
            />

            <EarthquakeMap earthquakes={earthquakes}/>
        </>
    )

}

export default EarthquakeViewer;