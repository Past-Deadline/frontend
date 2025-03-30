import React, { useState, useEffect } from "react";

interface VerticalDoubleRangeProps {
  min: number;
  max: number;
  initialValues?: [number, number];
  onChange?: (values: [number, number]) => void;
  height?: number; // height of the slider track in pixels
  className?: string;
}

const VerticalDoubleRangeFlip: React.FC<VerticalDoubleRangeProps> = ({
  min,
  max,
  initialValues = [20, 80],
  onChange,
  height = 300,
  className = "",
}) => {
  const [lowerVal, setLowerVal] = useState(initialValues[0]);
  const [upperVal, setUpperVal] = useState(initialValues[1]);

  useEffect(() => {
    onChange?.([lowerVal, upperVal]);
  }, [lowerVal, upperVal, onChange]);

  // Because our input’s raw value is inverted (due to rotation),
  // we “flip” it so that a larger logical value appears higher.
  const flipValue = (raw: number) => max - raw;

  const handleLowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const flipped = flipValue(raw);
    if (flipped <= upperVal) setLowerVal(flipped);
    else setLowerVal(upperVal);
  };

  const handleUpperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const flipped = flipValue(raw);
    if (flipped >= lowerVal) setUpperVal(flipped);
    else setUpperVal(lowerVal);
  };

  // Map a logical slider value (min → max) to a pixel offset along the track.
  // When val === max, the position is 0 (top); when val === min, it is "height" (bottom).
  const getPixelPosition = (val: number) =>
    ((max - val) / (max - min)) * height;

  // In our testing the native thumb is rendered with its center offset ~8px from the top of the track.
  // Adjust this value if your thumb size is different.
  const thumbCenterOffset = 8;

  // Compute the pixel positions of the two thumbs (as measured from the container’s top).
  const posUpper = getPixelPosition(upperVal) + thumbCenterOffset;
  const posLower = getPixelPosition(lowerVal) + thumbCenterOffset;

  // The fill should start at the center of the upper thumb and extend down to the center of the lower thumb.
  const fillTop = posUpper;
  const fillHeight = posLower - posUpper;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "60px", height: `${height}px` }}
    >
      {/* Gray track – spans the full container height */}
      <div
        className="absolute bg-gray-300 rounded"
        style={{
          width: "6px",
          height: "100%",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      />

      {/* Blue fill drawn from the center of the upper thumb to the center of the lower thumb */}
      <div
        className="absolute bg-blue-500 rounded"
        style={{
          width: "6px",
          top: `${fillTop}px`,
          height: `${fillHeight}px`,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      />

      {/* Lower thumb – rotated 90°; note the removal of translateY(-100%) */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={max - lowerVal}
        onChange={handleLowerChange}
        className="range-thumb absolute pointer-events-none [--range-bg:transparent] [--range-fill:transparent] [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-ms-thumb]:pointer-events-auto"
        style={{
          top: 0,
          left: 0,
          width: `${height}px`,
          height: "60px",
          transformOrigin: "top left",
          transform: "rotate(90deg)",
          zIndex: 3,
        }}
      />

      {/* Upper thumb – rotated 90° */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={max - upperVal}
        onChange={handleUpperChange}
        className="range-thumb absolute pointer-events-none [--range-bg:transparent] [--range-fill:transparent] [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-ms-thumb]:pointer-events-auto"
        style={{
          top: 0,
          left: 0,
          width: `${height}px`,
          height: "60px",
          transformOrigin: "top left",
          transform: "rotate(90deg)",
          zIndex: 4,
        }}
      />
    </div>
  );
};

export default VerticalDoubleRangeFlip;
