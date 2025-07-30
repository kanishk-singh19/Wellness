import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SessionComments = ({ sessionId, isAuthenticated, isOwner }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        verified: true
      },
      content: "This session was incredibly helpful! The breathing techniques really helped me manage my anxiety. Thank you for sharing this valuable content.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: [
        {
          id: 11,
          user: {
            name: "Dr. Maya Patel",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
            verified: true
          },
          content: "So glad it helped you, Sarah! That's exactly what we aim for with these sessions.",
          timestamp: "1 hour ago",
          likes: 3
        }
      ]
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        verified: false
      },
      content: "Great session! Could you create more content around mindfulness for beginners?",
      timestamp: "5 hours ago",
      likes: 8,
      replies: []
    },
    {
      id: 3,
      user: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        verified: false
      },
      content: "The JSON structure is well organized. Perfect for integration into our wellness app. Thanks!",
      timestamp: "1 day ago",
      likes: 15,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        verified: false
      },
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleSubmitReply = (commentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        verified: false
      },
      content: replyText,
      timestamp: "Just now",
      likes: 0
    };

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    
    setReplyText('');
    setReplyingTo(null);
  };

  const handleLike = (commentId, isReply = false, parentId = null) => {
    if (isReply) {
      setComments(comments.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="px-4 lg:px-6 py-6 border-t border-border">
      <div className="max-w-4xl">
        {/* Comments Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="MessageCircle" size={20} />
            <span>Comments ({comments.length})</span>
          </h3>
          
          {isOwner && (
            <Button variant="ghost" size="sm">
              <Icon name="Settings" size={16} className="mr-2" />
              Moderate
            </Button>
          )}
        </div>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={!newComment.trim()}
                  >
                    <Icon name="Send" size={16} className="mr-2" />
                    Comment
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewComment('')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground mb-3">Sign in to join the conversation</p>
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-foreground">{comment.user.name}</span>
                    {comment.user.verified && (
                      <Icon name="CheckCircle" size={14} className="text-success" />
                    )}
                    <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  
                  <p className="text-foreground mb-3 leading-relaxed">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-wellness"
                    >
                      <Icon name="Heart" size={14} />
                      <span>{comment.likes}</span>
                    </button>
                    
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-wellness"
                      >
                        Reply
                      </button>
                    )}
                    
                    {isOwner && (
                      <button className="text-sm text-muted-foreground hover:text-destructive transition-wellness">
                        <Icon name="MoreHorizontal" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-13 flex space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                      alt="Your avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={`Reply to ${comment.user.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText.trim()}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-13 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground text-sm">{reply.user.name}</span>
                          {reply.user.verified && (
                            <Icon name="CheckCircle" size={12} className="text-success" />
                          )}
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        
                        <p className="text-foreground text-sm mb-2 leading-relaxed">{reply.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(reply.id, true, comment.id)}
                            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-wellness"
                          >
                            <Icon name="Heart" size={12} />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More Comments */}
        {comments.length > 3 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowAllComments(!showAllComments)}
            >
              {showAllComments ? (
                <>
                  <Icon name="ChevronUp" size={16} className="mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <Icon name="ChevronDown" size={16} className="mr-2" />
                  Show {comments.length - 3} More Comments
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionComments;