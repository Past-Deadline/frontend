import React from 'react';
import NouiSlider  from 'nouislider-react';
import 'nouislider/dist/nouislider.css';

interface VerticalDoubleSliderProps {
  min: number;
  max: number;
  initialValues: [number, number];
  step?: number;
  onChange: (values: [number, number]) => void;
  className?: string;
  height?: number;
}

const VerticalDoubleSlider: React.FC<VerticalDoubleSliderProps> = ({
  min,
  max,
  initialValues,
  step = 1,
  onChange,
  className = '',
  height = 300,
}) => {
  const handleChange = (values: string[]) => {
    const numericValues: [number, number] = [parseFloat(values[0]), parseFloat(values[1])];
    onChange(numericValues);
  };

  return (
    <div className={`vertical-slider-container ${className}`} style={{ height: `${height}px` }}>
      <NouiSlider
        range={{ min, max }}
        start={initialValues}
        step={step}
        orientation="vertical"
        connect
        behaviour="drag"
        tooltips={false}
        onChange={handleChange}
      />
    </div>
  );
};

export default VerticalDoubleSlider;