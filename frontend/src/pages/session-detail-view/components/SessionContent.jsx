import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionContent = ({ session }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [showFullJson, setShowFullJson] = useState(false);

  if (!session) return null;

  const jsonPreview = session.jsonContent ? 
    JSON.stringify(JSON.parse(session.jsonContent), null, 2).slice(0, 500) + '...' : 'No JSON content available';

  const fullJson = session.jsonContent ? 
    JSON.stringify(JSON.parse(session.jsonContent), null, 2) : 
    'No JSON content available';

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'content', label: 'Session Content', icon: 'Code' },
    { id: 'details', label: 'Details', icon: 'Info' }
  ];

  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-wellness ${
              activeTab === tab.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'description' && (
          <div className="prose prose-gray max-w-none">
            <div className="text-foreground leading-relaxed">
              {session.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Session Objectives */}
            {session.objectives && session.objectives.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Target" size={20} />
                  <span>Session Objectives</span>
                </h3>
                <ul className="space-y-2">
                  {session.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span className="text-foreground">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {session.prerequisites && session.prerequisites.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="AlertCircle" size={20} />
                  <span>Prerequisites</span>
                </h3>
                <ul className="space-y-2">
                  {session.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Icon name="Dot" size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
                      <span className="text-foreground">{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Icon name="Code" size={20} />
                <span>JSON Session Content</span>
              </h3>
              {session.jsonUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(session.jsonUrl, '_blank')}
                >
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  View Full File
                </Button>
              )}
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <pre className="text-sm text-foreground font-mono overflow-x-auto whitespace-pre-wrap">
                {showFullJson ? fullJson : jsonPreview}
              </pre>
              
              {session.jsonContent && !showFullJson && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullJson(true)}
                  >
                    <Icon name="ChevronDown" size={16} className="mr-2" />
                    Show Full Content
                  </Button>
                </div>
              )}

              {showFullJson && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullJson(false)}
                  >
                    <Icon name="ChevronUp" size={16} className="mr-2" />
                    Show Less
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Icon name="Info" size={20} />
                <span>Session Information</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{session.duration} minutes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium text-foreground capitalize">{session.difficulty}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{session.category}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium text-foreground">{session.language || 'English'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Equipment Needed</span>
                  <span className="font-medium text-foreground">{session.equipment || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Icon name="BarChart3" size={20} />
                <span>Statistics</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Participants</span>
                  <span className="font-medium text-foreground">{session.participants}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-foreground">{session.rating}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < Math.floor(session.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium text-foreground">{session.createdDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-foreground">{session.updatedDate}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium text-foreground">{session.views}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionContent;