'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AvatarImageProps {
  src: string | null | undefined;
  alt: string;
  size?: number;
  fallback?: string;
}

export default function AvatarImage({ src, alt, size = 32, fallback }: AvatarImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(src || null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || null);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
  };

  // Si no hay imagen o hay error, mostrar fallback
  if (!imgSrc || hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-300 text-gray-600 rounded-full font-medium text-sm`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          fontSize: `${size * 0.4}px`
        }}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative rounded-full overflow-hidden" style={{ width: `${size}px`, height: `${size}px` }}>
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover rounded-full"
        onError={handleError}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
}
