import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionActions = ({ 
  session, 
  isOwner, 
  isBookmarked, 
  onBookmark, 
  onShare, 
  onEdit, 
  onDelete 
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = session.title;
    const text = `Check out this wellness session: ${title}`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      default:
        break;
    }
    setShowShareMenu(false);
    onShare(platform);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  return (
    <>
      {/* Main Actions */}
      <div className="sticky bottom-0 lg:relative bg-background border-t lg:border-t-0 border-border p-4 lg:p-0">
        <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
          {isOwner ? (
            <>
              {/* Owner Actions */}
              <div className="flex items-center space-x-2 flex-1 lg:flex-initial">
                <Button
                  variant="default"
                  size="lg"
                  onClick={onEdit}
                  className="flex-1 lg:flex-initial transition-wellness"
                >
                  <Icon name="Edit" size={18} className="mr-2" />
                  Edit Session
                </Button>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="transition-wellness"
                  >
                    <Icon name="Share2" size={18} />
                  </Button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover border border-border rounded-md shadow-wellness-lg z-50">
                      <div className="py-2">
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Copy" size={16} />
                          <span>Copy Link</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Twitter" size={16} />
                          <span>Share on Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Facebook" size={16} />
                          <span>Share on Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Linkedin" size={16} />
                          <span>Share on LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="MessageCircle" size={16} />
                          <span>Share on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-wellness"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>

              {/* Session Status */}
              <div className="hidden lg:flex items-center space-x-2 ml-auto">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  session.status === 'published' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  {session.status === 'published' ? 'Published' : 'Draft'}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Public User Actions */}
              <div className="flex items-center space-x-2 flex-1">
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="lg"
                  onClick={onBookmark}
                  className="flex-1 lg:flex-initial transition-wellness"
                >
                  <Icon name={isBookmarked ? "BookmarkCheck" : "Bookmark"} size={18} className="mr-2" />
                  {isBookmarked ? 'Saved' : 'Save Session'}
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="transition-wellness"
                  >
                    <Icon name="Share2" size={18} />
                  </Button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover border border-border rounded-md shadow-wellness-lg z-50">
                      <div className="py-2">
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Copy" size={16} />
                          <span>Copy Link</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Twitter" size={16} />
                          <span>Share on Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Facebook" size={16} />
                          <span>Share on Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="Linkedin" size={16} />
                          <span>Share on LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="MessageCircle" size={16} />
                          <span>Share on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="hidden lg:flex items-center space-x-2 ml-auto">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={16}
                      className={i < Math.floor(session.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({session.rating})
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-background rounded-lg shadow-wellness-lg border border-border">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Delete Session</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-sm text-foreground mb-6">
                Are you sure you want to delete "{session.title}"? This will permanently remove the session and all associated data.
              </p>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 transition-wellness"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1 transition-wellness"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </>
  );
};

export default SessionActions;