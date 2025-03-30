import { useState } from 'react';

const Checkbox = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#2e2e2e',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'flex',
        gap: '20px',
        width:'fit-content'
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={checked1}
          onChange={() => setChecked1(!checked1)}
          style={{
            accentColor: '#4CAF50',
            marginRight: '8px',
            width: '18px',
            height: '18px',
            cursor: 'pointer',
          }}
        />
        Debris
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={checked2}
          onChange={() => setChecked2(!checked2)}
          style={{
            marginRight: '8px',
            width: '18px',
            height: '18px',
            cursor: 'pointer',
          }}
        />
        Satelite
      </label>
    </div>
  );
};

export default Checkbox;
