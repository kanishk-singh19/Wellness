import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  activeFilters, 
  onFilterChange, 
  onApplyFilters, 
  onClearFilters 
}) => {
  const handleCheckboxChange = (filterId, value, checked) => {
    const currentValues = activeFilters[filterId] || [];
    if (checked) {
      onFilterChange(filterId, [...currentValues, value]);
    } else {
      onFilterChange(filterId, currentValues.filter(v => v !== value));
    }
  };

  const isValueSelected = (filterId, value) => {
    return (activeFilters[filterId] || []).includes(value);
  };

  const hasActiveFilters = Object.values(activeFilters).some(values => values.length > 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-wellness"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed lg:relative inset-x-0 bottom-0 lg:inset-auto lg:w-80 bg-background border-t lg:border-t-0 lg:border-l border-border z-50 lg:z-auto max-h-[80vh] lg:max-h-none overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Advanced Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search within results */}
          <div>
            <Input
              label="Search within results"
              type="search"
              placeholder="Search sessions..."
              value={activeFilters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>

          {/* Filter Groups */}
          {filters.map((filterGroup) => (
            <div key={filterGroup.id}>
              <div className="flex items-center space-x-2 mb-3">
                <Icon name={filterGroup.icon} size={16} className="text-muted-foreground" />
                <h3 className="font-medium text-foreground">{filterGroup.label}</h3>
              </div>

              <div className="space-y-2 pl-6">
                {filterGroup.options.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        {option.count && (
                          <span className="text-xs text-muted-foreground">
                            ({option.count})
                          </span>
                        )}
                      </div>
                    }
                    checked={isValueSelected(filterGroup.id, option.value)}
                    onChange={(e) => handleCheckboxChange(filterGroup.id, option.value, e.target.checked)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Duration Range */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <h3 className="font-medium text-foreground">Duration</h3>
            </div>
            
            <div className="pl-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Min (minutes)"
                  type="number"
                  placeholder="0"
                  value={activeFilters.minDuration || ''}
                  onChange={(e) => onFilterChange('minDuration', e.target.value)}
                />
                <Input
                  label="Max (minutes)"
                  type="number"
                  placeholder="120"
                  value={activeFilters.maxDuration || ''}
                  onChange={(e) => onFilterChange('maxDuration', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Star" size={16} className="text-muted-foreground" />
              <h3 className="font-medium text-foreground">Minimum Rating</h3>
            </div>
            
            <div className="pl-6">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onFilterChange('minRating', rating)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-wellness ${
                      (activeFilters.minRating || 0) >= rating
                        ? 'bg-warning/20 text-warning' :'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name="Star" size={14} className="fill-current" />
                    <span>{rating}+</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onApplyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
          
          {hasActiveFilters && (
            <p className="text-xs text-center text-muted-foreground">
              {Object.values(activeFilters).flat().filter(Boolean).length} filters active
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvancedFilterPanel;