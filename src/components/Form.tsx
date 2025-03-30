import { useState } from 'react';
import { addDays, addMonths, isBefore, isAfter } from 'date-fns';

export default function SchedulerForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
    const [formData, setFormData] = useState<{ 
        start: string;
        end: string;
        orbit: string;
        point1: { x: string; y: string; z: string };
        point2: { x: string; y: string; z: string };
    }>({
        start: '',
        end: '',
        orbit: 'LEO',
        point1: { x: '', y: '', z: '' },
        point2: { x: '', y: '', z: '' }
    });

    const [errors, setErrors] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('point1') || name.startsWith('point2')) {
            const [point, axis] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [point]: { ...prev[point as 'point1' | 'point2'], [axis]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setErrors(prev => ({ ...prev, [name]: '' }));
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
            console.log(formData);
            onSubmitSuccess();
            
       // postFormData(formData);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="text-center text-2xl font-bold mb-6">Launch Scheduler</div>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                <label className="block">Start Date</label>
                <input type="datetime-local" name="start" value={formData.start} onChange={handleChange} className="input input-bordered w-full text-black" required />
                {errors.start && <p className="text-red-500 text-sm">{errors.start}</p>}

                <label className="block">End Date</label>
                <input type="datetime-local" name="end" value={formData.end} onChange={handleChange} className="input input-bordered w-full text-black" required />
                {errors.end && <p className="text-red-500 text-sm">{errors.end}</p>}

                <label className="block">Orbit</label>
                <select name="orbit" value={formData.orbit} onChange={handleChange} className="select select-bordered w-full text-black">
                    <option value="LEO">LEO</option>
                    <option value="MEO" disabled>MEO</option>
                    <option value="EGO" disabled>EGO</option>
                </select>

                <div className="flex items-center gap-2">
                    <label className="block">Points of Orbit</label>
                    <span className="text-gray-400 text-sm">(ECI)</span>
                </div>

                {["point1"].map((point, index) => (
                    <div key={point} className="mb-4">
                        <label className="block font-bold">Point {index + 1}</label>
                        <div className="flex gap-4">
                            {['x', 'y', 'z'].map(axis => (
                                <div key={axis} className="flex items-center gap-2">
                                    <label className="text-sm font-medium">{axis.toUpperCase()}:</label>
                                    <input type="number" name={`${point}.${axis}`} value={formData[point as 'point1' | 'point2'][axis as 'x' | 'y' | 'z']} onChange={handleChange} className="input text-black input-bordered w-20" required />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </div>
    );
}