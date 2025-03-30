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
  const [lowerVal, setLowerVal] = useState<number>(initialValues[0]);
  const [upperVal, setUpperVal] = useState<number>(initialValues[1]);

  // Sync with initialValues when they change from parent
  useEffect(() => {
    setLowerVal(initialValues[0]);
    setUpperVal(initialValues[1]);
  }, [initialValues[0], initialValues[1]]);

  const flipValue = (raw: number) => max - raw;

  const handleLowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const flippedVal = flipValue(raw);
    const newLowerVal = Math.min(flippedVal, upperVal);
    setLowerVal(newLowerVal);
    onChange?.([newLowerVal, upperVal]);
  };

  const handleUpperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const flippedVal = flipValue(raw);
    const newUpperVal = Math.max(flippedVal, lowerVal);
    setUpperVal(newUpperVal);
    onChange?.([lowerVal, newUpperVal]);
  };

  const lowerPercentFromTop = 100 - ((lowerVal - min) / (max - min)) * 100;
  const upperPercentFromTop = 100 - ((upperVal - min) / (max - min)) * 100;
  const fillTop = `${Math.min(lowerPercentFromTop, upperPercentFromTop)}%`;
  const fillHeight = `${Math.abs(upperPercentFromTop - lowerPercentFromTop)}%`;

  return (
    <div
      className="relative"
      style={{
        width: "60px",
        height: `${height}px`,
      }}
    >
      {/* Gray track */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-gray-300 rounded"
        style={{
          width: "6px",
          top: 0,
          bottom: 0,
        }}
      />

      {/* Blue filled range */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-blue-500 rounded"
        style={{
          width: "6px",
          top: fillTop,
          height: fillHeight,
        }}
      />

      {/* Lower handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
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
          transform: "rotate(90deg) translateY(-100%)",
          zIndex: lowerVal > upperVal ? 31 : 30,
        }}
      />

      {/* Upper handle */}
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
