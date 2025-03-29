import React, { useState, useEffect } from "react";

interface VerticalDoubleRangeProps {
  min: number;
  max: number;
  initialValues?: [number, number];
  onChange?: (values: [number, number]) => void;
  height?: number; // px - how tall the slider is
}

const VerticalDoubleRangeFlip: React.FC<VerticalDoubleRangeProps> = ({
  min,
  max,
  initialValues = [20, 80],
  onChange,
  height = 300,
}) => {
  // Keep them as "logical" slider values (where bigger = physically higher).
  // We'll flip the raw input's value in the event handlers so it lines up.
  const [lowerVal, setLowerVal] = useState(initialValues[0]);
  const [upperVal, setUpperVal] = useState(initialValues[1]);

  useEffect(() => {
    onChange?.([lowerVal, upperVal]);
  }, [lowerVal, upperVal, onChange]);

  // Flip the raw input so physically up => bigger numeric.
  const flipValue = (raw: number) => max - raw;

  const handleLowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const flippedVal = flipValue(raw);
    if (flippedVal <= upperVal) {
      setLowerVal(flippedVal);
    } else {
      setLowerVal(upperVal);
    }
  };

  const handleUpperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const flippedVal = flipValue(raw);
    if (flippedVal >= lowerVal) {
      setUpperVal(flippedVal);
    } else {
      setUpperVal(lowerVal);
    }
  };

  // Now, because bigger numeric is physically higher,
  // we can do normal bottom->top fill.
  const lowerPercent = ((lowerVal - min) / (max - min)) * 100;
  const upperPercent = ((upperVal - min) / (max - min)) * 100;
  const fillBottom = `${Math.min(lowerPercent, upperPercent)}%`;
  const fillHeight = `${Math.abs(upperPercent - lowerPercent)}%`;

  return (
    <div
      className="relative"
      style={{
        width: "60px",         // thickness of the visible track
        height: `${height}px`  // actual height of the slider
      }}
    >
      {/* (1) Gray track (full height) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-gray-300 rounded"
        style={{
          width: "6px",
          top: 0,
          bottom: 0,
        }}
      />

      {/* (2) Blue fill (bottom -> up) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-blue-500 rounded"
        style={{
          width: "6px",
          bottom: fillBottom,
          height: fillHeight,
        }}
      />

      {/* (3) Lower handle (rotated 90°) */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        // But store as "raw = max - lowerVal" so physically up => bigger "lowerVal"
        value={max - lowerVal}
        onChange={handleLowerChange}
        className={`
          range range-primary
          absolute
          pointer-events-none
          [--range-bg:transparent]
          [--range-fill:transparent]
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-ms-thumb]:pointer-events-auto
        `}
        style={{
          top: 0,
          left: 0,
          width: `${height}px`,
          height: "60px",
          transformOrigin: "top left",
          // rotate 90deg to make the slider vertical
          // (optionally offset with translateY to align the extremes)
          transform: "rotate(90deg) translateY(-100%)",
          zIndex: lowerVal > upperVal ? 31 : 30,
        }}
      />

      {/* (4) Upper handle (rotated 90°) */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={max - upperVal}
        onChange={handleUpperChange}
        className={`
          range range-primary
          absolute
          pointer-events-none
          [--range-bg:transparent]
          [--range-fill:transparent]
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-ms-thumb]:pointer-events-auto
        `}
        style={{
          top: 0,
          left: 0,
          width: `${height}px`,
          height: "60px",
          transformOrigin: "top left",
          transform: "rotate(90deg) translateY(-100%)",
          zIndex: 30,
        }}
      />
    </div>
  );
};

export default VerticalDoubleRangeFlip;
