import React, { useRef, useState, useEffect } from "react";

interface ScaledCardWrapperProps {
  targetWidth: number;
  targetHeight: number;
  children: React.ReactNode;
  className?: string;
  maxWidth?: number;
}

/**
 * ScaledCardWrapper: Dynamically scales a fixed-dimension template (e.g. 856×540, 1080×1350)
 * to fit 100% of its responsive parent container without any clipping, overflow, or cropping.
 */
export function ScaledCardWrapper({
  targetWidth,
  targetHeight,
  children,
  className = "",
  maxWidth,
}: ScaledCardWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const currentWidth = containerRef.current.clientWidth;
      if (currentWidth > 0) {
        const newScale = currentWidth / targetWidth;
        setScale(newScale);
        setIsReady(true);
      }
    };

    updateSize();

    const ro = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    return () => ro.disconnect();
  }, [targetWidth]);

  // Compute scaled height so container matches the visual card bounds with 0px overflow
  const height = isReady ? targetHeight * scale : (targetHeight / targetWidth) * (maxWidth || 500);

  return (
    <div
      ref={containerRef}
      className={`w-full relative overflow-hidden select-none transition-opacity duration-200 ${
        isReady ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        height: `${height}px`,
      }}
    >
      <div
        style={{
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

