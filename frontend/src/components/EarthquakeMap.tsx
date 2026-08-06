import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getEarthquakes } from '../services/earthquakeService';
import type { Earthquake } from '../types/earthquake';

export default function EarthquakeMap(){

    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

    useEffect(()=>{
        const loadEarthquakes = async () => {
            const data = await getEarthquakes();
            setEarthquakes(data);
        }
        loadEarthquakes();
    }, []);

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
            zoom={5}>
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
                                <strong>Fecha:</strong> {earthquake.occurred_at}
                            </Popup>
                        </CircleMarker>
                    );
                }
            )}
        </MapContainer>
    )
}