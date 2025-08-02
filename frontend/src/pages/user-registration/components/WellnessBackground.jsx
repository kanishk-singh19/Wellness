import React from 'react';
import Image from '../../../components/AppImage';

const WellnessBackground = () => {
  return (
    <div className="hidden lg:block absolute inset-0 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Peaceful wellness background with meditation stones"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default WellnessBackground;