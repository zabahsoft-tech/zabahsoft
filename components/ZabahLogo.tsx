
import React from 'react';

export const ZabahLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" fill="url(#logoGradientPublic)" />
    <path opacity="0.3" d="M50 5L90 25L50 45L10 25L50 5Z" fill="white" />
    <path opacity="0.2" d="M10 25L50 45V95L10 75V25Z" fill="black" />
    <path d="M35 35H65L45 55H65V65H35L55 45H35V35Z" fill="white" />
    <defs>
      <linearGradient id="logoGradientPublic" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0969da" />
        <stop offset="1" stopColor="#388bfd" />
      </linearGradient>
    </defs>
  </svg>
);

export default ZabahLogo;
