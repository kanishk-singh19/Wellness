import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ type = 'drafts' }) => {
  const navigate = useNavigate();

  const getEmptyStateContent = () => {
    switch (type) {
      case 'drafts':
        return {
          icon: 'FileText',
          title: 'No drafts yet',
          description: 'Start creating your first wellness session. Your drafts will be automatically saved as you work.',
          actionText: 'Create Your First Session',
          tips: [
            'Sessions are automatically saved as drafts',
            'You can edit and refine before publishing',
            'Add tags to help others discover your content'
          ]
        };
      case 'published':
        return {
          icon: 'Send',
          title: 'No published sessions',
          description: 'Once you publish your drafts, they\'ll appear here for the community to discover.',
          actionText: 'Publish a Draft',
          tips: [
            'Published sessions appear in public discovery',
            'You can unpublish anytime if needed',
            'Track views and engagement metrics'
          ]
        };
      case 'search':
        return {
          icon: 'Search',
          title: 'No sessions found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          actionText: 'Clear Filters',
          tips: [
            'Check your spelling and try different keywords',
            'Remove filters to see more results',
            'Browse all sessions instead'
          ]
        };
      default:
        return {
          icon: 'Heart',
          title: 'Welcome to WellnessHub',
          description: 'Start your wellness journey by creating and sharing meaningful sessions.',
          actionText: 'Get Started',
          tips: []
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon name={content.icon} size={32} className="text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {content.description}
      </p>

      <Button
        variant="default"
        onClick={() => {
          if (type === 'search') {
            // Handle clear filters
            window.location.reload();
          } else {
            navigate('/session-editor');
          }
        }}
        className="mb-6"
      >
        <Icon name="Plus" size={16} className="mr-2" />
        {content.actionText}
      </Button>

      {content.tips.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 max-w-md">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="Lightbulb" size={16} className="mr-2" />
            Quick Tips
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {content.tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={12} className="mt-0.5 text-success flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;