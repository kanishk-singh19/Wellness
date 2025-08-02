import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PractitionerSidebar = ({ practitioner, onFollowClick, isFollowing }) => {
  if (!practitioner) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Practitioner Profile */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted mx-auto mb-4">
          <Image
            src={practitioner.avatar}
            alt={practitioner.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{practitioner.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{practitioner.title}</p>
        
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          fullWidth
          onClick={onFollowClick}
        >
          <Icon name={isFollowing ? "UserCheck" : "UserPlus"} size={16} className="mr-2" />
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>

      {/* Bio */}
      <div>
        <h4 className="font-medium text-foreground mb-2">About</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {practitioner.bio}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">{practitioner.sessionsCount}</div>
          <div className="text-xs text-muted-foreground">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">{practitioner.followersCount}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
      </div>

      {/* Specializations */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Specializations</h4>
        <div className="flex flex-wrap gap-2">
          {practitioner.specializations.map((spec, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded text-xs font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <h4 className="font-medium text-foreground mb-3">Connect</h4>
        <div className="flex space-x-2">
          {practitioner.website && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(practitioner.website, '_blank')}
            >
              <Icon name="Globe" size={16} />
            </Button>
          )}
          {practitioner.social?.instagram && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(practitioner.social.instagram, '_blank')}
            >
              <Icon name="Instagram" size={16} />
            </Button>
          )}
          {practitioner.social?.twitter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(practitioner.social.twitter, '_blank')}
            >
              <Icon name="Twitter" size={16} />
            </Button>
          )}
          {practitioner.email && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`mailto:${practitioner.email}`, '_blank')}
            >
              <Icon name="Mail" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Verification Badge */}
      {practitioner.verified && (
        <div className="flex items-center space-x-2 text-sm text-success bg-success/10 px-3 py-2 rounded-md">
          <Icon name="CheckCircle" size={16} />
          <span>Verified Practitioner</span>
        </div>
      )}
    </div>
  );
};

export default PractitionerSidebar;