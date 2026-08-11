import { useState } from "react";
import "./FilterPanel.css";
import type { EarthquakeFilters } from "../types/earthquakeFilters";

interface FilterPanelProps {
    onApply: (filters: EarthquakeFilters) => void;
    count: number;
    hasMore: boolean;
    limit: number;
}

function FilterPanel({ onApply, count, hasMore, limit
 }: FilterPanelProps){

 
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState("");
    const [minMagnitude, setMinMagnitude] = useState("");
    const [maxMagnitude, setMaxMagnitude] = useState("");

    const handleApply = () => {
        const newFilters: EarthquakeFilters = {
            date: selectedDate || undefined,
            min_magnitude: minMagnitude ? Number(minMagnitude) : undefined,
            max_magnitude: maxMagnitude ? Number(maxMagnitude) : undefined,
        };

        console.table(newFilters);

        onApply(newFilters);
    }
    const onClear = () => {
        setSelectedDate("");
        setMinMagnitude("");
        setMaxMagnitude("");
    }

    return (
        <>

            {
                isFilterOpen ? (
                <aside className={`side-panel left`}>
                    <button 
                        className="side-panel-close"
                        onClick={() => setIsFilterOpen(false)}
                        aria-label="Cerrar panel"
                    >
                        X
                    </button>
                    <div className="filter-panel">
                        <h2>Filtros</h2>
                        
                        <div className="filter-group">
                            <label htmlFor="earthquake-date">Fecha</label>
                            <input 
                                id="earthquake-date"
                                type="date"
                                value={selectedDate}
                                onChange={(event) => setSelectedDate(event.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Magnitud</label>

                            <div className="magnitude-range">
                                <div>
                                    <label htmlFor="min-magnitude">
                                        Mín.
                                    </label>
                                    <input
                                        id="min-magnitude"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="0.0"
                                        value={minMagnitude}
                                        onChange={(event)=>setMinMagnitude(event.target.value)}
                                    />
                                </div>

                                <span className="magnitude-separator">-</span>

                                <div>
                                    <label htmlFor="max-magnitude">
                                        Máx.
                                    </label>
                                    <input
                                        id="max-magnitude"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="10.0"
                                        value={maxMagnitude}
                                        onChange={(event)=>setMaxMagnitude(event.target.value)}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="filter-actions">
                            <button 
                                className="filter-apply"
                                onClick={handleApply}
                            >
                                Aplicar
                            </button>

                            <button 
                                className="filter-clear"
                                onClick={onClear}
                            >
                                Limpiar
                            </button>
                        </div>

                    </div>
                </aside>
                ) : (
                <button 
                    className="filter-toggle-button"
                    onClick={() => setIsFilterOpen(true)}
                >
                    ☰ Filtros
                </button>
                
                )
            }
        </>
    );
}

export default FilterPanel;