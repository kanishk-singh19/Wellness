import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SessionActionBar = ({ 
  sessionData = null, 
  isEditing = false, 
  hasUnsavedChanges = false,
  onSave = () => {},
  onPublish = () => {},
  onDelete = () => {},
  onEdit = () => {},
  onDuplicate = () => {},
  onShare = () => {}
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData && sessionData) {
      const user = JSON.parse(userData);
      setIsOwner(sessionData.createdBy === user.id);
    }
  }, [sessionData]);

  const isEditorPage = location.pathname === '/session-editor';
  const isDetailPage = location.pathname === '/session-detail-view';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (!isEditorPage && !isDetailPage) {
    return null;
  }

  return (
    <div className="sticky top-16 z-30 bg-background border-b border-border shadow-wellness">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="transition-wellness"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back
          </Button>

          {isEditorPage && sessionData && (
            <div className="hidden sm:flex items-center space-x-2 ml-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Last saved: {sessionData.lastSaved || 'Never'}</span>
              </div>
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-1 text-warning">
                  <Icon name="AlertCircle" size={14} />
                  <span className="text-xs">Unsaved changes</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {isEditorPage && (
            <>
              {/* Save Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                loading={isSaving}
                disabled={!hasUnsavedChanges}
                className="transition-wellness"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save Draft
              </Button>

              {/* Publish Button */}
              <Button
                variant="default"
                size="sm"
                onClick={handlePublish}
                loading={isPublishing}
                className="transition-wellness"
              >
                <Icon name="Send" size={16} className="mr-2" />
                Publish
              </Button>

              {/* Preview Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/session-detail-view')}
                className="hidden lg:flex transition-wellness"
              >
                <Icon name="Eye" size={16} className="mr-2" />
                Preview
              </Button>
            </>
          )}

          {isDetailPage && isOwner && (
            <>
              {/* Edit Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/session-editor')}
                className="transition-wellness"
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Edit
              </Button>

              {/* Share Button */}
              <Button
                variant="default"
                size="sm"
                onClick={onShare}
                className="transition-wellness"
              >
                <Icon name="Share2" size={16} className="mr-2" />
                Share
              </Button>
            </>
          )}

          {isDetailPage && !isOwner && (
            <>
              {/* Bookmark Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                className="transition-wellness"
              >
                <Icon name="Bookmark" size={16} className="mr-2" />
                Save
              </Button>

              {/* Share Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="transition-wellness"
              >
                <Icon name="Share2" size={16} />
              </Button>
            </>
          )}

          {/* More Actions Menu */}
          {(isEditorPage || (isDetailPage && isOwner)) && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="transition-wellness"
              >
                <Icon name="MoreVertical" size={16} />
              </Button>

              {showMoreActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-wellness-lg z-50">
                  <div className="py-2">
                    {isDetailPage && isOwner && (
                      <>
                        <button
                          onClick={() => {
                            onDuplicate();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Copy" size={16} />
                          <span>Duplicate</span>
                        </button>
                        <button
                          onClick={() => navigate('/session-editor')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Edit" size={16} />
                          <span>Edit Session</span>
                        </button>
                      </>
                    )}
                    
                    {isEditorPage && (
                      <>
                        <button
                          onClick={() => {
                            navigate('/session-detail-view');
                            setShowMoreActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Eye" size={16} />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => {
                            onDuplicate();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Copy" size={16} />
                          <span>Save as Template</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-border my-1"></div>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this session?')) {
                          onDelete();
                        }
                        setShowMoreActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2 text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                      <span>Delete Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Unsaved Changes Indicator */}
      {isEditorPage && hasUnsavedChanges && (
        <div className="sm:hidden px-4 pb-2">
          <div className="flex items-center space-x-2 text-xs text-warning bg-warning/10 px-3 py-2 rounded-md">
            <Icon name="AlertCircle" size={14} />
            <span>You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionActionBar;