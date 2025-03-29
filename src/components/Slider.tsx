import React, { useState } from "react";

const Slider: React.FC = () => {
  const [dayOffset, setDayOffset] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const getDate = (offset: number) => {
    const today = new Date();
    today.setDate(today.getDate() + offset);
    return today.toLocaleDateString("en-US");
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-black text-white rounded-lg shadow-md w-full max-w-md">
      {/* Day Slider */}
      <div className="w-full">
        <div className="flex justify-between text-sm font-semibold text-center mb-2">
          <span>Previous Days</span>
          <label>Select Day</label>
          <span>Future Days</span>
        </div>
        <input
          type="range"
          min={-7}
          max={7}
          value={dayOffset}
          className="range w-full"
          step={1}
          onChange={(e) => setDayOffset(Number(e.target.value))}
          style={{ accentColor: "#3B82F6" }}
        />
        <div className="flex justify-between text-xs mt-1 w-full">
          {Array.from({ length: 15 }, (_, i) => i - 7).map((offset) => (
            <span
              key={offset}
              className={dayOffset === offset ? "font-bold text-blue-600" : ""}
            >
              {offset === 0 ? "Today" : Math.abs(offset)}
            </span>
          ))}
        </div>
      </div>

      {/* Hour Slider */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-center mb-2">Select Hour</label>
        <input
          type="range"
          min={0}
          max={23}
          value={hour}
          className="range w-full"
          step={1}
          onChange={(e) => setHour(Number(e.target.value))}
          style={{ accentColor: "#3B82F6" }}
        />
        <div className="flex justify-between text-xs mt-1 w-full">
          {Array.from({ length: 7 }, (_, i) => i * 4).map((h) => (
            <span key={h} className="font-bold text-blue-500">
              {h === 24 ? "23" : h}
            </span>
          ))}
        </div>
      </div>

      {/* Minute Slider */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-center mb-2">Select Minute</label>
        <input
          type="range"
          min={0}
          max={59}
          value={minute}
          className="range w-full"
          step={1}
          onChange={(e) => setMinute(Number(e.target.value))}
          style={{ accentColor: "#3B82F6" }}
        />
        <div className="flex justify-between text-xs mt-1 w-full">
          {Array.from({ length: 7 }, (_, i) => i * 10).map((m) => (
            <span key={m} className="font-bold text-blue-400">
              {m === 60 ? "59" : m}
            </span>
          ))}
        </div>
      </div>

      {/* Selected Time Output */}
      <div className="text-lg font-bold bg-blue-600 text-white px-4 py-2 rounded-lg">
        {getDate(dayOffset)} {dayOffset < 0 ? `(-${Math.abs(dayOffset)})` : `(+${dayOffset})`} at {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}
      </div>
    </div>
  );
};

export default Slider;
