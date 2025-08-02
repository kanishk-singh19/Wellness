// src/pages/session-editor/components/SessionForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SessionForm = ({
  session,
  onPublish,
  onDraftSave,
  setHasUnsavedChanges,
}) => {
  const [title, setTitle] = useState(session?.title || '');
  const [tags, setTags] = useState(session?.tags?.join(', ') || '');
  const [jsonFileUrl, setJsonFileUrl] = useState(session?.json_file_url || '');

  const handleInputChange = () => {
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  };

  const handlePublishClick = () => {
    if (!onPublish) return console.error('Publish handler missing.');
    const payload = {
      id: session?._id,
      title,
      tags: tags.split(',').map(tag => tag.trim()),
      json_file_url: jsonFileUrl,
    };
    onPublish(payload);
  };

  const handleDraftClick = () => {
    if (!onDraftSave) return console.error('Draft handler missing.');
    const payload = {
      id: session?._id,
      title,
      tags: tags.split(',').map(tag => tag.trim()),
      json_file_url: jsonFileUrl,
    };
    onDraftSave(payload);
  };

  return (
    <form className="bg-card border border-border p-6 rounded-lg shadow-md space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      {/* JSON URL */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">JSON File URL</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          value={jsonFileUrl}
          onChange={(e) => {
            setJsonFileUrl(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="default" onClick={handlePublishClick}>
          <Icon name="Send" className="mr-2" />
          Publish
        </Button>
        <Button type="button" variant="outline" onClick={handleDraftClick}>
          <Icon name="Save" className="mr-2" />
          Save Draft
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
