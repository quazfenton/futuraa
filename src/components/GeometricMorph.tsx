import { useEffect, useRef, useState } from 'react';

interface GeometricShape {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'hexagon';
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
  velocity: { x: number; y: number };
  rotationSpeed: number;
}

export const GeometricMorph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<GeometricShape[]>([]);
  const animationRef = useRef<number>();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colors = [
    'hsl(var(--electric-cyan))',
    'hsl(var(--electric-violet))',
    'hsl(var(--electric-amber))',
    'hsl(var(--chrome))',
    'hsl(var(--steel))',
  ];

  const createShape = (x?: number, y?: number): GeometricShape => {
    const types: GeometricShape['type'][] = ['circle', 'square', 'triangle', 'hexagon'];
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: types[Math.floor(Math.random() * types.length)],
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? Math.random() * window.innerHeight,
      size: Math.random() * 60 + 20,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      rotationSpeed: (Math.random() - 0.5) * 4,
    };
  };

  const getShapePath = (shape: GeometricShape): string => {
    const { size } = shape;
    const half = size / 2;
    
    switch (shape.type) {
      case 'circle':
        return `M ${half} 0 A ${half} ${half} 0 0 1 ${half} ${size} A ${half} ${half} 0 0 1 ${half} 0`;
      case 'square':
        return `M 0 0 L ${size} 0 L ${size} ${size} L 0 ${size} Z`;
      case 'triangle':
        return `M ${half} 0 L ${size} ${size} L 0 ${size} Z`;
      case 'hexagon':
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = half + (half * 0.8) * Math.cos(angle);
          const y = half + (half * 0.8) * Math.sin(angle);
          points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
        }
        return points.join(' ') + ' Z';
      default:
        return '';
    }
  };

  const updateShapes = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    shapesRef.current = shapesRef.current.map(shape => {
      // Update position
      shape.x += shape.velocity.x;
      shape.y += shape.velocity.y;
      shape.rotation += shape.rotationSpeed;

      // Bounce off walls
      if (shape.x <= 0 || shape.x >= rect.width - shape.size) {
        shape.velocity.x *= -0.8;
        shape.x = Math.max(0, Math.min(rect.width - shape.size, shape.x));
      }
      if (shape.y <= 0 || shape.y >= rect.height - shape.size) {
        shape.velocity.y *= -0.8;
        shape.y = Math.max(0, Math.min(rect.height - shape.size, shape.y));
      }

      // Mouse interaction
      const dx = mousePos.x - (shape.x + shape.size / 2);
      const dy = mousePos.y - (shape.y + shape.size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        shape.velocity.x -= (dx / distance) * force * 0.5;
        shape.velocity.y -= (dy / distance) * force * 0.5;
        shape.rotationSpeed += force * 2;
        shape.opacity = Math.min(1, shape.opacity + force * 0.02);
      } else {
        shape.rotationSpeed *= 0.99;
        shape.opacity = Math.max(0.3, shape.opacity - 0.005);
      }

      // Add friction
      shape.velocity.x *= 0.99;
      shape.velocity.y *= 0.99;

      return shape;
    });

    // Remove shapes that are too slow or transparent
    shapesRef.current = shapesRef.current.filter(shape => {
      const speed = Math.sqrt(shape.velocity.x ** 2 + shape.velocity.y ** 2);
      return speed > 0.1 || shape.opacity > 0.1;
    });

    // Add new shapes occasionally
    if (shapesRef.current.length < 20 && Math.random() < 0.02) {
      shapesRef.current.push(createShape());
    }
  };

  const animate = () => {
    updateShapes();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initialize shapes
    for (let i = 0; i < 12; i++) {
      shapesRef.current.push(createShape());
    }

    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create burst of shapes
      for (let i = 0; i < 5; i++) {
        const shape = createShape(x, y);
        const angle = (i / 5) * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        shape.velocity.x = Math.cos(angle) * speed;
        shape.velocity.y = Math.sin(angle) * speed;
        shape.rotationSpeed = (Math.random() - 0.5) * 10;
        shapesRef.current.push(shape);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{ zIndex: 2 }}
    >
      <svg className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {shapesRef.current.map(shape => (
          <g key={shape.id}>
            <path
              d={getShapePath(shape)}
              fill={shape.color}
              opacity={shape.opacity * 0.3}
              transform={`translate(${shape.x}, ${shape.y}) rotate(${shape.rotation}, ${shape.size/2}, ${shape.size/2})`}
              filter="url(#glow)"
              className="animate-pulse"
            />
            <path
              d={getShapePath(shape)}
              fill="none"
              stroke={shape.color}
              strokeWidth="1"
              opacity={shape.opacity}
              transform={`translate(${shape.x}, ${shape.y}) rotate(${shape.rotation}, ${shape.size/2}, ${shape.size/2})`}
              className="transition-all duration-300"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};