import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SessionForm = ({ 
  sessionData, 
  onSave, 
  onPublish, 
  hasUnsavedChanges, 
  setHasUnsavedChanges,
  autoSaveStatus,
  lastSaved 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    jsonUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlValidation, setUrlValidation] = useState({ isValid: null, message: '' });

  // Mock tag suggestions
  const mockTagSuggestions = [
    "meditation", "yoga", "mindfulness", "breathing", "relaxation",
    "stress-relief", "wellness", "mental-health", "fitness", "healing",
    "chakra", "energy", "balance", "peace", "calm", "focus"
  ];

  useEffect(() => {
    if (sessionData) {
      setFormData({
        title: sessionData.title || '',
        tags: sessionData.tags ? sessionData.tags.join(', ') : '',
        jsonUrl: sessionData.jsonUrl || ''
      });
    }
  }, [sessionData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Handle tag suggestions
    if (name === 'tags') {
      const lastTag = value.split(',').pop().trim().toLowerCase();
      if (lastTag.length > 0) {
        const suggestions = mockTagSuggestions.filter(tag => 
          tag.toLowerCase().includes(lastTag) && 
          !value.toLowerCase().includes(tag.toLowerCase())
        );
        setTagSuggestions(suggestions.slice(0, 5));
        setShowTagSuggestions(suggestions.length > 0);
      } else {
        setShowTagSuggestions(false);
      }
    }

    // Handle URL validation
    if (name === 'jsonUrl' && value) {
      validateJsonUrl(value);
    } else if (name === 'jsonUrl' && !value) {
      setUrlValidation({ isValid: null, message: '' });
    }
  }, [errors, setHasUnsavedChanges]);

  const validateJsonUrl = useCallback(async (url) => {
    setIsValidatingUrl(true);
    
    try {
      // Basic URL validation
      new URL(url);
      
      // Check if URL ends with .json
      if (!url.toLowerCase().endsWith('.json')) {
        setUrlValidation({ 
          isValid: false, 
          message: 'URL must point to a JSON file (.json extension required)' 
        });
        return;
      }

      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUrlValidation({ 
        isValid: true, 
        message: 'Valid JSON URL format' 
      });
    } catch (error) {
      setUrlValidation({ 
        isValid: false, 
        message: 'Please enter a valid URL' 
      });
    } finally {
      setIsValidatingUrl(false);
    }
  }, []);

  const addTagSuggestion = (tag) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const lastTagIndex = formData.tags.lastIndexOf(',');
    const beforeLastTag = lastTagIndex > -1 ? formData.tags.substring(0, lastTagIndex + 1) : '';
    const newTags = [...currentTags.slice(0, -1), tag].join(', ');
    
    setFormData(prev => ({
      ...prev,
      tags: beforeLastTag ? beforeLastTag + ' ' + tag : newTags
    }));
    setShowTagSuggestions(false);
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.jsonUrl.trim()) {
      newErrors.jsonUrl = 'JSON file URL is required';
    } else if (urlValidation.isValid === false) {
      newErrors.jsonUrl = urlValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      onSave({
        ...formData,
        tags
      });
    }
  };

  const handlePublish = () => {
    if (validateForm()) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      onPublish({
        ...formData,
        tags
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {sessionData?.id ? 'Edit Session' : 'Create New Session'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Design your wellness session with title, tags, and content structure
          </p>
        </div>
        
        {/* Auto-save Status */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {autoSaveStatus === 'saving' && (
            <>
              <Icon name="Loader2" size={14} className="animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <Icon name="Check" size={14} className="text-success" />
              <span>Auto-saved</span>
            </>
          )}
          {lastSaved && (
            <span className="text-xs">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Session Title */}
      <div className="space-y-2">
        <Input
          label="Session Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter a descriptive title for your wellness session"
          error={errors.title}
          required
          description="Choose a clear, engaging title that describes your session's focus"
        />
      </div>

      {/* Tags Input with Suggestions */}
      <div className="space-y-2 relative">
        <Input
          label="Tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="meditation, mindfulness, stress-relief"
          error={errors.tags}
          required
          description="Add comma-separated tags to help users discover your session"
          onFocus={() => {
            if (formData.tags) {
              const lastTag = formData.tags.split(',').pop().trim().toLowerCase();
              if (lastTag.length > 0) {
                const suggestions = mockTagSuggestions.filter(tag => 
                  tag.toLowerCase().includes(lastTag)
                );
                setTagSuggestions(suggestions.slice(0, 5));
                setShowTagSuggestions(suggestions.length > 0);
              }
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowTagSuggestions(false), 200);
          }}
        />

        {/* Tag Suggestions Dropdown */}
        {showTagSuggestions && tagSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-wellness-lg z-50 max-h-40 overflow-y-auto">
            {tagSuggestions.map((tag, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addTagSuggestion(tag)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
              >
                <Icon name="Tag" size={14} className="text-muted-foreground" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tag Preview */}
        {formData.tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.split(',').map((tag, index) => {
              const trimmedTag = tag.trim();
              if (!trimmedTag) return null;
              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                >
                  <Icon name="Tag" size={12} className="mr-1" />
                  {trimmedTag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* JSON URL Input */}
      <div className="space-y-2">
        <Input
          label="JSON Content URL"
          type="url"
          name="jsonUrl"
          value={formData.jsonUrl}
          onChange={handleInputChange}
          placeholder="https://example.com/session-content.json"
          error={errors.jsonUrl}
          required
          description="Provide a URL to your JSON file containing the session structure and content"
        />

        {/* URL Validation Status */}
        {formData.jsonUrl && (
          <div className="flex items-center space-x-2 text-sm">
            {isValidatingUrl ? (
              <>
                <Icon name="Loader2" size={14} className="animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Validating URL...</span>
              </>
            ) : urlValidation.isValid === true ? (
              <>
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-success">{urlValidation.message}</span>
              </>
            ) : urlValidation.isValid === false ? (
              <>
                <Icon name="AlertCircle" size={14} className="text-destructive" />
                <span className="text-destructive">{urlValidation.message}</span>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="flex-1 transition-wellness"
          iconName="Save"
          iconPosition="left"
        >
          Save Draft
        </Button>
        
        <Button
          variant="default"
          onClick={handlePublish}
          className="flex-1 transition-wellness"
          iconName="Send"
          iconPosition="left"
        >
          {sessionData?.status === 'published' ? 'Update & Publish' : 'Publish Session'}
        </Button>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="flex items-center space-x-2 text-sm text-warning bg-warning/10 px-3 py-2 rounded-md">
          <Icon name="AlertTriangle" size={14} />
          <span>You have unsaved changes</span>
        </div>
      )}
    </div>
  );
};

export default SessionForm;