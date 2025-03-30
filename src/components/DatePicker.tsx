import React, {useState} from "react";

const DatePicker = ({date, setDate}: DatePickerProps) => {
    const [errors, setErrors] = useState<{ start?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate({...date, [e.target.name]: e.target.value});
    };

    return (
        <div className="text-white w-full p-4 bg-black">
            <label className="text-lg font-semibold mb-2">Start Date</label>
            <input
                type="datetime-local"
                name="start"
                value={date.start}
                onChange={handleChange}
                className="input w-full text-lg bg-black"
                required
            />
            {errors.start && (
                <p className="text-red-500 text-sm mb-4">{errors.start}</p>
            )}
        </div>
    );
};

interface DatePickerProps {
    date: {
        start: string;
    };
    setDate: (value: { start: string }) => void;
}

export default DatePicker;