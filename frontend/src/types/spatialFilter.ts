
export interface CircleSpatialFilter {
    type: typeof SpatialFilterMode.CIRCLE;
    latitude: number;
    longitude: number;
    radius_km: number;
}

export interface PolygonSpatialFilter {
    type:typeof SpatialFilterMode.POLYGON;
    coordinates: [number, number][];
}

export type SpatialFilter = 
    | CircleSpatialFilter
    | PolygonSpatialFilter;

export const SpatialFilterMode = {
    NONE: "none",
    CIRCLE: "circle",
    POLYGON: "polygon",
} as const;

export type SpatialFilterMode =
    typeof SpatialFilterMode[
        keyof typeof SpatialFilterMode
    ];