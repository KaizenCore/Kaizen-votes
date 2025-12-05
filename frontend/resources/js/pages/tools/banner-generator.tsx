import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Copy,
    Download,
    ImagePlus,
    Palette,
    Pause,
    Play,
    Settings2,
    Sparkles,
    Wand2,
    X,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';

// Font options with Google Fonts
const fonts = [
    { id: 'inter', name: 'Inter', family: 'Inter, system-ui, sans-serif', weight: '700' },
    { id: 'minecraft', name: 'Minecraft', family: '"Press Start 2P", monospace', weight: '400', google: 'Press+Start+2P' },
    { id: 'gaming', name: 'Gaming', family: '"Orbitron", sans-serif', weight: '700', google: 'Orbitron:wght@700' },
    { id: 'pixel', name: 'Pixel', family: '"VT323", monospace', weight: '400', google: 'VT323' },
    { id: 'bold', name: 'Impact', family: '"Bebas Neue", sans-serif', weight: '400', google: 'Bebas+Neue' },
    { id: 'elegant', name: 'Elegant', family: '"Cinzel", serif', weight: '700', google: 'Cinzel:wght@700' },
    { id: 'futuristic', name: 'Futuristic', family: '"Rajdhani", sans-serif', weight: '700', google: 'Rajdhani:wght@700' },
    { id: 'handwritten', name: 'Handwritten', family: '"Permanent Marker", cursive', weight: '400', google: 'Permanent+Marker' },
];

// Predefined gradients
const gradients = [
    { id: 'purple', name: 'Purple Haze', colors: ['#667eea', '#764ba2'] },
    { id: 'ocean', name: 'Ocean Blue', colors: ['#2193b0', '#6dd5ed'] },
    { id: 'sunset', name: 'Sunset', colors: ['#f093fb', '#f5576c'] },
    { id: 'forest', name: 'Forest', colors: ['#11998e', '#38ef7d'] },
    { id: 'fire', name: 'Fire', colors: ['#f12711', '#f5af19'] },
    { id: 'night', name: 'Night Sky', colors: ['#0f0c29', '#302b63', '#24243e'] },
    { id: 'minecraft', name: 'Minecraft', colors: ['#4a7c59', '#2d5a27'] },
    { id: 'nether', name: 'Nether', colors: ['#8b0000', '#ff4500'] },
    { id: 'end', name: 'The End', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
    { id: 'diamond', name: 'Diamond', colors: ['#00d9ff', '#00fff2'] },
    { id: 'gold', name: 'Gold', colors: ['#f7971e', '#ffd200'] },
    { id: 'obsidian', name: 'Obsidian', colors: ['#0f0f0f', '#2d2d2d'] },
    { id: 'emerald', name: 'Emerald', colors: ['#00b894', '#00cec9'] },
    { id: 'redstone', name: 'Redstone', colors: ['#c0392b', '#e74c3c'] },
    { id: 'lapis', name: 'Lapis', colors: ['#2980b9', '#3498db'] },
    { id: 'amethyst', name: 'Amethyst', colors: ['#9b59b6', '#8e44ad'] },
    { id: 'cyber', name: 'Cyber', colors: ['#00f5d4', '#00bbf9', '#9b5de5'] },
    { id: 'blood', name: 'Blood Moon', colors: ['#1a0000', '#4a0000', '#8b0000'] },
    { id: 'aurora', name: 'Aurora', colors: ['#00c6ff', '#0072ff', '#7209b7'] },
    { id: 'volcanic', name: 'Volcanic', colors: ['#1a0a0a', '#4a1010', '#ff4500'] },
    { id: 'custom', name: 'Custom', colors: ['#667eea', '#764ba2'] },
];

// Animated background effects
const backgroundEffects = [
    { id: 'none', name: 'None' },
    { id: 'particles', name: 'Particles' },
    { id: 'stars', name: 'Starfield' },
    { id: 'blocks', name: 'Floating Blocks' },
    { id: 'rain', name: 'Matrix Rain' },
    { id: 'bubbles', name: 'Bubbles' },
    { id: 'snow', name: 'Snow' },
    { id: 'fireflies', name: 'Fireflies' },
    { id: 'confetti', name: 'Confetti' },
    { id: 'sparks', name: 'Sparks' },
    { id: 'embers', name: 'Embers' },
    { id: 'dust', name: 'Dust' },
    { id: 'pulse', name: 'Pulse Rings' },
    { id: 'waves', name: 'Waves' },
];

// Patterns
const patterns = [
    { id: 'none', name: 'None' },
    { id: 'dots', name: 'Dots' },
    { id: 'grid', name: 'Grid' },
    { id: 'diagonal', name: 'Diagonal' },
    { id: 'hexagon', name: 'Hexagon' },
    { id: 'circuit', name: 'Circuit' },
    { id: 'crosses', name: 'Crosses' },
    { id: 'triangles', name: 'Triangles' },
    { id: 'waves', name: 'Waves' },
    { id: 'diamond', name: 'Diamond' },
    { id: 'zigzag', name: 'Zigzag' },
    { id: 'stars', name: 'Stars' },
];

// Text effects
const textEffects = [
    { id: 'none', name: 'None' },
    { id: 'shadow', name: 'Shadow' },
    { id: 'glow', name: 'Glow' },
    { id: 'outline', name: 'Outline' },
    { id: 'neon', name: 'Neon' },
    { id: '3d', name: '3D' },
    { id: 'gradient', name: 'Gradient' },
    { id: 'glitch', name: 'Glitch' },
    { id: 'metallic', name: 'Metallic' },
];

// Overlays
const overlays = [
    { id: 'none', name: 'None' },
    { id: 'vignette', name: 'Vignette' },
    { id: 'top-fade', name: 'Top Fade' },
    { id: 'bottom-fade', name: 'Bottom Fade' },
    { id: 'full-darken', name: 'Darken' },
    { id: 'scanlines', name: 'Scanlines' },
    { id: 'noise', name: 'Noise' },
    { id: 'gradient-left', name: 'Left Fade' },
    { id: 'gradient-right', name: 'Right Fade' },
    { id: 'corners', name: 'Corner Shadows' },
];

// Text positions
const textPositions = [
    { id: 'top-left', name: 'Top Left', x: 'left', y: 'top' },
    { id: 'top-center', name: 'Top', x: 'center', y: 'top' },
    { id: 'top-right', name: 'Top Right', x: 'right', y: 'top' },
    { id: 'center-left', name: 'Left', x: 'left', y: 'center' },
    { id: 'center', name: 'Center', x: 'center', y: 'center' },
    { id: 'center-right', name: 'Right', x: 'right', y: 'center' },
    { id: 'bottom-left', name: 'Bottom Left', x: 'left', y: 'bottom' },
    { id: 'bottom-center', name: 'Bottom', x: 'center', y: 'bottom' },
    { id: 'bottom-right', name: 'Bottom Right', x: 'right', y: 'bottom' },
];

// Templates
const templates = [
    {
        id: 'gaming',
        name: 'Gaming',
        emoji: '🎮',
        config: {
            gradient: 'cyber',
            pattern: 'circuit',
            textEffect: 'neon',
            overlay: 'vignette',
            backgroundEffect: 'particles',
            font: 'gaming',
            fontSize: 72,
        },
    },
    {
        id: 'survival',
        name: 'Survival',
        emoji: '🌲',
        config: {
            gradient: 'forest',
            pattern: 'none',
            textEffect: 'shadow',
            overlay: 'bottom-fade',
            backgroundEffect: 'fireflies',
            font: 'bold',
            fontSize: 72,
        },
    },
    {
        id: 'pvp',
        name: 'PvP',
        emoji: '⚔️',
        config: {
            gradient: 'fire',
            pattern: 'diagonal',
            textEffect: '3d',
            overlay: 'vignette',
            backgroundEffect: 'particles',
            font: 'bold',
            fontSize: 80,
        },
    },
    {
        id: 'skyblock',
        name: 'Skyblock',
        emoji: '☁️',
        config: {
            gradient: 'ocean',
            pattern: 'none',
            textEffect: 'glow',
            overlay: 'none',
            backgroundEffect: 'bubbles',
            font: 'futuristic',
            fontSize: 72,
        },
    },
    {
        id: 'factions',
        name: 'Factions',
        emoji: '🏰',
        config: {
            gradient: 'blood',
            pattern: 'hexagon',
            textEffect: 'metallic',
            overlay: 'vignette',
            backgroundEffect: 'none',
            font: 'elegant',
            fontSize: 72,
        },
    },
    {
        id: 'creative',
        name: 'Creative',
        emoji: '🎨',
        config: {
            gradient: 'aurora',
            pattern: 'dots',
            textEffect: 'gradient',
            overlay: 'none',
            backgroundEffect: 'stars',
            font: 'handwritten',
            fontSize: 72,
        },
    },
    {
        id: 'minigames',
        name: 'Minigames',
        emoji: '🎯',
        config: {
            gradient: 'gold',
            pattern: 'grid',
            textEffect: 'outline',
            overlay: 'scanlines',
            backgroundEffect: 'blocks',
            font: 'pixel',
            fontSize: 64,
        },
    },
    {
        id: 'hardcore',
        name: 'Hardcore',
        emoji: '💀',
        config: {
            gradient: 'obsidian',
            pattern: 'diagonal',
            textEffect: 'glitch',
            overlay: 'vignette',
            backgroundEffect: 'rain',
            font: 'minecraft',
            fontSize: 56,
        },
    },
];

// Resolution options
const resolutions = [
    { id: 'standard', name: 'Standard', width: 1200, height: 400 },
    { id: 'hd', name: 'HD', width: 1920, height: 640 },
    { id: '2k', name: '2K', width: 2560, height: 853 },
];

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


export default function BannerGeneratorPage() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const animationRef = React.useRef<number>(0);
    const particlesRef = React.useRef<Particle[]>([]);
    const backgroundImageRef = React.useRef<HTMLImageElement | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [isAnimating, setIsAnimating] = React.useState(true);
    const [fontsLoaded, setFontsLoaded] = React.useState(false);
    const [backgroundImage, setBackgroundImage] = React.useState<string | null>(null);
    const [customColors, setCustomColors] = React.useState({ color1: '#667eea', color2: '#764ba2' });

    const [config, setConfig] = React.useState({
        text: 'My Server',
        subtitle: 'Join us now!',
        gradient: gradients[0].id,
        pattern: patterns[0].id,
        textEffect: textEffects[1].id,
        overlay: overlays[1].id,
        backgroundEffect: backgroundEffects[0].id,
        font: fonts[0].id,
        fontSize: 72,
        subtitleSize: 28,
        showSubtitle: true,
        resolution: resolutions[1].id,
        particleCount: 50,
        particleSpeed: 1,
        textPosition: 'center',
        textColor: '#ffffff',
        subtitleColor: '#ffffff',
        // Opacity settings (0-100)
        patternOpacity: 100,
        overlayOpacity: 100,
        animationOpacity: 100,
        // Pattern color
        patternColor: '#ffffff',
    });

    const getGradientColors = () => {
        if (config.gradient === 'custom') {
            return [customColors.color1, customColors.color2];
        }
        return gradients.find((g) => g.id === config.gradient)?.colors || gradients[0].colors;
    };

    const selectedGradient = { colors: getGradientColors() };
    const selectedFont = fonts.find((f) => f.id === config.font) || fonts[0];
    const selectedResolution = resolutions.find((r) => r.id === config.resolution) || resolutions[1];
    const selectedPosition = textPositions.find((p) => p.id === config.textPosition) || textPositions[4];

    // Load Google Fonts
    React.useEffect(() => {
        const fontLinks = fonts
            .filter((f) => f.google)
            .map((f) => f.google)
            .join('&family=');

        if (fontLinks) {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${fontLinks}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            link.onload = () => setFontsLoaded(true);
        } else {
            setFontsLoaded(true);
        }
    }, []);

    // Load background image
    React.useEffect(() => {
        if (backgroundImage) {
            const img = new Image();
            img.onload = () => {
                backgroundImageRef.current = img;
            };
            img.src = backgroundImage;
        } else {
            backgroundImageRef.current = null;
        }
    }, [backgroundImage]);

    // Handle file upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image too large', { description: 'Max file size is 5MB' });
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setBackgroundImage(event.target?.result as string);
                toast.success('Background image uploaded!');
            };
            reader.readAsDataURL(file);
        }
    };

    const clearBackgroundImage = () => {
        setBackgroundImage(null);
        backgroundImageRef.current = null;
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success('Background image removed');
    };

    // Apply template
    const applyTemplate = (template: (typeof templates)[0]) => {
        setConfig((prev) => ({
            ...prev,
            ...template.config,
        }));
        toast.success(`Applied "${template.name}" template`);
    };

    // Initialize particles
    const initParticles = React.useCallback(
        (width: number, height: number) => {
            const particles: Particle[] = [];
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
        },
        [config.backgroundEffect, config.particleCount, config.particleSpeed],
    );

    // Draw particles
    const drawParticles = React.useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const opacityMultiplier = config.animationOpacity / 100;

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
        },
        [config.backgroundEffect, config.animationOpacity],
    );

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

    // Helper to convert hex to rgba
    const hexToRgba = (hex: string, alpha: number): string => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    };

    // Draw pattern
    const drawPattern = React.useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const opacity = (config.patternOpacity / 100) * 0.15; // Base opacity * user opacity
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
        },
        [config.pattern, config.patternOpacity, config.patternColor],
    );

    // Draw overlay
    const drawOverlay = React.useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const opacityMultiplier = config.overlayOpacity / 100;

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
        },
        [config.overlay, config.overlayOpacity],
    );

    // Draw text with position support
    const drawText = React.useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number, forExport = false) => {
            const scaleFactor = Math.min(width / 960, height / 320);
            const scaledFontSize = Math.max(config.fontSize * scaleFactor, 12);
            const scaledSubtitleSize = Math.max(config.subtitleSize * scaleFactor, 10);

            // Calculate text position
            let textX = width / 2;
            let textY = height / 2;
            const padding = 40 * scaleFactor;

            if (selectedPosition.x === 'left') {
                textX = padding + scaledFontSize;
                ctx.textAlign = 'left';
            } else if (selectedPosition.x === 'right') {
                textX = width - padding;
                ctx.textAlign = 'right';
            } else {
                ctx.textAlign = 'center';
            }

            if (selectedPosition.y === 'top') {
                textY = padding + scaledFontSize / 2;
            } else if (selectedPosition.y === 'bottom') {
                textY = height - padding - (config.showSubtitle ? scaledSubtitleSize + 10 * scaleFactor : 0);
            } else {
                textY = config.showSubtitle ? height / 2 - 10 * scaleFactor : height / 2;
            }

            ctx.textBaseline = 'middle';
            ctx.font = `${selectedFont.weight} ${scaledFontSize}px ${selectedFont.family}`;

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            const text = config.text || 'My Server';
            const gradientColors = selectedGradient.colors;

            const textColor = config.textColor || '#ffffff';
            const subtitleColor = config.subtitleColor || '#ffffff';

            if (config.textEffect === 'shadow') {
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === 'glow') {
                ctx.shadowColor = textColor + 'cc';
                ctx.shadowBlur = 30;
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === 'outline') {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 8;
                ctx.strokeText(text, textX, textY);
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === 'neon') {
                ctx.shadowColor = textColor;
                ctx.shadowBlur = 40;
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
                ctx.shadowBlur = 20;
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === '3d') {
                for (let i = 10; i > 0; i--) {
                    ctx.fillStyle = `rgba(0,0,0,${0.1 + i * 0.02})`;
                    ctx.fillText(text, textX + i * 2, textY + i * 2);
                }
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === 'gradient') {
                const gradient = ctx.createLinearGradient(textX - 200, textY, textX + 200, textY);
                gradient.addColorStop(0, gradientColors[0]);
                gradient.addColorStop(1, gradientColors[gradientColors.length - 1]);
                ctx.fillStyle = gradient;
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === 'glitch') {
                const offset = forExport ? 3 : Math.sin(Date.now() * 0.01) * 5;
                ctx.fillStyle = 'rgba(255,0,0,0.7)';
                ctx.fillText(text, textX - offset, textY);
                ctx.fillStyle = 'rgba(0,255,255,0.7)';
                ctx.fillText(text, textX + offset, textY);
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
            } else if (config.textEffect === 'metallic') {
                const gradient = ctx.createLinearGradient(textX, textY - scaledFontSize / 2, textX, textY + scaledFontSize / 2);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#aaaaaa');
                gradient.addColorStop(0.5, '#ffffff');
                gradient.addColorStop(0.7, '#888888');
                gradient.addColorStop(1, '#cccccc');
                ctx.fillStyle = gradient;
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 3;
                ctx.fillText(text, textX, textY);
            } else {
                ctx.fillStyle = textColor;
                ctx.fillText(text, textX, textY);
            }

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            if (config.showSubtitle && config.subtitle) {
                ctx.font = `500 ${scaledSubtitleSize}px ${selectedFont.family}`;
                ctx.fillStyle = subtitleColor + 'd9';
                ctx.fillText(config.subtitle, textX, textY + scaledFontSize / 2 + 20 * scaleFactor);
            }
        },
        [config, selectedFont, selectedGradient, selectedPosition],
    );

    // Main render function
    const renderBanner = React.useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number, forExport = false) => {
            ctx.clearRect(0, 0, width, height);

            // Draw background image or gradient
            if (backgroundImageRef.current) {
                const img = backgroundImageRef.current;
                const imgRatio = img.width / img.height;
                const canvasRatio = width / height;

                let drawWidth, drawHeight, drawX, drawY;

                if (imgRatio > canvasRatio) {
                    drawHeight = height;
                    drawWidth = height * imgRatio;
                    drawX = (width - drawWidth) / 2;
                    drawY = 0;
                } else {
                    drawWidth = width;
                    drawHeight = width / imgRatio;
                    drawX = 0;
                    drawY = (height - drawHeight) / 2;
                }

                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            } else {
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                const colors = selectedGradient.colors;
                colors.forEach((color, i) => {
                    gradient.addColorStop(i / (colors.length - 1), color);
                });
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }

            drawPattern(ctx, width, height);

            if (config.backgroundEffect !== 'none') {
                drawParticles(ctx, width, height);
            }

            drawOverlay(ctx, width, height);
            drawText(ctx, width, height, forExport);
        },
        [selectedGradient, config.backgroundEffect, drawPattern, drawParticles, drawOverlay, drawText],
    );

    // Animation loop for preview
    React.useEffect(() => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const previewWidth = 960;
        const previewHeight = 320;
        canvas.width = previewWidth;
        canvas.height = previewHeight;

        if (config.backgroundEffect !== 'none') {
            initParticles(previewWidth, previewHeight);
        }

        const animate = () => {
            if (!isAnimating) return;

            renderBanner(ctx, previewWidth, previewHeight);

            if (config.backgroundEffect !== 'none') {
                updateParticles(previewWidth, previewHeight);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [config, isAnimating, initParticles, updateParticles, renderBanner]);

    // Generate final banner
    const generateBanner = React.useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const { width, height } = selectedResolution;
        canvas.width = width;
        canvas.height = height;

        if (config.backgroundEffect !== 'none') {
            initParticles(width, height);
        }

        renderBanner(ctx, width, height, true);

        return canvas.toDataURL('image/webp', 0.9);
    }, [config, selectedResolution, initParticles, renderBanner]);

    const downloadBanner = async () => {
        const dataUrl = await generateBanner();
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.download = `${config.text.toLowerCase().replace(/\s+/g, '-')}-banner.webp`;
        link.href = dataUrl;
        link.click();

        toast.success('Banner downloaded!', {
            description: `Resolution: ${selectedResolution.width}x${selectedResolution.height}`,
        });
    };

    const copyDataUrl = async () => {
        const dataUrl = await generateBanner();
        if (!dataUrl) return;

        await navigator.clipboard.writeText(dataUrl);
        toast.success('Data URL copied!', {
            description: 'Paste this in the banner URL field.',
        });
    };

    const copyAnimatedConfig = async () => {
        const bannerConfig = {
            text: config.text,
            subtitle: config.subtitle,
            gradient: config.gradient,
            customColors: config.gradient === 'custom' ? customColors : undefined,
            pattern: config.pattern,
            patternColor: config.patternColor,
            textEffect: config.textEffect,
            overlay: config.overlay,
            backgroundEffect: config.backgroundEffect,
            font: config.font,
            fontSize: config.fontSize,
            subtitleSize: config.subtitleSize,
            showSubtitle: config.showSubtitle,
            particleCount: config.particleCount,
            particleSpeed: config.particleSpeed,
            textPosition: config.textPosition,
            textColor: config.textColor,
            subtitleColor: config.subtitleColor,
            patternOpacity: config.patternOpacity,
            overlayOpacity: config.overlayOpacity,
            animationOpacity: config.animationOpacity,
        };

        await navigator.clipboard.writeText(JSON.stringify(bannerConfig));
        toast.success('Animated config copied!', {
            description: 'Use this in your server settings for an animated banner.',
        });
    };

    const randomize = () => {
        setConfig({
            ...config,
            gradient: gradients[Math.floor(Math.random() * (gradients.length - 1))].id,
            pattern: patterns[Math.floor(Math.random() * patterns.length)].id,
            overlay: overlays[Math.floor(Math.random() * overlays.length)].id,
            textEffect: textEffects[Math.floor(Math.random() * textEffects.length)].id,
            backgroundEffect: backgroundEffects[Math.floor(Math.random() * backgroundEffects.length)].id,
            font: fonts[Math.floor(Math.random() * fonts.length)].id,
            textPosition: textPositions[Math.floor(Math.random() * textPositions.length)].id,
        });
    };

    return (
        <PublicLayout>
            <Head title="Banner Generator - Kaizen Votes" />

            <div className="min-h-screen pt-20 pb-12">
                {/* Header */}
                <section className="border-b border-border/50 bg-gradient-to-b from-violet-500/5 to-transparent py-6">
                    <div className="mx-auto max-w-7xl px-4">
                        <Link
                            href="/servers/create"
                            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Add Server
                        </Link>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                                    <Sparkles className="size-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Banner Generator</h1>
                                    <p className="text-sm text-muted-foreground">Create stunning animated banners</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)}>
                                    {isAnimating ? <Pause className="size-4" /> : <Play className="size-4" />}
                                </Button>
                                <Button variant="outline" size="sm" onClick={randomize} className="gap-2">
                                    <Wand2 className="size-4" />
                                    Random
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-[1600px] px-4 py-6">
                    {/* Preview Section - Full Width */}
                    <div className="mb-6 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                        <div className="overflow-hidden rounded-lg border border-border/30 bg-black/20">
                            <canvas ref={previewCanvasRef} className="mx-auto w-full" style={{ aspectRatio: '3/1' }} />
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Settings Panel with Tabs */}
                    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <Tabs defaultValue="text" className="w-full">
                            {/* Tab Bar with Actions */}
                            <div className="flex items-center justify-between border-b border-border/50 px-4">
                                <TabsList className="h-14 bg-transparent border-0 gap-1">
                                    <TabsTrigger value="text" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-500">
                                        Text
                                    </TabsTrigger>
                                    <TabsTrigger value="background" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-500">
                                        Background
                                    </TabsTrigger>
                                    <TabsTrigger value="effects" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-500">
                                        Effects
                                    </TabsTrigger>
                                    <TabsTrigger value="export" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-500">
                                        Export
                                    </TabsTrigger>
                                </TabsList>

                                {/* Templates & Actions */}
                                <div className="flex items-center gap-3">
                                    <div className="hidden md:flex items-center gap-1">
                                        {templates.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => applyTemplate(template)}
                                                className="flex items-center justify-center size-8 rounded-lg hover:bg-accent/50 transition-all"
                                                title={template.name}
                                            >
                                                <span>{template.emoji}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="h-6 w-px bg-border/50 hidden md:block" />
                                    <Button onClick={downloadBanner} size="sm" className="gap-2">
                                        <Download className="size-4" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyAnimatedConfig}
                                        className="gap-2 border-violet-500/50 text-violet-500 hover:bg-violet-500/10"
                                    >
                                        <Settings2 className="size-4" />
                                        Copy Animated
                                    </Button>
                                </div>
                            </div>

                            {/* Tab Content Area */}
                            <div className="grid lg:grid-cols-3 min-h-[320px]">
                                {/* Main Settings Area */}
                                <div className="lg:col-span-2 p-6 border-r border-border/50">
                                    {/* Text Tab */}
                                    <TabsContent value="text" className="mt-0 space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Server Name</Label>
                                                    <Input
                                                        value={config.text}
                                                        onChange={(e) => setConfig({ ...config, text: e.target.value })}
                                                        placeholder="My Server"
                                                        className="text-lg h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Subtitle</Label>
                                                        <label className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={config.showSubtitle}
                                                                onChange={(e) => setConfig({ ...config, showSubtitle: e.target.checked })}
                                                                className="rounded"
                                                            />
                                                            Show
                                                        </label>
                                                    </div>
                                                    <Input
                                                        value={config.subtitle}
                                                        onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                                                        placeholder="Join us now!"
                                                        disabled={!config.showSubtitle}
                                                    />
                                                </div>
                                                {/* Text Colors */}
                                                <div className="space-y-2">
                                                    <Label>Text Colors</Label>
                                                    <div className="flex gap-3">
                                                        <div className="flex-1 space-y-1">
                                                            <Label className="text-xs text-muted-foreground">Title</Label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={config.textColor}
                                                                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                                                                    className="size-10 rounded-lg cursor-pointer border-0"
                                                                />
                                                                <Input
                                                                    value={config.textColor}
                                                                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                                                                    className="h-10 font-mono text-sm uppercase"
                                                                    maxLength={7}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <Label className="text-xs text-muted-foreground">Subtitle</Label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={config.subtitleColor}
                                                                    onChange={(e) => setConfig({ ...config, subtitleColor: e.target.value })}
                                                                    className="size-10 rounded-lg cursor-pointer border-0"
                                                                    disabled={!config.showSubtitle}
                                                                />
                                                                <Input
                                                                    value={config.subtitleColor}
                                                                    onChange={(e) => setConfig({ ...config, subtitleColor: e.target.value })}
                                                                    className="h-10 font-mono text-sm uppercase"
                                                                    maxLength={7}
                                                                    disabled={!config.showSubtitle}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Font</Label>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {fonts.map((f) => (
                                                            <button
                                                                key={f.id}
                                                                onClick={() => setConfig({ ...config, font: f.id })}
                                                                className={cn(
                                                                    'rounded-lg border px-3 py-2 text-sm transition-all',
                                                                    config.font === f.id
                                                                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                        : 'border-border hover:border-violet-500/50',
                                                                )}
                                                            >
                                                                {f.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Text Effect</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {textEffects.map((e) => (
                                                            <button
                                                                key={e.id}
                                                                onClick={() => setConfig({ ...config, textEffect: e.id })}
                                                                className={cn(
                                                                    'rounded-lg border px-3 py-1.5 text-sm transition-all',
                                                                    config.textEffect === e.id
                                                                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                        : 'border-border hover:border-violet-500/50',
                                                                )}
                                                            >
                                                                {e.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Background Tab */}
                                    <TabsContent value="background" className="mt-0 space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {/* Image Upload */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Background Image</Label>
                                                    {backgroundImage ? (
                                                        <div className="relative rounded-lg overflow-hidden border border-border">
                                                            <img src={backgroundImage} alt="Background" className="w-full h-32 object-cover" />
                                                            <button
                                                                onClick={clearBackgroundImage}
                                                                className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 hover:bg-black/70"
                                                            >
                                                                <X className="size-4 text-white" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border py-8 hover:border-violet-500/50 hover:bg-accent/50 transition-all"
                                                        >
                                                            <ImagePlus className="size-6 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Upload Image</span>
                                                        </button>
                                                    )}
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </div>

                                                {/* Pattern */}
                                                <div className="space-y-2">
                                                    <Label>Pattern</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {patterns.map((p) => (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => setConfig({ ...config, pattern: p.id })}
                                                                className={cn(
                                                                    'rounded-lg border px-3 py-1.5 text-sm transition-all',
                                                                    config.pattern === p.id
                                                                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                        : 'border-border hover:border-violet-500/50',
                                                                )}
                                                            >
                                                                {p.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Pattern Settings */}
                                                {config.pattern !== 'none' && (
                                                    <div className="space-y-4 p-4 rounded-lg bg-accent/30">
                                                        <div className="space-y-2">
                                                            <Label>Pattern Color</Label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={config.patternColor}
                                                                    onChange={(e) => setConfig({ ...config, patternColor: e.target.value })}
                                                                    className="size-10 rounded-lg cursor-pointer border-0"
                                                                />
                                                                <Input
                                                                    value={config.patternColor}
                                                                    onChange={(e) => setConfig({ ...config, patternColor: e.target.value })}
                                                                    className="h-10 font-mono text-sm uppercase flex-1"
                                                                    maxLength={7}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <Label className="text-sm">Pattern Opacity</Label>
                                                                <span className="text-sm text-muted-foreground">{config.patternOpacity}%</span>
                                                            </div>
                                                            <Slider
                                                                value={[config.patternOpacity]}
                                                                onValueChange={([v]) => setConfig({ ...config, patternOpacity: v })}
                                                                min={0}
                                                                max={100}
                                                                step={5}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gradient */}
                                            {!backgroundImage && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Gradient</Label>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {gradients.slice(0, -1).map((g) => (
                                                                <button
                                                                    key={g.id}
                                                                    onClick={() => setConfig({ ...config, gradient: g.id })}
                                                                    className={cn(
                                                                        'aspect-square rounded-lg transition-all hover:scale-105',
                                                                        config.gradient === g.id &&
                                                                            'ring-2 ring-violet-500 ring-offset-2 ring-offset-background',
                                                                    )}
                                                                    style={{
                                                                        background: `linear-gradient(135deg, ${g.colors.join(', ')})`,
                                                                    }}
                                                                    title={g.name}
                                                                >
                                                                    {config.gradient === g.id && (
                                                                        <Check className="size-4 text-white drop-shadow m-auto" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Custom Colors */}
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={config.gradient === 'custom'}
                                                                onChange={(e) =>
                                                                    setConfig({ ...config, gradient: e.target.checked ? 'custom' : 'purple' })
                                                                }
                                                                className="rounded"
                                                            />
                                                            <Label className="cursor-pointer">Custom Colors</Label>
                                                        </label>
                                                        {config.gradient === 'custom' && (
                                                            <div className="flex gap-3">
                                                                <div className="flex-1 space-y-1">
                                                                    <Label className="text-xs">Color 1</Label>
                                                                    <input
                                                                        type="color"
                                                                        value={customColors.color1}
                                                                        onChange={(e) =>
                                                                            setCustomColors({ ...customColors, color1: e.target.value })
                                                                        }
                                                                        className="w-full h-10 rounded-lg cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <Label className="text-xs">Color 2</Label>
                                                                    <input
                                                                        type="color"
                                                                        value={customColors.color2}
                                                                        onChange={(e) =>
                                                                            setCustomColors({ ...customColors, color2: e.target.value })
                                                                        }
                                                                        className="w-full h-10 rounded-lg cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Effects Tab */}
                                    <TabsContent value="effects" className="mt-0 space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Animation Effect</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {backgroundEffects.map((e) => (
                                                            <button
                                                                key={e.id}
                                                                onClick={() => setConfig({ ...config, backgroundEffect: e.id })}
                                                                className={cn(
                                                                    'rounded-lg border px-3 py-1.5 text-sm transition-all',
                                                                    config.backgroundEffect === e.id
                                                                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                        : 'border-border hover:border-violet-500/50',
                                                                )}
                                                            >
                                                                {e.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {config.backgroundEffect !== 'none' && (
                                                    <div className="space-y-4 p-4 rounded-lg bg-accent/30">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <Label className="text-sm">Particles</Label>
                                                                <span className="text-sm text-muted-foreground">{config.particleCount}</span>
                                                            </div>
                                                            <Slider
                                                                value={[config.particleCount]}
                                                                onValueChange={([v]) => setConfig({ ...config, particleCount: v })}
                                                                min={10}
                                                                max={150}
                                                                step={5}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <Label className="text-sm">Speed</Label>
                                                                <span className="text-sm text-muted-foreground">{config.particleSpeed.toFixed(1)}x</span>
                                                            </div>
                                                            <Slider
                                                                value={[config.particleSpeed]}
                                                                onValueChange={([v]) => setConfig({ ...config, particleSpeed: v })}
                                                                min={0.1}
                                                                max={3}
                                                                step={0.1}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <Label className="text-sm">Animation Opacity</Label>
                                                                <span className="text-sm text-muted-foreground">{config.animationOpacity}%</span>
                                                            </div>
                                                            <Slider
                                                                value={[config.animationOpacity]}
                                                                onValueChange={([v]) => setConfig({ ...config, animationOpacity: v })}
                                                                min={0}
                                                                max={100}
                                                                step={5}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Overlay</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {overlays.map((o) => (
                                                            <button
                                                                key={o.id}
                                                                onClick={() => setConfig({ ...config, overlay: o.id })}
                                                                className={cn(
                                                                    'rounded-lg border px-3 py-1.5 text-sm transition-all',
                                                                    config.overlay === o.id
                                                                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                        : 'border-border hover:border-violet-500/50',
                                                                )}
                                                            >
                                                                {o.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {config.overlay !== 'none' && (
                                                    <div className="space-y-2 p-4 rounded-lg bg-accent/30">
                                                        <div className="flex justify-between">
                                                            <Label className="text-sm">Overlay Opacity</Label>
                                                            <span className="text-sm text-muted-foreground">{config.overlayOpacity}%</span>
                                                        </div>
                                                        <Slider
                                                            value={[config.overlayOpacity]}
                                                            onValueChange={([v]) => setConfig({ ...config, overlayOpacity: v })}
                                                            min={0}
                                                            max={100}
                                                            step={5}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Export Tab */}
                                    <TabsContent value="export" className="mt-0 space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Resolution</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {resolutions.map((r) => (
                                                            <button
                                                                key={r.id}
                                                                onClick={() => setConfig({ ...config, resolution: r.id })}
                                                                className={cn(
                                                                    'rounded-lg border px-4 py-2 text-sm transition-all',
                                                                    config.resolution === r.id
                                                                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                        : 'border-border hover:border-violet-500/50',
                                                                )}
                                                            >
                                                                {r.name} ({r.width}×{r.height})
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    <Button onClick={downloadBanner} className="gap-2">
                                                        <Download className="size-4" />
                                                        Download WebP
                                                    </Button>
                                                    <Button variant="outline" onClick={copyDataUrl} className="gap-2">
                                                        <Copy className="size-4" />
                                                        Copy as Data URL
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                                                    <h4 className="font-medium text-violet-500 mb-2">Animated Banner</h4>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        Copy the animated configuration to display a live animated banner on your server page.
                                                    </p>
                                                    <Button
                                                        onClick={copyAnimatedConfig}
                                                        className="gap-2 w-full bg-violet-500 hover:bg-violet-600"
                                                    >
                                                        <Settings2 className="size-4" />
                                                        Copy Animated Config
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>

                                {/* Precise Settings Sidebar */}
                                <div className="p-6 bg-accent/20">
                                    <h3 className="font-semibold mb-4">Fine Tuning</h3>

                                    <div className="space-y-6">
                                        {/* Font Size */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-sm">Font Size</Label>
                                                <span className="text-sm text-muted-foreground">{config.fontSize}px</span>
                                            </div>
                                            <Slider
                                                value={[config.fontSize]}
                                                onValueChange={([v]) => setConfig({ ...config, fontSize: v })}
                                                min={40}
                                                max={120}
                                                step={2}
                                            />
                                        </div>

                                        {/* Subtitle Size */}
                                        {config.showSubtitle && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label className="text-sm">Subtitle Size</Label>
                                                    <span className="text-sm text-muted-foreground">{config.subtitleSize}px</span>
                                                </div>
                                                <Slider
                                                    value={[config.subtitleSize]}
                                                    onValueChange={([v]) => setConfig({ ...config, subtitleSize: v })}
                                                    min={14}
                                                    max={48}
                                                    step={2}
                                                />
                                            </div>
                                        )}

                                        {/* Text Position */}
                                        <div className="space-y-2">
                                            <Label className="text-sm">Text Position</Label>
                                            <div className="grid grid-cols-3 gap-1">
                                                {textPositions.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => setConfig({ ...config, textPosition: p.id })}
                                                        className={cn(
                                                            'rounded-lg border px-2 py-2 text-xs transition-all',
                                                            config.textPosition === p.id
                                                                ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                                                                : 'border-border hover:border-violet-500/50',
                                                        )}
                                                    >
                                                        {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="pt-4 border-t border-border/50 space-y-2 text-sm text-muted-foreground">
                                            <p>Export: {selectedResolution.width}×{selectedResolution.height}px</p>
                                            <p>Format: WebP (optimized)</p>
                                            <p className="flex items-center gap-2">
                                                <span className={isAnimating ? 'text-green-500' : 'text-muted-foreground'}>●</span>
                                                {isAnimating ? 'Animation running' : 'Animation paused'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
