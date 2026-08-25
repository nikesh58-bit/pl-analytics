'use client';

interface FilterSidebarProps {
  minMinutes: number;
  onMinMinutesChange: (value: number) => void;
  maxMinutes: number;
}

export function FilterSidebar({ minMinutes, onMinMinutesChange, maxMinutes }: FilterSidebarProps) {
  return (
    <aside className="filter-sidebar" role="complementary" aria-label="Filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <label htmlFor="min-minutes">Min Minutes Played</label>
        <div className="slider-container">
          <input
            type="range"
            id="min-minutes"
            min={0}
            max={maxMinutes}
            value={minMinutes}
            onChange={(e) => onMinMinutesChange(parseInt(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={maxMinutes}
            aria-valuenow={minMinutes}
          />
          <span className="slider-value">{minMinutes}</span>
        </div>
        <p className="filter-hint">Adjust to filter players by minimum minutes played</p>
      </div>
    </aside>
  );
}