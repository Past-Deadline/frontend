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
  // Logical slider values (bigger = visually higher)
  const [lowerVal, setLowerVal] = useState(initialValues[0]);
  const [upperVal, setUpperVal] = useState(initialValues[1]);

  useEffect(() => {
    onChange?.([lowerVal, upperVal]);
  }, [lowerVal, upperVal, onChange]);

  // We flip the raw input value so that a physically higher thumb corresponds to a larger value.
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

  // The original code computed a fill using "bottom" based on percentages.
  // After rotation the coordinate system is flipped, so we instead compute:
  // For a logical value, compute its percent from the top.
  // When val === max, it should be at 0% from the top; when val === min, at 100%.
  const lowerPercentFromTop = 100 - ((lowerVal - min) / (max - min)) * 100;
  const upperPercentFromTop = 100 - ((upperVal - min) / (max - min)) * 100;
  const fillTop = `${Math.min(lowerPercentFromTop, upperPercentFromTop)}%`;
  const fillHeight = `${Math.abs(upperPercentFromTop - lowerPercentFromTop)}%`;

  return (
    <div
      className="relative"
      style={{
        width: "60px", // thickness of the visible track
        height: `${height}px`, // actual height of the slider
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

      {/* (2) Blue fill between thumbs – positioned from the top */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-blue-500 rounded"
        style={{
          width: "6px",
          top: fillTop,
          height: fillHeight,
        }}
      />

      {/* (3) Lower handle (rotated 90°) */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        // Store as "raw = max - lowerVal" so that physically up => bigger value
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
          // rotate to make the slider vertical (and offset to align properly)
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
