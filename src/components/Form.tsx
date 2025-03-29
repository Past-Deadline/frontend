import { useState } from 'react';
import { addDays, addMonths, isBefore, isAfter } from 'date-fns';
import { postFormData } from '../services/SchedulerService';

export default function SchedulerForm() {
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        orbit: 'LEO',
        tle1: '',
        tle2: ''
    });

    const [errors, setErrors] = useState({ start: '', end: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentDate = new Date();
        const startDate = new Date(formData.start);
        const endDate = new Date(formData.end);

        const newErrors = { start: '', end: '' };

        if (isBefore(startDate, addDays(currentDate, 3))) {
            newErrors.start = 'Start date must be at least 3 days from today.';
        }
        if (isAfter(endDate, addMonths(currentDate, 6))) {
            newErrors.end = 'End date must be within 6 months from today.';
        }
        if (isBefore(endDate, startDate)) {
            newErrors.end = 'End date must be later than the start date.';
        }

        if (newErrors.start || newErrors.end) {
            setErrors(newErrors);
            return;
        }

        const data = {
            time_frame: {
                start: formData.start,
                end: formData.end
            },
            orbit: formData.orbit,
            point_of_interest: {
                tle1: formData.tle1,
                tle2: formData.tle2
            }
        };

        postFormData(data);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="text-center text-2xl font-bold mb-6">Lunch Scheduler</div>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg">
                <label className="block mb-2">Start Date</label>
                <input
                    type="datetime-local"
                    name="start"
                    value={formData.start}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2"
                    required
                />
                {errors.start && <p className="text-red-500 text-sm mb-4">{errors.start}</p>}

                <label className="block mb-2">End Date</label>
                <input
                    type="datetime-local"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2"
                    required
                />
                {errors.end && <p className="text-red-500 text-sm mb-4">{errors.end}</p>}

                <label className="block mb-2">Orbit</label>
                <select
                    name="orbit"
                    value={formData.orbit}
                    onChange={handleChange}
                    className="select select-bordered w-full mb-4"
                >
                    <option value="LEO">LEO</option>
                    <option value="MEO" disabled>MEO</option>
                    <option value="EGO" disabled>EGO</option>
                </select>

                <label className="block mb-2">TLE 1</label>
                <textarea
                    name="tle1"
                    value={formData.tle1}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full mb-4"
                    placeholder="Enter TLE 1"
                    required
                ></textarea>

                <label className="block mb-2">TLE 2</label>
                <textarea
                    name="tle2"
                    value={formData.tle2}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full mb-4"
                    placeholder="Enter TLE 2"
                    required
                ></textarea>

                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </div>
    );
}
