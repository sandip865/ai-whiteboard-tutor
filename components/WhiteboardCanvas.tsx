'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  WhiteboardAction,
  WhiteboardTheme,
  UserDrawingStroke,
  Point,
  LessonBeat,
} from '@/types/tutor';
import {
  Pencil,
  Highlighter,
  Eraser,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  MousePointer,
} from 'lucide-react';

interface WhiteboardCanvasProps {
  currentBeat: LessonBeat | null;
  currentTimeInBeat: number; // in seconds
  theme: WhiteboardTheme;
  interactiveMode: boolean; // true = learner draw mode, false = tutor presentation mode
  onElementClick?: (elementText: string) => void;
  laserPointerPos: Point | null;
  extraAnnotations?: WhiteboardAction[];
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  currentBeat,
  currentTimeInBeat,
  theme,
  interactiveMode,
  onElementClick,
  laserPointerPos,
  extraAnnotations = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // User drawing state (learner annotations)
  const [userTool, setUserTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [drawColor, setDrawColor] = useState<string>('#38bdf8');
  const [drawSize, setDrawSize] = useState<number>(3);
  const [userStrokes, setUserStrokes] = useState<UserDrawingStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<Point[]>([]);

  // Zoom and pan
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });

  // Virtual canvas dimensions (fixed coordinate system: 880 x 420)
  const VIRTUAL_WIDTH = 880;
  const VIRTUAL_HEIGHT = 420;

  // Active actions up to currentTimeInBeat
  const activeActions = React.useMemo(() => {
    if (!currentBeat) return [];
    const beatActions = currentBeat.actions.filter(
      (a) => a.timeOffset <= currentTimeInBeat && a.type !== 'laser_pointer'
    );
    return [...beatActions, ...extraAnnotations];
  }, [currentBeat, currentTimeInBeat, extraAnnotations]);

  // Color schemes for whiteboard themes
  const themeStyles = {
    blueprint: {
      bg: '#070f1e',
      grid: 'rgba(56, 189, 248, 0.08)',
      textColor: '#f8fafc',
      cardDefault: '#0e1d38',
      borderColor: '#1e3a8a',
    },
    dark: {
      bg: '#090d16',
      grid: 'rgba(255, 255, 255, 0.04)',
      textColor: '#f8fafc',
      cardDefault: '#1e293b',
      borderColor: '#334155',
    },
    chalkboard: {
      bg: '#0d1f18',
      grid: 'rgba(52, 211, 153, 0.05)',
      textColor: '#f0fdf4',
      cardDefault: '#132e24',
      borderColor: '#10b981',
    },
    clean: {
      bg: '#f8fafc',
      grid: 'rgba(15, 23, 42, 0.06)',
      textColor: '#0f172a',
      cardDefault: '#ffffff',
      borderColor: '#cbd5e1',
    },
  };

  const currentStyle = themeStyles[theme] || themeStyles.blueprint;

  // Render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Coordinate transformation: virtual (880x420) -> client rect
    const scaleX = rect.width / VIRTUAL_WIDTH;
    const scaleY = rect.height / VIRTUAL_HEIGHT;
    const baseScale = Math.min(scaleX, scaleY);

    // Apply pan & zoom
    ctx.translate(pan.x, pan.y);
    ctx.scale(baseScale * zoom, baseScale * zoom);

    // Center virtual canvas if aspect ratios differ
    const offsetX = (rect.width / (baseScale * zoom) - VIRTUAL_WIDTH) / 2;
    const offsetY = (rect.height / (baseScale * zoom) - VIRTUAL_HEIGHT) / 2;
    ctx.translate(offsetX, offsetY);

    // 1. Clear background
    ctx.fillStyle = currentStyle.bg;
    ctx.fillRect(-offsetX, -offsetY, rect.width / (baseScale * zoom), rect.height / (baseScale * zoom));

    // 2. Draw subtle grid
    drawGrid(ctx, -offsetX, -offsetY, rect.width / (baseScale * zoom), rect.height / (baseScale * zoom), currentStyle.grid);

    // 3. Render whiteboard actions from tutor
    for (const action of activeActions) {
      renderAction(ctx, action, currentStyle);
    }

    // 4. Render user drawing strokes
    for (const stroke of userStrokes) {
      renderUserStroke(ctx, stroke);
    }

    // 5. Render tutor's laser pointer if active
    if (laserPointerPos && !interactiveMode) {
      renderLaserPointer(ctx, laserPointerPos);
    }

    ctx.restore();
  }, [activeActions, currentStyle, userStrokes, laserPointerPos, interactiveMode, pan, zoom]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => renderCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  // Draw background grid
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    w: number,
    h: number,
    gridColor: string
  ) => {
    const step = 30;
    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let x = Math.floor(startX / step) * step; x < startX + w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + h);
      ctx.stroke();
    }
    for (let y = Math.floor(startY / step) * step; y < startY + h; y += step) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + w, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Render tutor elements
  const renderAction = (
    ctx: CanvasRenderingContext2D,
    action: WhiteboardAction,
    style: typeof currentStyle
  ) => {
    ctx.save();

    switch (action.type) {
      case 'draw_text': {
        ctx.fillStyle = action.color || style.textColor;
        ctx.font = `${action.fontWeight || '600'} ${action.fontSize || 18}px sans-serif`;
        ctx.fillText(action.text || '', action.x, action.y);
        if (action.subtitle) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.font = 'normal 13px sans-serif';
          ctx.fillText(action.subtitle, action.x, action.y + 20);
        }
        break;
      }

      case 'card': {
        const x = action.x;
        const y = action.y;
        const w = action.width || 220;
        const h = action.height || 140;
        const radius = 12;

        // Shadow / Glow
        ctx.shadowColor = action.color ? `${action.color}33` : 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Card fill
        ctx.fillStyle = action.fill || style.cardDefault;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();

        // Border
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = action.color || style.borderColor;
        ctx.lineWidth = action.strokeWidth || 2;
        ctx.stroke();

        // Badge if present
        if (action.badge) {
          ctx.fillStyle = action.color || '#38bdf8';
          ctx.beginPath();
          ctx.roundRect(x + w - 100, y - 10, 92, 22, 6);
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(action.badge, x + w - 54, y + 5);
          ctx.textAlign = 'start';
        }

        // Title text
        ctx.fillStyle = action.color || '#ffffff';
        ctx.font = `bold ${action.fontSize || 16}px sans-serif`;
        ctx.fillText(action.text || '', x + 16, y + 32);

        // Subtitle / body text (handles multiline)
        if (action.subtitle) {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'normal 12px sans-serif';
          const lines = action.subtitle.split('\n');
          lines.forEach((line, idx) => {
            ctx.fillText(line, x + 16, y + 56 + idx * 17);
          });
        }
        break;
      }

      case 'draw_circle': {
        const x = action.x;
        const y = action.y;
        const r = action.radius || 30;

        ctx.shadowColor = action.color ? `${action.color}40` : 'transparent';
        ctx.shadowBlur = 10;

        ctx.fillStyle = action.fill || style.cardDefault;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = action.color || '#38bdf8';
        ctx.lineWidth = action.strokeWidth || 2.5;
        ctx.stroke();

        if (action.text) {
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(action.text, x, y);
          ctx.textAlign = 'start';
          ctx.textBaseline = 'alphabetic';
        }

        if (action.subtitle) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(action.subtitle, x, y + r + 15);
          ctx.textAlign = 'start';
        }
        break;
      }

      case 'draw_arrow': {
        const fromX = action.x;
        const fromY = action.y;
        const toX = action.toX || fromX + 60;
        const toY = action.toY || fromY;

        ctx.strokeStyle = action.color || '#38bdf8';
        ctx.lineWidth = action.strokeWidth || 3;
        if (action.dashed) {
          ctx.setLineDash([6, 4]);
        }

        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrowhead
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.fillStyle = action.color || '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // Label above arrow
        if (action.text) {
          ctx.fillStyle = action.color || '#e2e8f0';
          ctx.font = 'bold 12px sans-serif';
          const midX = (fromX + toX) / 2;
          const midY = (fromY + toY) / 2 - 10;
          ctx.textAlign = 'center';
          ctx.fillText(action.text, midX, midY);
          ctx.textAlign = 'start';
        }
        break;
      }

      case 'highlight': {
        const x = action.x;
        const y = action.y;
        const w = action.width || 100;
        const h = action.height || 100;

        ctx.strokeStyle = action.color || '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 10);
        ctx.stroke();
        ctx.setLineDash([]);

        if (action.text) {
          ctx.fillStyle = action.color || '#f59e0b';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(action.text, x, y - 8);
        }
        break;
      }

      case 'sticky_note': {
        const x = action.x;
        const y = action.y;
        const w = action.width || 300;
        const h = action.height || 80;

        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#713f12';
        ctx.font = '500 13px sans-serif';
        const lines = (action.text || '').split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, x + 14, y + 26 + idx * 18);
        });
        break;
      }
    }

    ctx.restore();
  };

  // Render tutor laser pointer
  const renderLaserPointer = (ctx: CanvasRenderingContext2D, pos: Point) => {
    ctx.save();
    // Outer glow
    ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
    ctx.shadowBlur = 18;

    // Outer ring
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Inner bright core
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Center white dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Render user strokes
  const renderUserStroke = (ctx: CanvasRenderingContext2D, stroke: UserDrawingStroke) => {
    if (stroke.points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.tool === 'highlighter') {
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = stroke.size * 2.5;
    } else if (stroke.tool === 'eraser') {
      ctx.strokeStyle = currentStyle.bg;
      ctx.lineWidth = stroke.size * 3;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  };

  // Mouse / Touch drawing handlers for Learner Mode
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / VIRTUAL_WIDTH;
    const scaleY = rect.height / VIRTUAL_HEIGHT;
    const baseScale = Math.min(scaleX, scaleY);
    const offsetX = (rect.width / (baseScale * zoom) - VIRTUAL_WIDTH) / 2;
    const offsetY = (rect.height / (baseScale * zoom) - VIRTUAL_HEIGHT) / 2;

    const clientX = e.clientX - rect.left - pan.x;
    const clientY = e.clientY - rect.top - pan.y;

    const x = clientX / (baseScale * zoom) - offsetX;
    const y = clientY / (baseScale * zoom) - offsetY;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoordinates(e);
    if (!pt) return;

    if (interactiveMode) {
      setIsDrawing(true);
      currentStrokeRef.current = [pt];
    } else {
      // Tutor mode: click element to ask question about it
      const clicked = activeActions.find((a) => {
        if (a.type === 'card' && a.width && a.height) {
          return pt.x >= a.x && pt.x <= a.x + a.width && pt.y >= a.y && pt.y <= a.y + a.height;
        }
        if (a.type === 'draw_circle' && a.radius) {
          const dist = Math.hypot(pt.x - a.x, pt.y - a.y);
          return dist <= a.radius;
        }
        return false;
      });

      if (clicked && clicked.text && onElementClick) {
        onElementClick(clicked.text);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !interactiveMode) return;
    const pt = getCanvasCoordinates(e);
    if (!pt) return;

    currentStrokeRef.current.push(pt);
    // Live preview
    renderCanvas();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderUserStroke(ctx, {
          id: 'temp',
          tool: userTool,
          color: drawColor,
          size: drawSize,
          points: currentStrokeRef.current,
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStrokeRef.current.length > 1) {
      const newStroke: UserDrawingStroke = {
        id: `stroke-${Date.now()}`,
        tool: userTool,
        color: drawColor,
        size: drawSize,
        points: [...currentStrokeRef.current],
      };
      setUserStrokes((prev) => [...prev, newStroke]);
    }
    currentStrokeRef.current = [];
  };

  // Export high-res PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `whiteboard-${currentBeat?.title.replace(/[^a-z0-9]/gi, '_') || 'lesson'}.png`;
    a.click();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] md:h-[500px] rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl flex flex-col bg-slate-950/80 backdrop-blur-md"
    >
      {/* Top Whiteboard Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Whiteboard</span>
          </div>
          <span className="hidden sm:inline text-slate-400 font-medium truncate max-w-[280px]">
            {currentBeat ? `${currentBeat.title}` : 'Welcome to Braynix Tutor'}
          </span>
        </div>

        {/* Mode & Tools Selector */}
        <div className="flex items-center gap-2">
          {interactiveMode ? (
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setUserTool('pen')}
                className={`p-1.5 rounded transition ${userTool === 'pen' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Pen"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setUserTool('highlighter')}
                className={`p-1.5 rounded transition ${userTool === 'highlighter' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Highlighter"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setUserTool('eraser')}
                className={`p-1.5 rounded transition ${userTool === 'eraser' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              {/* Color swatches */}
              <div className="flex items-center gap-1">
                {['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDrawColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-3.5 h-3.5 rounded-full border transition ${drawColor === c ? 'scale-125 border-white shadow' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  />
                ))}
              </div>

              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => setUserStrokes([])}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                title="Clear Learner Strokes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Tutor Synced
              </span>
            </div>
          )}

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, z - 0.15))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[10px] text-slate-400">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px] font-medium"
            title="Download Whiteboard as PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PNG</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative flex-1 w-full h-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Tip overlay when tutor presentation is active */}
        {!interactiveMode && (
          <div className="absolute bottom-3 right-4 pointer-events-none text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800/80 backdrop-blur-sm flex items-center gap-1.5">
            <MousePointer className="w-3 h-3 text-cyan-400" />
            <span>Click any concept card on the board to ask questions about it</span>
          </div>
        )}
      </div>
    </div>
  );
};
