import { useEffect, useRef, useState } from 'react';

interface KineticLetterProps {
  children: string;
  delay?: number;
  className?: string;
}

const KineticLetter = ({ children, delay = 0, className = '' }: KineticLetterProps) => {
  const letterRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const letter = letterRef.current;
    if (!letter) return;

    const animateIn = () => {
      letter.style.transform = `translateY(0) rotateX(0deg) scale(1)`;
      letter.style.opacity = '1';
    };

    const timeout = setTimeout(animateIn, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <span
      ref={letterRef}
      className={`inline-block transition-all duration-300 ease-spring-smooth ${className}`}
      style={{
        transform: 'translateY(20px) rotateX(90deg) scale(0.8)',
        opacity: '0',
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (!letterRef.current) return;
        const rect = letterRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        
        letterRef.current.style.transform = `
          translateY(0) 
          rotateX(${-y}deg) 
          rotateY(${x}deg) 
          scale(${isHovered ? 1.1 : 1})
        `;
      }}
    >
      {children}
    </span>
  );
};

interface KineticTextProps {
  children: string;
  className?: string;
  staggerDelay?: number;
  variant?: 'title' | 'subtitle' | 'body';
}

export const KineticText = ({ 
  children, 
  className = '', 
  staggerDelay = 50,
  variant = 'body'
}: KineticTextProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return 'text-6xl md:text-8xl font-bold font-mono tracking-tight kinetic-text';
      case 'subtitle':
        return 'text-2xl md:text-4xl font-medium tracking-wide';
      case 'body':
        return 'text-lg font-normal';
      default:
        return '';
    }
  };

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      {children.split('').map((char, index) => (
        <KineticLetter 
          key={`${char}-${index}`} 
          delay={index * staggerDelay}
          className={char === ' ' ? 'mx-2' : ''}
        >
          {char === ' ' ? '\u00A0' : char}
        </KineticLetter>
      ))}
    </div>
  );
};

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: number;
}

export const GlitchText = ({ children, className = '', intensity = 1 }: GlitchTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const glitchStyle = glitchActive ? {
    transform: `translateX(${(Math.random() - 0.5) * intensity * 4}px)`,
    filter: `hue-rotate(${Math.random() * 360}deg)`,
    textShadow: `
      ${Math.random() * 2}px 0 #00FFFF,
      ${-Math.random() * 2}px 0 #FF00FF,
      0 ${Math.random() * 2}px #FFFF00
    `,
  } : {};

  return (
    <div
      ref={textRef}
      className={`transition-all duration-75 ${className}`}
      style={glitchStyle}
    >
      {children}
    </div>
  );
};

interface MorphingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export const MorphingText = ({ texts, className = '', interval = 3000 }: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const morphInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(morphInterval);
  }, [texts.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`transition-all duration-300 ease-spring-smooth ${
          isTransitioning 
            ? 'transform translate-y-full opacity-0 blur-sm' 
            : 'transform translate-y-0 opacity-100 blur-0'
        }`}
      >
        {texts[currentIndex]}
      </div>
    </div>
  );
};