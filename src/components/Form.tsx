import { useState } from 'react';
import { formatISO, addDays, addMonths, isBefore, isAfter } from 'date-fns';
import toast from 'react-hot-toast';

export default function SpaceForm() {
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        orbit: 'LEO',
        latitude: '',
        longitude: ''
    });

    const [errors, setErrors] = useState({ start: '', end: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentDate = new Date();
        const startDate = new Date(formData.start);
        const endDate = new Date(formData.end);

        let newErrors = { start: '', end: '' };

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
            "time_frame": {
                "start": formData.start,
                "end": formData.end
            },
            "orbit": formData.orbit,
            "point_of_interest": {
                "latitude": formData.latitude,
                "longitude": formData.longitude
            }
        }
        

        console.log('Form submitted:', JSON.stringify(data));
        // const postFormData = async (data: any) => {
        //     try {
        //         const response = await fetch('https://example.com/api/schedule', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: data
        //             });
                
        
        //         if (!response.ok) {
        //             const errorData = await response.json();
        //             toast.error(`Error: ${errorData.message || 'Failed to submit data'}`);
        //         } else {
        //             const result = await response.json();
        //             console.log('Success:', result);
        //         }
        //     } catch (error) {
        //         console.error('Network error:', error);
        //     }
        // };
        
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

                <label className="block mb-2">Latitude</label>
                <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-4"
                    placeholder="38.868222"
                    required
                />

                <label className="block mb-2">Longitude</label>
                <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-4"
                    placeholder="111.58024"
                    required
                />

                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </div>
    );
}
