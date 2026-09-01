"use client";

import { useRef, useState, useEffect } from "react";

interface SignaturePadProps {
  onSignatureChange?: (signatureDataUrl: string | null) => void;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Resize canvas to fit container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      // Save current content
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Resize
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight || 200; // default height if 0

      // Restore content
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial resize

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (event as React.MouseEvent).clientX - rect.left,
      y: (event as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (onSignatureChange && canvasRef.current) {
      onSignatureChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
      if (onSignatureChange) {
        onSignatureChange(null);
      }
    }
  };

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden relative touch-none cursor-crosshair focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            <p className="text-gray-400 text-sm font-medium">Signez ici</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          Effacer la signature
        </button>
      </div>
    </div>
  );
}
