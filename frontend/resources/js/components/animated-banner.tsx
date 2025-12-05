import * as React from 'react';

import type { BannerConfig } from '@/types';

// Font options with Google Fonts
const fonts: Record<string, { family: string; weight: string; google?: string }> = {
    inter: { family: 'Inter, system-ui, sans-serif', weight: '700' },
    minecraft: { family: '"Press Start 2P", monospace', weight: '400', google: 'Press+Start+2P' },
    gaming: { family: '"Orbitron", sans-serif', weight: '700', google: 'Orbitron:wght@700' },
    pixel: { family: '"VT323", monospace', weight: '400', google: 'VT323' },
    bold: { family: '"Bebas Neue", sans-serif', weight: '400', google: 'Bebas+Neue' },
    elegant: { family: '"Cinzel", serif', weight: '700', google: 'Cinzel:wght@700' },
    futuristic: { family: '"Rajdhani", sans-serif', weight: '700', google: 'Rajdhani:wght@700' },
    handwritten: { family: '"Permanent Marker", cursive', weight: '400', google: 'Permanent+Marker' },
};

// Gradient definitions
const gradients: Record<string, string[]> = {
    purple: ['#667eea', '#764ba2'],
    ocean: ['#2193b0', '#6dd5ed'],
    sunset: ['#f093fb', '#f5576c'],
    forest: ['#11998e', '#38ef7d'],
    fire: ['#f12711', '#f5af19'],
    night: ['#0f0c29', '#302b63', '#24243e'],
    minecraft: ['#4a7c59', '#2d5a27'],
    nether: ['#8b0000', '#ff4500'],
    end: ['#1a1a2e', '#16213e', '#0f3460'],
    diamond: ['#00d9ff', '#00fff2'],
    gold: ['#f7971e', '#ffd200'],
    obsidian: ['#0f0f0f', '#2d2d2d'],
    emerald: ['#00b894', '#00cec9'],
    redstone: ['#c0392b', '#e74c3c'],
    lapis: ['#2980b9', '#3498db'],
    amethyst: ['#9b59b6', '#8e44ad'],
    cyber: ['#00f5d4', '#00bbf9', '#9b5de5'],
    blood: ['#1a0000', '#4a0000', '#8b0000'],
    aurora: ['#00c6ff', '#0072ff', '#7209b7'],
    volcanic: ['#1a0a0a', '#4a1010', '#ff4500'],
};

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    type?: string;
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};

interface AnimatedBannerProps {
    config: BannerConfig;
    className?: string;
    fallbackUrl?: string;
}

export function AnimatedBanner({ config, className, fallbackUrl }: AnimatedBannerProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const animationRef = React.useRef<number>(0);
    const particlesRef = React.useRef<Particle[]>([]);
    const [fontsLoaded, setFontsLoaded] = React.useState(false);

    const gradientColors = gradients[config.gradient] || gradients.purple;
    const fontConfig = fonts[config.font] || fonts.inter;

    // Load Google Fonts
    React.useEffect(() => {
        const fontsToLoad = Object.values(fonts)
            .filter((f) => f.google)
            .map((f) => f.google)
            .join('&family=');

        if (fontsToLoad) {
            // Check if already loaded
            const existingLink = document.querySelector(`link[href*="fonts.googleapis.com"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
                link.onload = () => setFontsLoaded(true);
            } else {
                setFontsLoaded(true);
            }
        } else {
            setFontsLoaded(true);
        }
    }, []);

    // Initialize particles
    const initParticles = React.useCallback((width: number, height: number) => {
        const particles: Particle[] = [];
        // Scale particle count based on canvas size (reference: 960x320)
        const scaleFactor = Math.min(width / 960, height / 320);
        const baseCount = config.particleCount || 50;
        const count = Math.max(Math.floor(baseCount * scaleFactor), Math.min(baseCount, 15));

        for (let i = 0; i < count; i++) {
            const particle: Particle = {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * (config.particleSpeed || 1) * scaleFactor,
                vy: (Math.random() - 0.5) * (config.particleSpeed || 1) * scaleFactor,
                size: (Math.random() * 4 + 1) * scaleFactor,
                opacity: Math.random() * 0.5 + 0.3,
                color: 'white',
            };

            if (config.backgroundEffect === 'stars') {
                particle.size = (Math.random() * 3 + 0.5) * scaleFactor;
                particle.opacity = Math.random() * 0.8 + 0.2;
                particle.vx = 0;
                particle.vy = 0;
            } else if (config.backgroundEffect === 'blocks') {
                particle.size = (Math.random() * 20 + 10) * scaleFactor;
                particle.opacity = Math.random() * 0.3 + 0.1;
                particle.vy = (Math.random() + 0.5) * (config.particleSpeed || 1) * -0.5 * scaleFactor;
                particle.vx = (Math.random() - 0.5) * (config.particleSpeed || 1) * 0.3 * scaleFactor;
                particle.type = 'block';
            } else if (config.backgroundEffect === 'rain') {
                particle.size = (Math.random() * 15 + 10) * scaleFactor;
                particle.vy = (config.particleSpeed || 1) * 3 * scaleFactor;
                particle.vx = 0;
                particle.opacity = Math.random() * 0.5 + 0.3;
                particle.type = 'rain';
            } else if (config.backgroundEffect === 'bubbles') {
                particle.size = (Math.random() * 15 + 5) * scaleFactor;
                particle.vy = -Math.random() * (config.particleSpeed || 1) * 0.5 * scaleFactor - 0.2;
                particle.vx = (Math.random() - 0.5) * 0.3 * scaleFactor;
                particle.opacity = Math.random() * 0.3 + 0.1;
            } else if (config.backgroundEffect === 'snow') {
                particle.size = (Math.random() * 4 + 2) * scaleFactor;
                particle.vy = Math.random() * (config.particleSpeed || 1) * 0.5 * scaleFactor + 0.3;
                particle.vx = (Math.random() - 0.5) * 0.5 * scaleFactor;
                particle.opacity = Math.random() * 0.6 + 0.4;
            } else if (config.backgroundEffect === 'fireflies') {
                particle.size = (Math.random() * 4 + 2) * scaleFactor;
                particle.opacity = 0;
                particle.color = '#ffff00';
                particle.type = 'firefly';
            } else if (config.backgroundEffect === 'confetti') {
                particle.size = (Math.random() * 8 + 4) * scaleFactor;
                particle.vy = Math.random() * (config.particleSpeed || 1) * 2 * scaleFactor + 1;
                particle.vx = (Math.random() - 0.5) * 2 * scaleFactor;
                particle.opacity = Math.random() * 0.5 + 0.5;
                particle.color = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'][Math.floor(Math.random() * 6)];
                particle.type = 'confetti';
            } else if (config.backgroundEffect === 'sparks') {
                particle.size = (Math.random() * 3 + 1) * scaleFactor;
                particle.vy = (Math.random() - 0.7) * (config.particleSpeed || 1) * 3 * scaleFactor;
                particle.vx = (Math.random() - 0.5) * (config.particleSpeed || 1) * 4 * scaleFactor;
                particle.opacity = Math.random() * 0.8 + 0.2;
                particle.color = ['#ffcc00', '#ff9900', '#ff6600', '#ffffff'][Math.floor(Math.random() * 4)];
                particle.type = 'spark';
            } else if (config.backgroundEffect === 'embers') {
                particle.size = (Math.random() * 4 + 2) * scaleFactor;
                particle.vy = -Math.random() * (config.particleSpeed || 1) * scaleFactor - 0.5;
                particle.vx = (Math.random() - 0.5) * 0.5 * scaleFactor;
                particle.opacity = Math.random() * 0.6 + 0.4;
                particle.color = ['#ff4500', '#ff6600', '#ff8c00', '#ffa500'][Math.floor(Math.random() * 4)];
                particle.type = 'ember';
            } else if (config.backgroundEffect === 'dust') {
                particle.size = (Math.random() * 2 + 1) * scaleFactor;
                particle.vy = (Math.random() - 0.5) * (config.particleSpeed || 1) * 0.2 * scaleFactor;
                particle.vx = (Math.random() - 0.5) * (config.particleSpeed || 1) * 0.2 * scaleFactor;
                particle.opacity = Math.random() * 0.3 + 0.1;
                particle.type = 'dust';
            } else if (config.backgroundEffect === 'pulse') {
                particle.size = (Math.random() * 50 + 30) * scaleFactor;
                particle.opacity = 0;
                particle.vx = 0;
                particle.vy = 0;
                particle.type = 'pulse';
            } else if (config.backgroundEffect === 'waves') {
                particle.x = i * (width / count);
                particle.y = height / 2;
                particle.size = 2 * scaleFactor;
                particle.opacity = 0.3;
                particle.type = 'wave';
            }

            particles.push(particle);
        }

        particlesRef.current = particles;
    }, [config.backgroundEffect, config.particleCount, config.particleSpeed]);

    // Draw particles
    const drawParticles = React.useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const opacityMultiplier = (config.animationOpacity ?? 100) / 100;

        particlesRef.current.forEach((p, index) => {
            ctx.save();
            const opacity = p.opacity * opacityMultiplier;

            if (config.backgroundEffect === 'stars') {
                const twinkle = Math.sin(Date.now() * 0.005 + p.x) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * twinkle})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                if (p.size > 2) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * twinkle * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (config.backgroundEffect === 'blocks') {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            } else if (config.backgroundEffect === 'rain') {
                ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
                ctx.font = `${p.size}px monospace`;
                const chars = 'アイウエオカキクケコサシスセソ01';
                ctx.fillText(chars[Math.floor(Math.random() * chars.length)], p.x, p.y);
            } else if (config.backgroundEffect === 'bubbles') {
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.backgroundEffect === 'snow') {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.backgroundEffect === 'fireflies') {
                const glow = Math.sin(Date.now() * 0.003 + p.x * 0.1) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(255, 255, 100, ${glow * 0.8 * opacityMultiplier})`;
                ctx.shadowColor = '#ffff00';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.backgroundEffect === 'particles') {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.backgroundEffect === 'confetti') {
                ctx.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((Date.now() * 0.005 + index) % (Math.PI * 2));
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                ctx.restore();
            } else if (config.backgroundEffect === 'sparks') {
                const fadeOut = Math.max(0, 1 - Math.abs(p.vy) * 0.1);
                ctx.fillStyle = p.color + Math.floor(opacity * fadeOut * 255).toString(16).padStart(2, '0');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                // Trail
                ctx.strokeStyle = p.color + Math.floor(opacity * fadeOut * 0.3 * 255).toString(16).padStart(2, '0');
                ctx.lineWidth = p.size * 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                ctx.stroke();
            } else if (config.backgroundEffect === 'embers') {
                const glow = Math.sin(Date.now() * 0.01 + index) * 0.3 + 0.7;
                ctx.fillStyle = p.color + Math.floor(opacity * glow * 255).toString(16).padStart(2, '0');
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.backgroundEffect === 'dust') {
                const drift = Math.sin(Date.now() * 0.002 + index) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * drift})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.backgroundEffect === 'pulse') {
                const pulsePhase = ((Date.now() * 0.001 + index * 0.5) % 3);
                const pulseSize = p.size * pulsePhase;
                const pulseOpacity = Math.max(0, (1 - pulsePhase / 3) * opacityMultiplier * 0.3);
                ctx.strokeStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
                ctx.stroke();
            } else if (config.backgroundEffect === 'waves') {
                const waveY = p.y + Math.sin(Date.now() * 0.002 + p.x * 0.02) * 30;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, waveY, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });
    }, [config.backgroundEffect, config.animationOpacity]);

    // Update particles
    const updateParticles = React.useCallback((width: number, height: number) => {
        particlesRef.current.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -p.size) p.x = width + p.size;
            if (p.x > width + p.size) p.x = -p.size;
            if (p.y < -p.size) p.y = height + p.size;
            if (p.y > height + p.size) p.y = -p.size;

            if (p.type === 'firefly') {
                p.vx = Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.5;
                p.vy = Math.cos(Date.now() * 0.001 + p.y * 0.01) * 0.5;
            }
        });
    }, []);

    // Draw pattern
    const drawPattern = React.useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const opacity = ((config.patternOpacity ?? 100) / 100) * 0.15;
        const patternColor = config.patternColor || '#ffffff';

        if (config.pattern === 'dots') {
            ctx.fillStyle = hexToRgba(patternColor, opacity);
            for (let x = 0; x < width; x += 30) {
                for (let y = 0; y < height; y += 30) {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (config.pattern === 'grid') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.5);
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        } else if (config.pattern === 'diagonal') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.5);
            ctx.lineWidth = 1;
            for (let i = -height; i < width + height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + height, height);
                ctx.stroke();
            }
        } else if (config.pattern === 'hexagon') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.6);
            ctx.lineWidth = 1;
            const size = 30;
            const h = size * Math.sqrt(3);
            for (let row = 0; row < height / h + 1; row++) {
                for (let col = 0; col < width / (size * 3) + 1; col++) {
                    const x = col * size * 3 + (row % 2) * size * 1.5;
                    const y = row * h * 0.5;
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI / 3) * i;
                        const px = x + size * Math.cos(angle);
                        const py = y + size * Math.sin(angle);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        } else if (config.pattern === 'circuit') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity);
            ctx.fillStyle = hexToRgba(patternColor, opacity);
            ctx.lineWidth = 2;
            const spacing = 60;
            for (let x = spacing; x < width; x += spacing) {
                for (let y = spacing; y < height; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (config.pattern === 'crosses') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.6);
            ctx.lineWidth = 2;
            const spacing = 40;
            const size = 8;
            for (let x = spacing / 2; x < width; x += spacing) {
                for (let y = spacing / 2; y < height; y += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(x - size, y);
                    ctx.lineTo(x + size, y);
                    ctx.moveTo(x, y - size);
                    ctx.lineTo(x, y + size);
                    ctx.stroke();
                }
            }
        } else if (config.pattern === 'triangles') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.5);
            ctx.lineWidth = 1;
            const size = 40;
            const h = size * Math.sqrt(3) / 2;
            for (let row = 0; row < height / h + 1; row++) {
                for (let col = 0; col < width / size + 1; col++) {
                    const x = col * size + (row % 2) * (size / 2);
                    const y = row * h;
                    const flip = (row + col) % 2 === 0;
                    ctx.beginPath();
                    if (flip) {
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + size / 2, y + h);
                        ctx.lineTo(x - size / 2, y + h);
                    } else {
                        ctx.moveTo(x, y + h);
                        ctx.lineTo(x + size / 2, y);
                        ctx.lineTo(x - size / 2, y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        } else if (config.pattern === 'waves') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.5);
            ctx.lineWidth = 2;
            const amplitude = 15;
            const wavelength = 60;
            for (let y = 30; y < height; y += 40) {
                ctx.beginPath();
                for (let x = 0; x <= width; x += 5) {
                    const py = y + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
                    if (x === 0) ctx.moveTo(x, py);
                    else ctx.lineTo(x, py);
                }
                ctx.stroke();
            }
        } else if (config.pattern === 'diamond') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.5);
            ctx.lineWidth = 1;
            const size = 30;
            for (let row = 0; row < height / size + 1; row++) {
                for (let col = 0; col < width / size + 1; col++) {
                    const x = col * size * 2 + (row % 2) * size;
                    const y = row * size;
                    ctx.beginPath();
                    ctx.moveTo(x, y - size / 2);
                    ctx.lineTo(x + size / 2, y);
                    ctx.lineTo(x, y + size / 2);
                    ctx.lineTo(x - size / 2, y);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        } else if (config.pattern === 'zigzag') {
            ctx.strokeStyle = hexToRgba(patternColor, opacity * 0.5);
            ctx.lineWidth = 2;
            const amplitude = 20;
            const segmentWidth = 30;
            for (let y = 20; y < height; y += 50) {
                ctx.beginPath();
                for (let x = 0; x <= width; x += segmentWidth) {
                    const py = y + (Math.floor(x / segmentWidth) % 2 === 0 ? 0 : amplitude);
                    if (x === 0) ctx.moveTo(x, py);
                    else ctx.lineTo(x, py);
                }
                ctx.stroke();
            }
        } else if (config.pattern === 'stars') {
            ctx.fillStyle = hexToRgba(patternColor, opacity * 0.6);
            const spacing = 60;
            for (let x = spacing / 2; x < width; x += spacing) {
                for (let y = spacing / 2; y < height; y += spacing) {
                    const size = 8;
                    const innerSize = size * 0.4;
                    ctx.beginPath();
                    for (let i = 0; i < 10; i++) {
                        const r = i % 2 === 0 ? size : innerSize;
                        const angle = (Math.PI / 5) * i - Math.PI / 2;
                        const px = x + r * Math.cos(angle);
                        const py = y + r * Math.sin(angle);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }, [config.pattern, config.patternOpacity, config.patternColor]);

    // Draw overlay
    const drawOverlay = React.useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const opacityMultiplier = (config.overlayOpacity ?? 100) / 100;

        if (config.overlay === 'vignette') {
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(1, `rgba(0,0,0,${0.5 * opacityMultiplier})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else if (config.overlay === 'bottom-fade') {
            const gradient = ctx.createLinearGradient(0, height, 0, height / 2);
            gradient.addColorStop(0, `rgba(0,0,0,${0.6 * opacityMultiplier})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else if (config.overlay === 'top-fade') {
            const gradient = ctx.createLinearGradient(0, 0, 0, height / 2);
            gradient.addColorStop(0, `rgba(0,0,0,${0.4 * opacityMultiplier})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else if (config.overlay === 'full-darken') {
            ctx.fillStyle = `rgba(0,0,0,${0.3 * opacityMultiplier})`;
            ctx.fillRect(0, 0, width, height);
        } else if (config.overlay === 'scanlines') {
            ctx.fillStyle = `rgba(0,0,0,${0.1 * opacityMultiplier})`;
            for (let y = 0; y < height; y += 4) {
                ctx.fillRect(0, y, width, 2);
            }
        } else if (config.overlay === 'noise') {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            const noiseAmount = 20 * opacityMultiplier;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * noiseAmount;
                data[i] = Math.min(255, Math.max(0, data[i] + noise));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);
        } else if (config.overlay === 'gradient-left') {
            const gradient = ctx.createLinearGradient(0, 0, width / 2, 0);
            gradient.addColorStop(0, `rgba(0,0,0,${0.5 * opacityMultiplier})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else if (config.overlay === 'gradient-right') {
            const gradient = ctx.createLinearGradient(width, 0, width / 2, 0);
            gradient.addColorStop(0, `rgba(0,0,0,${0.5 * opacityMultiplier})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else if (config.overlay === 'corners') {
            // Top-left corner
            let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.4);
            gradient.addColorStop(0, `rgba(0,0,0,${0.4 * opacityMultiplier})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            // Bottom-right corner
            gradient = ctx.createRadialGradient(width, height, 0, width, height, width * 0.4);
            gradient.addColorStop(0, `rgba(0,0,0,${0.4 * opacityMultiplier})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
    }, [config.overlay, config.overlayOpacity]);

    // Draw text
    const drawText = React.useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Scale font size based on canvas width (reference: 960px from generator preview)
        const scaleFactor = Math.min(width / 960, height / 320);
        const scaledFontSize = Math.max(config.fontSize * scaleFactor, 12);
        const scaledSubtitleSize = Math.max(config.subtitleSize * scaleFactor, 10);
        const textY = config.showSubtitle ? height / 2 - (10 * scaleFactor) : height / 2;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${fontConfig.weight} ${scaledFontSize}px ${fontConfig.family}`;

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const text = config.text || 'My Server';
        const textColor = config.textColor || '#ffffff';
        const subtitleColor = config.subtitleColor || '#ffffff';

        if (config.textEffect === 'shadow') {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === 'glow') {
            ctx.shadowColor = textColor + 'cc';
            ctx.shadowBlur = 30;
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === 'outline') {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 8;
            ctx.strokeText(text, width / 2, textY);
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === 'neon') {
            ctx.shadowColor = textColor;
            ctx.shadowBlur = 40;
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
            ctx.shadowBlur = 20;
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === '3d') {
            for (let i = 10; i > 0; i--) {
                ctx.fillStyle = `rgba(0,0,0,${0.1 + i * 0.02})`;
                ctx.fillText(text, width / 2 + i * 2, textY + i * 2);
            }
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === 'gradient') {
            const gradient = ctx.createLinearGradient(width / 2 - 200, textY, width / 2 + 200, textY);
            gradient.addColorStop(0, gradientColors[0]);
            gradient.addColorStop(1, gradientColors[gradientColors.length - 1]);
            ctx.fillStyle = gradient;
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === 'glitch') {
            const offset = Math.sin(Date.now() * 0.01) * 5;
            ctx.fillStyle = 'rgba(255,0,0,0.7)';
            ctx.fillText(text, width / 2 - offset, textY);
            ctx.fillStyle = 'rgba(0,255,255,0.7)';
            ctx.fillText(text, width / 2 + offset, textY);
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
        } else if (config.textEffect === 'metallic') {
            const gradient = ctx.createLinearGradient(width / 2, textY - config.fontSize / 2, width / 2, textY + config.fontSize / 2);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, '#aaaaaa');
            gradient.addColorStop(0.5, '#ffffff');
            gradient.addColorStop(0.7, '#888888');
            gradient.addColorStop(1, '#cccccc');
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 3;
            ctx.fillText(text, width / 2, textY);
        } else {
            ctx.fillStyle = textColor;
            ctx.fillText(text, width / 2, textY);
        }

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        if (config.showSubtitle && config.subtitle) {
            ctx.font = `500 ${scaledSubtitleSize}px ${fontConfig.family}`;
            ctx.fillStyle = subtitleColor + 'd9';
            ctx.fillText(config.subtitle, width / 2, textY + scaledFontSize / 2 + (20 * scaleFactor));
        }
    }, [config, fontConfig, gradientColors]);

    // Main render function
    const renderBanner = React.useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        // Draw gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradientColors.forEach((color, i) => {
            gradient.addColorStop(i / (gradientColors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        drawPattern(ctx, width, height);

        if (config.backgroundEffect !== 'none') {
            drawParticles(ctx, width, height);
        }

        drawOverlay(ctx, width, height);
        drawText(ctx, width, height);
    }, [gradientColors, config.backgroundEffect, drawPattern, drawParticles, drawOverlay, drawText]);

    // Animation loop
    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            if (config.backgroundEffect !== 'none') {
                initParticles(rect.width, rect.height);
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            renderBanner(ctx, rect.width, rect.height);

            if (config.backgroundEffect !== 'none') {
                updateParticles(rect.width, rect.height);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [config, fontsLoaded, initParticles, updateParticles, renderBanner]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height: '100%' }}
        />
    );
}

// Static version for non-animated display (e.g., server cards)
export function StaticBanner({ config, className, fallbackUrl }: AnimatedBannerProps) {
    const gradientColors = gradients[config?.gradient] || gradients.purple;
    const fontConfig = config?.font ? fonts[config.font] : fonts.inter;

    if (!config) {
        if (fallbackUrl) {
            return <img src={fallbackUrl} alt="Banner" className={className} />;
        }
        return (
            <div
                className={className}
                style={{
                    background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
                }}
            />
        );
    }

    // Generate pattern overlay based on config
    const getPatternStyle = (): React.CSSProperties => {
        if (config.pattern === 'dots') {
            return {
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            };
        }
        if (config.pattern === 'grid') {
            return {
                backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
            };
        }
        if (config.pattern === 'diagonal') {
            return {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)',
            };
        }
        return {};
    };

    // Get overlay style
    const getOverlayStyle = (): React.CSSProperties => {
        if (config.overlay === 'vignette') {
            return {
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
            };
        }
        if (config.overlay === 'bottom-fade') {
            return {
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
            };
        }
        if (config.overlay === 'full-darken') {
            return {
                background: 'rgba(0,0,0,0.25)',
            };
        }
        return {};
    };

    // Get text effect style
    const getTextStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            color: 'white',
            fontSize: `clamp(14px, 4vw, ${Math.min(config.fontSize * 0.4, 28)}px)`,
            fontWeight: fontConfig?.weight || 'bold',
            fontFamily: fontConfig?.family || 'inherit',
            lineHeight: 1.2,
        };

        if (config.textEffect === 'shadow') {
            return { ...baseStyle, textShadow: '3px 3px 6px rgba(0,0,0,0.5)' };
        }
        if (config.textEffect === 'glow') {
            return { ...baseStyle, textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)' };
        }
        if (config.textEffect === 'outline') {
            return { ...baseStyle, textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' };
        }
        if (config.textEffect === 'neon') {
            return { ...baseStyle, textShadow: `0 0 10px ${gradientColors[0]}, 0 0 20px ${gradientColors[0]}, 0 0 40px ${gradientColors[0]}` };
        }
        if (config.textEffect === '3d') {
            return { ...baseStyle, textShadow: '2px 2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.2)' };
        }
        return { ...baseStyle, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' };
    };

    return (
        <div
            className={className}
            style={{
                background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Pattern layer */}
            {config.pattern !== 'none' && (
                <div style={{ position: 'absolute', inset: 0, ...getPatternStyle() }} />
            )}

            {/* Overlay layer */}
            {config.overlay !== 'none' && (
                <div style={{ position: 'absolute', inset: 0, ...getOverlayStyle() }} />
            )}

            {/* Text content */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '8px' }}>
                <div style={getTextStyle()}>
                    {config.text}
                </div>
                {config.showSubtitle && config.subtitle && (
                    <div
                        style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: `clamp(10px, 2vw, ${Math.min(config.subtitleSize * 0.4, 14)}px)`,
                            marginTop: '4px',
                            fontFamily: fontConfig?.family || 'inherit',
                        }}
                    >
                        {config.subtitle}
                    </div>
                )}
            </div>
        </div>
    );
}
