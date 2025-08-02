import React from 'react';
import Image from '../../../components/AppImage';

const WellnessImageSection = () => {
  const wellnessImages = [
    {
      src: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Person meditating in peaceful garden setting"
    },
    {
      src: "https://images.pixabay.com/photo-2017/08/06/12/06/people-2592247_960_720.jpg",
      alt: "Yoga class in serene studio environment"
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Wellness practitioner leading mindfulness session"
    }
  ];

  const currentImage = wellnessImages[0];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary/20 to-accent/10 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-end p-12 text-white">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            Welcome back to your wellness journey
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Continue creating and sharing meaningful wellness experiences with our community of practitioners and enthusiasts.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm opacity-80">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm opacity-80">Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm opacity-80">Data Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-accent/20 rounded-full backdrop-blur-sm"></div>
    </div>
  );
};

export default WellnessImageSection;