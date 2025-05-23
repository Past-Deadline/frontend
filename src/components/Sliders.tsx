import React from "react";

interface SlidersProps {
    hour: number;
    setHour: (hour: number) => void;
    minute: number;
    setMinute: (minute: number) => void;
}

const Sliders = ({hour, setHour, minute, setMinute}: SlidersProps) => {
    return (
        <div
            className="flex flex-col items-center space-y-4 p-4 bg-black text-white rounded-lg shadow-md w-full">

            <Slider label={"Select Hour"} min={0} max={23} value={hour} step={1} length={5} multiplier={6}
                    onChange={(e) => setHour(Number((e.target as HTMLInputElement).value))}/>

            <Slider label="Select Minute" min={0} max={59} value={minute} step={1} length={7} multiplier={10}
                    onChange={(e: React.ChangeEvent) => setMinute(Number((e.target as HTMLInputElement).value))}/>
        </div>
    );
};

const Slider = ({label, min, max, value, step, length, multiplier, onChange}: SliderProps) => {
    return (
        <div className="w-full">
            <label className="text-lg font-semibold text-center mb-2">{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                className="range w-full accent-[#3B82F6]"
                step={step}
                onChange={onChange}
            />
            <div className="flex justify-between text-xs mt-1 w-full">
                {Array.from({length: length}, (_, i) => i * multiplier).map((m) => (
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
    length: number;
    multiplier: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default Sliders;
