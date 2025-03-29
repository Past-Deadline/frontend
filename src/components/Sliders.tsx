import React from "react";

interface SlidersProps {
    hour: number;
    setHour: (hour: number) => void;
    minute: number;
    setMinute: (minute: number) => void;
}

const Sliders = ({hour, setHour, minute, setMinute}: SlidersProps) => {

    // const getDate = (offset: number) => {
    //   const today = new Date();
    //   today.setDate(today.getDate() + offset);
    //   return today.toLocaleDateString("en-US");
    // };

    return (
        <div
            className="flex flex-col items-center space-y-4 p-4 bg-black text-white rounded-lg shadow-md w-full max-w-md">

            {/* Hour Slider */}
            <Slider label={"Select Hour"} min={0} max={23} value={hour} step={1}
                    onChange={(e) => setHour(Number((e.target as HTMLInputElement).value))}/>

            {/* Minute Slider */}
            <Slider label="Select Minute" min={0} max={59} value={minute} step={1}
                    onChange={(e: React.ChangeEvent) => setMinute(Number((e.target as HTMLInputElement).value))}/>

            {/* Selected Time Output */}
            {/*<div className="text-lg font-bold bg-blue-600 text-white px-4 py-2 rounded-lg">*/}
            {/*  {getDate(dayOffset)} at {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}*/}
            {/*</div>*/}
        </div>
    );
};

const Slider = ({label, min, max, value, step, onChange}: SliderProps) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-center mb-2">{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                className="range w-full"
                step={step}
                onChange={onChange}
                style={{accentColor: "#3B82F6"}}
            />
            <div className="flex justify-between text-xs mt-1 w-full">
                {Array.from({length: 7}, (_, i) => i * 10).map((m) => (
                    <span key={m} className="font-bold text-blue-400">
              {m === max + 1 ? max : m}
            </span>
                ))}
            </div>
        </div>
    )
}

interface SliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    step: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default Sliders;
