import type { EarthquakeResponse } from "../types/earthquakeResponse";
import "./EarthquakeSummary.css"

interface EarthquakeSummaryProps {
    earthquakes: EarthquakeResponse[];
    count: number;
    hasMore: boolean;
    limit: number;
}

function EarthquakeSummary ({
    earthquakes,
    count,
    hasMore,
    limit,
}: EarthquakeSummaryProps) {
    
    if(earthquakes.length === 0){
        return (
            <div className="earthquake-summary">
                <p>No hay sismos para mostrar</p>
            </div>
        )
    }

    const magnitudes = earthquakes.map(
        earthquake => earthquake.magnitude
    );

    const depths = earthquakes.map(
        earthquake => earthquake.depth_km
    );

    const maxMagnitude = Math.max(...magnitudes);
    const maxDepth = Math.max(...depths);

    const averageMagnitude = magnitudes.reduce((sum, magnitude) => sum+magnitude, 0)
    / magnitudes.length;

    return(
        <div className="earthquake-summary">
            <h3>Resumen</h3>
           <div className="earthquake-results-info">
                {hasMore ? (
                    <span>
                    Se encontraron más de {limit} sismos. Acota el rango de búsqueda.
                    </span>
                ) : (
                    <span>
                    Mostrando {count} resultados.
                    </span>
                )}
            </div>

            <div className="summary-stat">
                <span>Magnitud máxima</span>
                <strong>{maxMagnitude.toFixed(1)}</strong>
            </div>

            <div className="summary-stat">
                <span>Magnitud promedio</span>
                <strong>{averageMagnitude.toFixed(1)}</strong>
            </div>

            <div className="summary-stat">
                <span>Profundidad máxima</span>
                <strong>{maxDepth.toFixed(0)} Km</strong>
            </div>

        </div>
)
}

export default EarthquakeSummary;