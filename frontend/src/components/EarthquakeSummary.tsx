import { type EarthquakeFilters } from "../types/earthquakeFilters";
import type { EarthquakeResponse } from "../types/earthquakeResponse";
import { hasActiveFilters } from "../utils/filterUtils";
import "./EarthquakeSummary.css"

interface EarthquakeSummaryProps {
    earthquakes: EarthquakeResponse[];
    filters: EarthquakeFilters;
    count: number;
    hasMore: boolean;
    limit: number;
}

function EarthquakeSummary ({
    earthquakes,
    filters,
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

    const activeFilters = hasActiveFilters(filters);

    return (
        <div className="earthquake-summary">

            {activeFilters && (
                <section className="active-filters">
                    <div className="active-filters-header">
                        <span className="active-filters-indicator"></span>
                        <h3>Filtros activos</h3>
                    </div>

                    <div className="active-filters-list">
                        {filters.date && (
                            <div className="filter-chip">
                                <span className="filter-chip-label">Fecha</span>
                                <span className="filter-chip-value">
                                    {filters.date}
                                </span>
                            </div>
                        )}

                        {filters.min_magnitude !== undefined && (
                            <div className="filter-chip">
                                <span className="filter-chip-label">Min. magnitud</span>
                                <span className="filter-chip-value">
                                    {filters.min_magnitude}
                                </span>
                            </div>
                        )}

                        {filters.max_magnitude !== undefined && (
                            <div className="filter-chip">
                                <span className="filter-chip-label">Máx. magnitud</span>
                                <span className="filter-chip-value">
                                    {filters.max_magnitude}
                                </span>
                            </div>
                        )}

                        {filters.spatial_filter && (
                            <div className="filter-chip">
                                <span className="filter-chip-label">
                                    Filtro espacial
                                </span>
                                <span className="filter-chip-value">
                                    {filters.spatial_filter.type === "circle"
                                        ? "Círculo"
                                        : "Polígono"
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="summary-section">
                <h3>Resumen</h3>

                <div className="earthquake-results-info">
                    {hasMore ? (
                        <span>
                        Se encontraron <strong>más de {limit} sismos</strong>. Acota el rango de búsqueda.
                        </span>
                    ) : (
                        <span>
                        Mostrando <strong>{count} sismos</strong>.
                        </span>
                    )}
                </div>

                <div className="summary-stats">
                    <div className="summary-stat">
                        <span>Magnitud máx</span>
                        <strong>{maxMagnitude.toFixed(1)}</strong>
                    </div>

                    <div className="summary-stat">
                        <span>Magnitud promedio</span>
                        <strong>{averageMagnitude.toFixed(1)}</strong>
                    </div>

                    <div className="summary-stat">
                        <span>Profundidad máx</span>
                        <strong>{maxDepth.toFixed(0)} Km</strong>
                    </div>
                </div>
            </section>
        </div>
)
}

export default EarthquakeSummary;