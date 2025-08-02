import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterBar = ({ onSearch, onFilter, onSort, activeFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const sortOptions = [
    { value: 'recent', label: 'Recently Modified', icon: 'Clock' },
    { value: 'created', label: 'Date Created', icon: 'Calendar' },
    { value: 'title', label: 'Title A-Z', icon: 'ArrowUpAZ' },
    { value: 'views', label: 'Most Viewed', icon: 'Eye' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Sessions', count: 0 },
    { value: 'draft', label: 'Drafts', count: 0 },
    { value: 'published', label: 'Published', count: 0 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and Toggle */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex-1 relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="search"
            placeholder="Search your sessions..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex-shrink-0"
        >
          <Icon name="Filter" size={16} className="mr-2" />
          Filters
          {Object.keys(activeFilters).length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilter('status', option.value)}
                  className="text-xs"
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className="ml-1 opacity-70">({option.count})</span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sort by
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.sort === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSort(option.value)}
                  className="text-xs"
                >
                  <Icon name={option.icon} size={14} className="mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
                onFilter('status', 'all');
                onSort('recent');
              }}
              className="text-xs"
            >
              <Icon name="RotateCcw" size={14} className="mr-1" />
              Clear All
            </Button>
            
            <div className="text-xs text-muted-foreground">
              {searchQuery && `Searching for "${searchQuery}"`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;