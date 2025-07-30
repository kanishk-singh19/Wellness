import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AutoSaveIndicator from './AutoSaveIndicator';

const EditorToolbar = ({ 
  sessionData,
  hasUnsavedChanges,
  autoSaveStatus,
  lastSaved,
  onSave,
  onPublish,
  onPreview,
  isSaving,
  isPublishing
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/personal-session-dashboard');
      }
    } else {
      navigate('/personal-session-dashboard');
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-background border-b border-border shadow-wellness">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="transition-wellness"
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back
          </Button>

          {/* Session Info */}
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm font-medium text-foreground">
              {sessionData?.title || 'New Session'}
            </h1>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>
                {sessionData?.status === 'published' ? 'Published' : 'Draft'}
              </span>
              {sessionData?.createdAt && (
                <>
                  <span>•</span>
                  <span>
                    Created {new Date(sessionData.createdAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Auto-save Status */}
        <div className="hidden md:flex">
          <AutoSaveIndicator
            status={autoSaveStatus}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Preview Button - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="hidden lg:flex transition-wellness"
            iconName="Eye"
            iconPosition="left"
          >
            Preview
          </Button>

          {/* Save Draft */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            loading={isSaving}
            disabled={!hasUnsavedChanges}
            className="transition-wellness"
            iconName="Save"
            iconPosition="left"
          >
            <span className="hidden sm:inline">Save Draft</span>
            <span className="sm:hidden">Save</span>
          </Button>

          {/* Publish */}
          <Button
            variant="default"
            size="sm"
            onClick={onPublish}
            loading={isPublishing}
            className="transition-wellness"
            iconName="Send"
            iconPosition="left"
          >
            <span className="hidden sm:inline">
              {sessionData?.status === 'published' ? 'Update' : 'Publish'}
            </span>
            <span className="sm:hidden">
              {sessionData?.status === 'published' ? 'Update' : 'Publish'}
            </span>
          </Button>

          {/* More Actions */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              className="transition-wellness"
              iconName="MoreVertical"
            />
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-wellness-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-wellness z-50">
              <div className="py-2">
                <button
                  onClick={() => navigate('/session-detail-view')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                >
                  <Icon name="Eye" size={16} />
                  <span>Preview Session</span>
                </button>
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                >
                  <Icon name="Copy" size={16} />
                  <span>Duplicate Session</span>
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this session?')) {
                      navigate('/personal-session-dashboard');
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2 text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Delete Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Auto-save Status */}
      <div className="md:hidden px-4 pb-3">
        <AutoSaveIndicator
          status={autoSaveStatus}
          lastSaved={lastSaved}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;