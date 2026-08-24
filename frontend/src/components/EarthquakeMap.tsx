
import { MapContainer, TileLayer, Popup, CircleMarker, ZoomControl } from "react-leaflet";
import "./EarthquakeMap.css";
import type { EarthquakeResponse } from '../types/earthquakeResponse';
import { formatPeruDate } from "../utils/dateUtils";
import SpatialFilterControl from "./SpatialFilterControl";

import  { type SpatialFilter} from "../types/spatialFilter";
import {REGLAS_MAGNITUD } from "../constants.ts";

interface EarthquakeMapProps {
    earthquakes: EarthquakeResponse[];
    onSpatialFilterChange: (filter: SpatialFilter) => void;
}

export default function EarthquakeMap({
    earthquakes,
    onSpatialFilterChange,
}: EarthquakeMapProps){

    function obtenerEstiloDesdeMagnitud(magnitud: number){
        return(
            REGLAS_MAGNITUD.find(regla => magnitud >= regla.min) ??
                REGLAS_MAGNITUD[REGLAS_MAGNITUD.length - 1]
        )
    }

    return (

        <MapContainer 
            style={{height:"100vh", width:"100%", position:"relative"}} 
            center={[-9.19, -75.015]} 
            zoom={5}
            zoomControl={false}
        >
            <SpatialFilterControl onSpatialFilterChange={onSpatialFilterChange}/>
            <ZoomControl position="bottomleft"/>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"/>

            {   earthquakes.map((earthquake) => {
                    const estilo = obtenerEstiloDesdeMagnitud(earthquake.magnitude);
                    return (
                        <CircleMarker
                            key={earthquake.id}
                            center={[earthquake.latitude, earthquake.longitude]}
                            radius={estilo.radio}
                            pathOptions={{
                                color:estilo.color, 
                                fillColor: estilo.color, 
                                fillOpacity: 0.7
                            }}>
                                <Popup>
                                <strong>Magnitud:</strong> {earthquake.magnitude}
                                <br/>
                                <strong>Fecha:</strong> {formatPeruDate(earthquake.occurred_at)}
                                <br/>
                                <strong>Profundidad:</strong> {earthquake.depth_km} Km
                                <br/>
                            </Popup>
                        </CircleMarker>
                    );
                }
            )}

        </MapContainer>
    )
}