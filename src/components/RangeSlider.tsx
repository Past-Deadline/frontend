import React, { useState } from 'react';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';

export function NoUISliderComponent() {
  const [minValue, setMinValue] = useState('30');

  // This function will handle the slider change
  const displayMin = (event: number[]) => {
    setMinValue(event[0].toString());
  };

  return (
    <div>
      {/* Slider Component */}
      <Nouislider
        range={{ min: 0, max: 100 }}
        start={[30, 80]}
        connect
        onChange={displayMin}
      />
      <center>
        <div style={{ display: 'inline', padding: '2%' }}>
          <h3>Min Value</h3>
          <br />
          <div
            style={{
              background: 'green',
              color: 'white',
              display: 'inline',
              padding: '1%',
            }}
          >
            {minValue}
          </div>
        </div>
      </center>
    </div>
  );
}
