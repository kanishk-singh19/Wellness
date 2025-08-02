import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, activeFilters, onFilterChange, onClearAll }) => {
  const handleChipClick = (filterId, value) => {
    const currentValues = activeFilters[filterId] || [];
    const isActive = currentValues.includes(value);
    
    if (isActive) {
      onFilterChange(filterId, currentValues.filter(v => v !== value));
    } else {
      onFilterChange(filterId, [...currentValues, value]);
    }
  };

  const isChipActive = (filterId, value) => {
    return (activeFilters[filterId] || []).includes(value);
  };

  const hasActiveFilters = Object.values(activeFilters).some(values => values.length > 0);

  return (
    <div className="bg-background border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Quick Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs text-primary hover:text-primary/80 transition-wellness flex items-center space-x-1"
            >
              <Icon name="X" size={12} />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filters.map((filterGroup) => (
            <div key={filterGroup.id}>
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={filterGroup.icon} size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {filterGroup.label}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterGroup.options.map((option) => {
                  const isActive = isChipActive(filterGroup.id, option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleChipClick(filterGroup.id, option.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-wellness ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-wellness'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      {option.label}
                      {option.count && (
                        <span className={`ml-1 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/60'}`}>
                          ({option.count})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;