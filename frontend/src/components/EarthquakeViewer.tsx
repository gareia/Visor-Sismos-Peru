import { useCallback, useEffect, useState } from "react";
import type { EarthquakeResponse } from "../types/earthquakeResponse";
import type { EarthquakeFilters } from "../types/earthquakeFilters";
import EarthquakeMap from "./EarthquakeMap";
import FilterPanel from "./FilterPanel";
import type { EarthquakeListResponse } from "../types/earthquakeListResponse";
import { getEarthquakes } from "../services/earthquakeService";
import EarthquakeSummary from "./EarthquakeSummary";
import type { SpatialFilter } from "../types/spatialFilter";

function EarthquakeViewer(){

    const [earthquakes, setEarthquakes] = useState<EarthquakeResponse[]>([]);

    const [earthquakeCount, setEarthquakeCount] = useState(0);
    const [hasMoreEarthquakes, setHasMoreEarthquakes] = useState(false);
    const [earthquakeLimit, setEarthquakeLimit] = useState(0);

    const [filters, setFilters] = useState<EarthquakeFilters>({});

    const loadEarthquakes = async () => {

        try {
            const response: EarthquakeListResponse = await getEarthquakes(filters); //newFilters);
            setEarthquakes(response.data);
            setEarthquakeCount(response.count);
            setHasMoreEarthquakes(response.has_more);
            setEarthquakeLimit(response.limit);

        } catch(error) {
            console.error("Error loading earthquakes: ", error);
        }
    }

    const handleApplyFilters = useCallback( ( newFilters: EarthquakeFilters = {}) => {
        
        setFilters(prevFilters => ({...prevFilters, ...newFilters}));

    }, [] );

    const handleSpatialFilterChange = useCallback( (spatialFilter: SpatialFilter) => {
        
        setFilters(prevFilters => ({...prevFilters, spatial_filter: spatialFilter})); 

    }, [] );

    /*const handleSpatialFilterChange = useCallback( (spatialFilter: SpatialFilter) => {
        
        const newFilters: EarthquakeFilters = {
            ...filters,
            spatial_filter: spatialFilter,
        }
        setFilters(newFilters);

    }, [filters] );*/

    useEffect(()=>{loadEarthquakes();}, [filters]);

    useEffect(() => { console.log("FILTERS CAMBIÓ:", filters); }, [filters]);
    useEffect(() => { console.log("handleSpatialFilterChange CAMBIÓ"); }, [handleSpatialFilterChange]);

    return (
        <div className="map-container">
            <FilterPanel
                onApply={handleApplyFilters}
            />

            <EarthquakeMap 
                earthquakes={earthquakes}
                onSpatialFilterChange={handleSpatialFilterChange }
            />

            <EarthquakeSummary 
                earthquakes={earthquakes}
                count={earthquakeCount}
                hasMore={hasMoreEarthquakes}
                limit={earthquakeLimit}
            />
        </div>
    )

}

export default EarthquakeViewer;