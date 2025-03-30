import React from "react";

/** The allowed satellite types */
type SatelliteType = 1 | 2 | 3 | "undefined";

interface CheckboxProps {
  /** Array of currently selected satellite types */
  selectedTypes: SatelliteType[];
  /** Called when user toggles any checkbox */
  onChange: (types: SatelliteType[]) => void;
}

/**
 * Renders 4 checkboxes for satellite-type filtering:
 * 1 = Active Satellites
 * 2 = Rocket Bodies (R/B)
 * 3 = Space Debris (DEB)
 * "undefined" = Unclassified Objects
 */
export default function Checkbox({ selectedTypes, onChange }: CheckboxProps) {
  // If a type is already selected, remove it from the array; otherwise add it.
  const toggleType = (t: SatelliteType) => {
    if (selectedTypes.includes(t)) {
      onChange(selectedTypes.filter((item) => item !== t));
    } else {
      onChange([...selectedTypes, t]);
    }
  };

  // The data describing each checkbox
  const typeOptions = [
    { value: 1 as SatelliteType, label: "Active Satellites" },
    { value: 2 as SatelliteType, label: "Rocket Bodies (R/B)" },
    { value: 3 as SatelliteType, label: "Space Debris (DEB)" },
    { value: "undefined" as SatelliteType, label: "Unclassified Objects" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#2e2e2e",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "fit-content",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
        Satellite Type Filter
      </div>
      {typeOptions.map(({ value, label }) => (
        <label
          key={String(value)}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            cursor: "pointer",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            checked={selectedTypes.includes(value)}
            onChange={() => toggleType(value)}
            style={{
              accentColor: "#4CAF50",
              width: "18px",
              height: "18px",
              cursor: "pointer",
            }}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
