import { useState, useEffect, useCallback } from 'react';

interface SecureIframeProps {
  src: string;
  title: string;
  className?: string;
  sandbox?: string;
  allow?: string;
  onLoad?: () => void;
  onError?: () => void;
  referrerPolicy?: ReferrerPolicy;
  timeout?: number;
}

const SecureIframe = ({
  src,
  title,
  className = '',
  sandbox = 'allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation',
  allow = '',
  onLoad,
  onError,
  referrerPolicy = 'no-referrer',
  timeout = 10000
}: SecureIframeProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidSrc, setIsValidSrc] = useState(true);

  // Validate src against allowed domains
  useEffect(() => {
    try {
      const url = new URL(src);
      const allowedDomains = [
        'chat.quazfenton.xyz',
        'github.com',
        'huggingface.co',
        'quazfenton.github.io'
      ];
      
      const isAllowed = allowedDomains.some(domain => 
        url.hostname.includes(domain) || url.hostname === domain
      );
      
      setIsValidSrc(isAllowed);
    } catch {
      setIsValidSrc(false);
    }
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  if (!isValidSrc) {
    return (
      <div className="flex items-center justify-center h-full bg-surface p-4">
        <div className="text-center">
          <div className="text-red-500 font-mono text-sm">Invalid source</div>
          <div className="text-xs text-steel mt-1">Contact administrator</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-surface p-4">
        <div className="text-center">
          <div className="text-red-500 font-mono text-sm">Content failed to load</div>
          <div className="text-xs text-steel mt-1">Please try again later</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="text-steel font-mono text-sm">Loading content...</div>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className={`w-full h-full ${className}`}
        sandbox={sandbox}
        allow={allow}
        referrerPolicy={referrerPolicy}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default SecureIframe;