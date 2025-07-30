import React from 'react';
import Icon from '../../../components/AppIcon';

const PreviewPanel = ({ sessionData, formData }) => {
  const previewData = {
    title: formData?.title || sessionData?.title || 'Untitled Session',
    tags: formData?.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : sessionData?.tags || [],
    jsonUrl: formData?.jsonUrl || sessionData?.jsonUrl || '',
    status: sessionData?.status || 'draft',
    createdAt: sessionData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            previewData.status === 'published' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
          }`}>
            {previewData.status === 'published' ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        {/* Session Title */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-foreground line-clamp-2">
            {previewData.title}
          </h4>
          {!previewData.title.trim() && (
            <p className="text-sm text-muted-foreground italic">
              Enter a session title to see preview
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Tag" size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Tags</span>
          </div>
          {previewData.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {previewData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Add tags to categorize your session
            </p>
          )}
        </div>

        {/* Content URL */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Link" size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Content Source</span>
          </div>
          {previewData.jsonUrl ? (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-foreground break-all">
                {previewData.jsonUrl}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Icon name="FileText" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">JSON Content File</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Provide a JSON URL for session content
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground">Session Metadata</h5>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="text-foreground">{formatDate(previewData.createdAt)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Modified:</span>
              <span className="text-foreground">{formatDate(previewData.updatedAt)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  previewData.status === 'published' ? 'bg-success' : 'bg-warning'
                }`}></div>
                <span className="text-foreground capitalize">{previewData.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Structure Preview */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground">Expected Content Structure</h5>
          
          <div className="p-3 bg-muted/30 rounded-md">
            <pre className="text-xs text-muted-foreground overflow-x-auto">
{`{
  "title": "Session Title",
  "description": "Session description",
  "duration": "30 minutes",
  "difficulty": "beginner",
  "instructions": [
    "Step 1: Introduction",
    "Step 2: Main practice",
    "Step 3: Conclusion"
  ],
  "resources": {
    "audio": "audio-url",
    "video": "video-url"
  }
}`}
            </pre>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Your JSON file should follow this structure for optimal session rendering
          </p>
        </div>

        {/* Publishing Guidelines */}
        {previewData.status === 'draft' && (
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">Publishing Guidelines</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• Ensure all required fields are completed</li>
              <li>• Verify JSON URL is accessible and valid</li>
              <li>• Add relevant tags for better discoverability</li>
              <li>• Review content for accuracy before publishing</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;