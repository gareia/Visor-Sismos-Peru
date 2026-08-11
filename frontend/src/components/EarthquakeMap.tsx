
import { MapContainer, TileLayer, Popup, CircleMarker, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./EarthquakeMap.css";
import type { EarthquakeResponse } from '../types/earthquakeResponse';
import { formatPeruDate } from "../utils/dateUtils";

interface EarthquakeMapProps {
    earthquakes: EarthquakeResponse[];
}

export default function EarthquakeMap({
    earthquakes,
}: EarthquakeMapProps){


    const reglasMagnitud = [
        { min: 6, categoria: 'alta', color: 'red', radio: 8, descripcion: 'Alta (≥ 6)' },
        { min: 4.5, categoria: 'media', color: 'orange', radio: 6, descripcion: 'Media (≥ 4.5)' },
        { min: 0, categoria: 'baja', color: 'green', radio: 4, descripcion: 'Baja (≥ 0)' },
    ];

    function obtenerEstiloDesdeMagnitud(magnitud: number){
        return(
            reglasMagnitud.find(regla => magnitud >= regla.min) ??
                reglasMagnitud[reglasMagnitud.length - 1]
        )
    }

    return (
        <MapContainer 
            style={{height:"100vh", width:"100%"}} 
            center={[-9.19, -75.015]} 
            zoom={5}
            zoomControl={false}
        >
            <ZoomControl position="topright"/>
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