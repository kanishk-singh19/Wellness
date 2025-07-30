import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ currentSort, onSortChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  const currentOption = options.find(option => option.value === currentSort) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-wellness"
      >
        <Icon name="ArrowUpDown" size={16} />
        <span>{currentOption.label}</span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-wellness ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-wellness-lg z-50">
          <div className="py-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full px-4 py-2 text-left text-sm transition-wellness flex items-center space-x-2 ${
                  currentSort === option.value
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <Icon name={option.icon} size={16} />
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  )}
                </div>
                {currentSort === option.value && (
                  <Icon name="Check" size={16} className="ml-auto text-secondary-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;