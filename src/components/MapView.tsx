import { useEffect, useRef, useState } from 'react';
import { Route, Van } from '../mockData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Navigation, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MapViewProps {
  route?: Route;
  vans?: Van[];
  className?: string;
}

export function MapView({ route, vans = [], className = '' }: MapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid background (Google Maps style)
    drawGrid(ctx, width, height);

    // Draw route if provided
    if (route && route.waypoints.length > 0) {
      drawRoute(ctx, route, width, height);
    }

    // Draw vans if provided
    if (vans.length > 0) {
      drawVans(ctx, vans, width, height);
    }

    ctx.restore();
  }, [route, vans, zoom, pan]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-width, -height, width * 3, height * 3);

    // Grid lines
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;

    const gridSize = 50;
    for (let x = -width; x < width * 2; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -height);
      ctx.lineTo(x, height * 2);
      ctx.stroke();
    }

    for (let y = -height; y < height * 2; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-width, y);
      ctx.lineTo(width * 2, y);
      ctx.stroke();
    }

    // Main roads (thicker lines)
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 2;

    for (let x = -width; x < width * 2; x += gridSize * 3) {
      ctx.beginPath();
      ctx.moveTo(x, -height);
      ctx.lineTo(x, height * 2);
      ctx.stroke();
    }

    for (let y = -height; y < height * 2; y += gridSize * 3) {
      ctx.beginPath();
      ctx.moveTo(-width, y);
      ctx.lineTo(width * 2, y);
      ctx.stroke();
    }
  };

  const drawRoute = (ctx: CanvasRenderingContext2D, route: Route, width: number, height: number) => {
    const waypoints = route.waypoints;
    const padding = 80;
    
    // Calculate bounds
    const lats = waypoints.map(w => w.lat);
    const lngs = waypoints.map(w => w.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Convert lat/lng to canvas coordinates
    const toCanvasX = (lng: number) => {
      return padding + ((lng - minLng) / (maxLng - minLng)) * (width - padding * 2);
    };

    const toCanvasY = (lat: number) => {
      return padding + ((maxLat - lat) / (maxLat - minLat)) * (height - padding * 2);
    };

    // Draw route line
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    waypoints.forEach((waypoint, index) => {
      const x = toCanvasX(waypoint.lng);
      const y = toCanvasY(waypoint.lat);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw waypoint markers
    waypoints.forEach((waypoint, index) => {
      const x = toCanvasX(waypoint.lng);
      const y = toCanvasY(waypoint.lat);

      // Marker circle
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      
      if (index === 0) {
        ctx.fillStyle = '#22c55e'; // Green for start
      } else if (index === waypoints.length - 1) {
        ctx.fillStyle = '#ef4444'; // Red for end
      } else {
        ctx.fillStyle = '#4a9eff'; // Blue for waypoints
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(waypoint.name, x, y + 25);
    });
  };

  const drawVans = (ctx: CanvasRenderingContext2D, vans: Van[], width: number, height: number) => {
    vans.forEach((van, index) => {
      if (!van.currentLocation) return;

      // Distribute vans across the map if no specific location
      const x = width / 2 + (index - vans.length / 2) * 100;
      const y = height / 2;

      // Van marker (bus icon representation)
      ctx.fillStyle = van.status === 'available' ? '#22c55e' : van.status === 'in-use' ? '#eab308' : '#ef4444';
      
      // Draw rounded rectangle for van
      const vanWidth = 30;
      const vanHeight = 20;
      ctx.beginPath();
      ctx.roundRect(x - vanWidth/2, y - vanHeight/2, vanWidth, vanHeight, 4);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Van label
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(van.plate, x, y + 20);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg border border-border cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="shadow-lg"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="shadow-lg"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReset}
          className="shadow-lg"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      {(route || vans.length > 0) && (
        <Card className="absolute bottom-4 left-4 p-3 space-y-2 shadow-lg">
          {route && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Origem</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Paradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Destino</span>
              </div>
            </div>
          )}

          {vans.length > 0 && (
            <>
              {route && <div className="h-px bg-border my-2" />}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-muted-foreground">Van disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span className="text-muted-foreground">Van em uso</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-muted-foreground">Van em manutenção</span>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Instructions */}
      <Badge variant="secondary" className="absolute top-4 left-4 shadow-lg">
        <Navigation className="w-3 h-3 mr-1" />
        Arraste para mover o mapa
      </Badge>
    </div>
  );
}
