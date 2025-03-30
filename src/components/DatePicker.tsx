import React, { useState } from "react";

const DatePicker = ({ formData, setFormData }: DatePickerProps) => {
    const [errors, setErrors] = useState<{ start?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Проверка дали е валидна ISO дата
        const isValid = value.length >= 16 && !isNaN(new Date(value).getTime());

        if (!isValid) {
            setErrors({ start: "Invalid date format" });
        } else {
            setFormData({ ...formData, [e.target.name]: value });
            setErrors({});
        }
    };

    return (
        <div className="bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="text-center text-2xl font-bold mb-6">Select specific time</div>
            <label className="block mb-2">Start Date</label>
            <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="input input-bordered w-full mb-2 bg-black"
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
