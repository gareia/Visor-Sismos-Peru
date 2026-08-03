import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

    return (
        <MapContainer 
            style={{height:"100vh", width:"100%"}} 
            center={[-9.19, -75.015]} 
            zoom={5}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"/>

            {
                earthquakes.map((earthquake) => (
                    <Marker 
                        key={earthquake.id}
                        position={[earthquake.latitude, earthquake.longitude]}>
                        <Popup>
                            <strong>Magnitud:</strong> {earthquake.magnitude}
                            <br/>
                            <strong>Fecha:</strong> {earthquake.occurred_at}
                        </Popup>
                    </Marker>
                ))
            }
        </MapContainer>
    )
}