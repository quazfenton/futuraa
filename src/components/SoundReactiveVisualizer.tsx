import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface AudioData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
  volume: number;
}

export const SoundReactiveVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const [isActive, setIsActive] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      sourceRef.current.connect(analyserRef.current);
      
      setIsActive(true);
      setError(null);
      startVisualization();
    } catch (err) {
      setError('Microphone access denied. Visual will work without audio.');
      setIsActive(false);
      startStaticVisualization();
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const getAudioData = (): AudioData => {
    if (!analyserRef.current) {
      // Return synthetic data for demonstration
      const frequencies = new Uint8Array(analyserRef.current?.frequencyBinCount || 1024);
      const waveform = new Uint8Array(analyserRef.current?.fftSize || 2048);
      
      // Generate synthetic audio-like data
      const time = Date.now() * 0.001;
      for (let i = 0; i < frequencies.length; i++) {
        frequencies[i] = Math.sin(time + i * 0.1) * 50 + 100;
      }
      for (let i = 0; i < waveform.length; i++) {
        waveform[i] = Math.sin(time * 2 + i * 0.05) * 30 + 128;
      }
      
      return { frequencies, waveform, volume: 0.5 };
    }

    const frequencies = new Uint8Array(analyserRef.current.frequencyBinCount);
    const waveform = new Uint8Array(analyserRef.current.fftSize);
    
    analyserRef.current.getByteFrequencyData(frequencies);
    analyserRef.current.getByteTimeDomainData(waveform);
    
    // Calculate volume
    const volume = frequencies.reduce((sum, val) => sum + val, 0) / frequencies.length / 255;
    
    return { frequencies, waveform, volume };
  };

  const drawVisualization = (audioData: AudioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear with fade effect
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    const { frequencies, waveform, volume } = audioData;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    // Draw frequency spectrum as radial bars
    const barCount = Math.min(frequencies.length / 4, 180);
    const angleStep = (Math.PI * 2) / barCount;

    for (let i = 0; i < barCount; i++) {
      const angle = i * angleStep;
      const frequency = frequencies[i * 4] || 0;
      const barHeight = (frequency / 255) * radius * 0.8;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      
      if (frequency > 200) {
        gradient.addColorStop(0, '#00FFFF');
        gradient.addColorStop(1, '#8A2BE2');
      } else if (frequency > 100) {
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#00FFFF');
      } else {
        gradient.addColorStop(0, '#C0C0C0');
        gradient.addColorStop(1, '#808080');
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Add glow effect for high frequencies
      if (frequency > 150) {
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    // Draw waveform as circle
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const waveRadius = radius * 0.3;
    for (let i = 0; i < waveform.length; i++) {
      const angle = (i / waveform.length) * Math.PI * 2;
      const waveValue = (waveform[i] - 128) / 128;
      const r = waveRadius + waveValue * 20;
      
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Draw central volume indicator
    const volumeRadius = volume * 50 + 10;
    const volumeGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, volumeRadius
    );
    volumeGradient.addColorStop(0, '#00FFFF');
    volumeGradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = volumeGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, volumeRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  const startVisualization = () => {
    const animate = () => {
      const data = getAudioData();
      setAudioData(data);
      drawVisualization(data);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const startStaticVisualization = () => {
    const animate = () => {
      // Generate synthetic data for demo
      const time = Date.now() * 0.001;
      const frequencies = new Uint8Array(1024);
      const waveform = new Uint8Array(2048);
      
      for (let i = 0; i < frequencies.length; i++) {
        frequencies[i] = Math.sin(time + i * 0.02) * 80 + 80;
      }
      for (let i = 0; i < waveform.length; i++) {
        waveform[i] = Math.sin(time * 3 + i * 0.01) * 40 + 128;
      }
      
      const data = { frequencies, waveform, volume: Math.sin(time) * 0.3 + 0.5 };
      setAudioData(data);
      drawVisualization(data);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start with static visualization
    startStaticVisualization();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      stopAudio();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={isActive ? stopAudio : initializeAudio}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
            ${isActive 
              ? 'electric-glow text-foreground' 
              : 'void-panel text-steel hover:text-chrome'
            }`}
        >
          {isActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        
        {audioData && (
          <div className="void-panel px-3 py-2 rounded-sm">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-steel" />
              <div className="w-16 h-1 bg-graphite rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-electric transition-all duration-100"
                  style={{ width: `${(audioData.volume * 100).toFixed(0)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-chrome">
                {(audioData.volume * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="void-panel p-3 rounded-sm">
            <p className="text-sm text-electric-amber">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};