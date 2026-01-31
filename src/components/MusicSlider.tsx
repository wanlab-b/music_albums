import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface MusicSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const MusicSlider: React.FC<MusicSliderProps> = ({ value, onChange, min = 1, max = 100 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback((clientX: number) => {
    if (sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      const relativeX = clientX - left;
      const percentage = Math.max(0, Math.min(1, relativeX / width));
      const newValue = Math.round(min + percentage * (max - min));
      onChange(newValue);
    }
  }, [min, max, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX);
    }
  }, [isDragging, handleInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full relative py-4" onMouseDown={handleMouseDown} ref={sliderRef} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
        {/* Track */}
        <div className="relative h-1.5 bg-gray-700 rounded-full">
          {/* Filled Track */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Handle */}
        <motion.div
          ref={handleRef}
          className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-primary"
          style={{ 
            left: `calc(${percentage}% - 10px)`,
            y: '-50%'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <div className="text-lg font-bold text-white tabular-nums tracking-wider">
        {value} <span className="text-sm text-gray-400">/ {max}</span>
      </div>
    </div>
  );
};

export default MusicSlider;
