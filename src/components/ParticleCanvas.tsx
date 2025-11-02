import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "electric" | "chrome" | "void";
}

interface Trail {
  x: number;
  y: number;
  timestamp: number;
}

export const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colors = {
    electric: ["#00FFFF", "#8A2BE2", "#FFD700"],
    chrome: ["#F5F5F5", "#C0C0C0", "#808080"],
    void: ["#1F1F1F", "#2F2F2F", "#404040"],
  };

  const createParticle = useCallback(
    (
      x: number,
      y: number,
      type: "electric" | "chrome" | "void" = "electric"
    ) => {
      const particle: Particle = {
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: Math.random() * 60 + 30,
        size: Math.random() * 3 + 1,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        type,
      };
      return particle;
    },
    []
  );

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;
      particle.vx *= 0.98; // friction
      particle.vy *= 0.98;

      // Gravity and bounds
      particle.vy += 0.05;
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8;

      return particle.life > 0;
    });

    // Clean old trails
    const now = Date.now();
    trailsRef.current = trailsRef.current.filter(
      (trail) => now - trail.timestamp < 800
    );
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear with fade effect
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // Render trails
    trailsRef.current.forEach((trail, index) => {
      const age = (Date.now() - trail.timestamp) / 800;
      const alpha = 1 - age;

      ctx.globalAlpha = alpha * 0.6;
      const gradient = ctx.createRadialGradient(
        trail.x,
        trail.y,
        0,
        trail.x,
        trail.y,
        10
      );
      gradient.addColorStop(0, "#00FFFF");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(trail.x - 5, trail.y - 5, 10, 10);
    });

    // Render particles
    particlesRef.current.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;

      // Create gradient for each particle
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 3
      );

      if (particle.type === "electric") {
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + "80");
        gradient.addColorStop(1, "transparent");
      } else {
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "transparent");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow for electric particles
      if (particle.type === "electric" && alpha > 0.5) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    ctx.globalAlpha = 1;
  }, []);

  const animate = useCallback(() => {
    updateParticles();
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, render]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      // Add trail
      trailsRef.current.push({ x, y, timestamp: Date.now() });

      // Generate particles on interaction
      if (isInteracting) {
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;
          particlesRef.current.push(
            createParticle(x + offsetX, y + offsetY, "electric")
          );
        }
      }
    },
    [isInteracting, createParticle]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsInteracting(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create burst of particles
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const particle = createParticle(x, y, "electric");
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        particlesRef.current.push(particle);
      }
    },
    [createParticle]
  );

  const handleMouseUp = useCallback(() => {
    setIsInteracting(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Start animation
    animate();

    // Auto-generate ambient particles
    const ambientInterval = setInterval(() => {
      if (particlesRef.current.length < 100) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push(
          createParticle(x, y, Math.random() > 0.7 ? "chrome" : "void")
        );
      }
    }, 500);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(ambientInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ zIndex: 1 }}
    />
  );
};
