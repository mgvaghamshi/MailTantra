import React from 'react';

interface MailTantraLogoProps {
  className?: string;
}

// SVG Logo Component for Mail Tantra
export const MailTantraLogo: React.FC<MailTantraLogoProps> = ({ className = "w-8 h-8" }) => {
  const angles1 = [0, 45, 90, 135, 180, 225, 270, 315];
  const angles2 = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="gradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
          <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#gradLogo)" strokeWidth="3" strokeLinecap="round">
        {/* Central envelope */}
        <path d="M35 40 L50 50 L65 40" strokeWidth="4"/>
        <rect x="35" y="40" width="30" height="20" rx="2" strokeWidth="4"/>

        {/* Mandala pattern */}
        <g transform="translate(50,50)">
          <circle cx="0" cy="0" r="35" strokeWidth="2" strokeOpacity="0.5"/>
          <circle cx="0" cy="0" r="45" strokeWidth="2" strokeOpacity="0.3"/>
          {angles1.map(angle => (
            <path key={angle} d="M0 25 L0 40" transform={`rotate(${angle})`} />
          ))}
          {angles2.map(angle => (
            <circle key={angle} cx="0" cy="40" r="3" transform={`rotate(${angle})`} strokeWidth="2"/>
          ))}
        </g>
      </g>
    </svg>
  );
};

// Simplified version for smaller spaces
export const MailTantraIconSimple: React.FC<MailTantraLogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="gradSimple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
          <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#gradSimple)" strokeWidth="4" strokeLinecap="round">
        {/* Central envelope */}
        <path d="M30 35 L50 50 L70 35"/>
        <rect x="30" y="35" width="40" height="30" rx="3" strokeWidth="4"/>
        
        {/* Simple decorative circles */}
        <circle cx="50" cy="50" r="40" strokeWidth="2" strokeOpacity="0.3"/>
        <circle cx="50" cy="50" r="45" strokeWidth="1" strokeOpacity="0.2"/>
      </g>
    </svg>
  );
};
