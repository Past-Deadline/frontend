import React, {useState} from "react";

const DatePicker = ({formData, setFormData}: DatePickerProps) => {
    const [errors, setErrors] = useState<{ start?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { start?: string } = {};

        if (!formData.start) {
            newErrors.start = "Start date and time are required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log("Form submitted with: ", formData);
            setErrors({});
        }
    };

    return (
        <div className="bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="text-center text-2xl font-bold mb-6">Select specific time</div>
            {/*<form*/}
            {/*    onSubmit={handleSubmit}*/}
            {/*    className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg"*/}
            {/*>*/}
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
            {/*</form>*/}
        </div>
    );
};

interface DatePickerProps {
    formData: {
        start: string;
    };
    setFormData: (value: { start: string }) => void;
}

export default DatePicker;