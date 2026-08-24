import { useMap } from "react-leaflet";
import  {type SpatialFilter, SpatialFilterMode } from "../types/spatialFilter";
import "./SpatialFilterControl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-draw";
import { Trash2 } from "lucide-react";

interface SpatialFilterControlProps {
    onSpatialFilterChange: (filter: SpatialFilter | undefined) => void;
}

function SpatialFilterControl ({
    onSpatialFilterChange
}:SpatialFilterControlProps) {

    const map = useMap();
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeTool, setActiveTool] = useState<SpatialFilterMode>(SpatialFilterMode.NONE);
    const [activeSpatialFilter, setActiveSpatialFilter] = useState(false);
    const drawHandlerRef = useRef<L.Draw.Feature | null>(null);
    const zoneGroupRef = useRef<L.FeatureGroup | null>(null);

    const LAYER_STYLE = {
        color: "#420b6e",
        //fillColor: "#fb7185",
        fillOpacity: 0.3,
        weight: 2
    };
    const TOOL_OPTIONS = {
      shapeOptions: LAYER_STYLE,
      metric: true,
      showRadius: true,
    }

    const stopDrawing = () => {
        drawHandlerRef.current?.disable();
        drawHandlerRef.current = null;
        setIsDrawing(false);
        setActiveTool("none");
    }
    const handleStartDrawing = (mode: String) => {
        
        stopDrawing();

        if(mode === SpatialFilterMode.CIRCLE){
            const handler = new L.Draw.Circle(map as L.DrawMap, TOOL_OPTIONS);
            drawHandlerRef.current = handler;
            handler.enable();
            setActiveTool(SpatialFilterMode.CIRCLE);
        }

        if(mode === SpatialFilterMode.POLYGON){
            const handler = new L.Draw.Polygon(map as L.DrawMap, TOOL_OPTIONS);
            drawHandlerRef.current = handler;
            handler.enable();
            setActiveTool(SpatialFilterMode.POLYGON);
        }

        setIsDrawing(true);

    }

    const handleClearSpatialFilter = useCallback(()=>{

        zoneGroupRef.current?.clearLayers();
        setActiveSpatialFilter(false);
        onSpatialFilterChange(undefined);

    }, [onSpatialFilterChange]);

    useEffect(() => {

        const zoneGroup = new L.FeatureGroup();
        zoneGroupRef.current = zoneGroup;
        map.addLayer(zoneGroup);

        const onCreated = (event: L.LeafletEvent) => {

            const e = event as L.DrawEvents.Created;
            zoneGroup.clearLayers();

            if(e.layerType===SpatialFilterMode.CIRCLE){
                const layer = e.layer as L.Circle;

                layer.setStyle(LAYER_STYLE);
                zoneGroup.addLayer(layer);
                
                const center = layer.getLatLng();
                const radiusKm = layer.getRadius() / 1000;

                const spatialFilter: SpatialFilter = {
                    type: SpatialFilterMode.CIRCLE,
                    latitude: center.lat,
                    longitude: center.lng, 
                    radius_km: radiusKm,
                }

                onSpatialFilterChange(spatialFilter);
            }

            if(e.layerType===SpatialFilterMode.POLYGON){
                const layer = e.layer as L.Polygon;

                layer.setStyle(LAYER_STYLE);
                zoneGroup.addLayer(layer);

                const geojson = layer.toGeoJSON();
                const coordinates = (geojson.geometry as GeoJSON.Polygon).coordinates[0];

                /*const latLngs = layer.getLatLngs()[0] as L.LatLng[];
                console.log("Polígono:", latLngs);

                const coordinates: [number, number][] = latLngs.map(
                (latLng) => [latLng.lng, latLng.lat]);*/

                const spatialFilter: SpatialFilter = {
                    type:SpatialFilterMode.POLYGON,
                    coordinates: coordinates as [number, number][],
                }
                
                onSpatialFilterChange(spatialFilter);
            }

            setActiveSpatialFilter(true);
            stopDrawing();

        }

        map.on(L.Draw.Event.CREATED, onCreated);

        return () => {

        map.off(L.Draw.Event.CREATED, onCreated);
        stopDrawing();
        map.removeLayer(zoneGroup);
        zoneGroupRef.current = null;

        }
    }, [map, onSpatialFilterChange]);

    return(
        <div className="spatial-filter-control">
            <button
                type="button"
                className={activeTool === SpatialFilterMode.CIRCLE ? "active": ""}
                onClick={() => handleStartDrawing(SpatialFilterMode.CIRCLE)}
                disabled={isDrawing}
            >
                { isDrawing 
                    && activeTool === SpatialFilterMode.CIRCLE 
                    ? "Dibujando círculo": "Dibujar círculo" }
            </button>
            <button
                className={activeTool === SpatialFilterMode.POLYGON ? "active": ""}
                onClick={() => handleStartDrawing(SpatialFilterMode.POLYGON)}
                disabled={isDrawing}
            >
                { isDrawing 
                    && activeTool === SpatialFilterMode.POLYGON 
                    ? "Dibujando polígono": "Dibujar polígono" }
            </button>
            {activeSpatialFilter && (
                <button
                    onClick={handleClearSpatialFilter}
                >
                    <Trash2 size={20} color="red"/>
                </button>
            )}
        </div>
    )
}

export default SpatialFilterControl;