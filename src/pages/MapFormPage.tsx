import { useState } from "react";
import SchedulerForm from "../components/Form";
import SchedulerMap from "../components/SchedulerMap";
import RecommendedRoutes from "../components/RecommendedRoutes";

export const MapFormPage = () => {
    const [showForm, setShowForm] = useState(true);
    const [animateOut, setAnimateOut] = useState(false);
    const [showRoutes, setShowRoutes] = useState(false);

    const handleFormSubmit = () => {
        setAnimateOut(true); // Start fade-out animation
        setTimeout(() => {
            setShowForm(false);
            setShowRoutes(true);
        }, 500); // Wait for animation to finish before switching components
    };

    const tle: [string, string] = [
        '1 25544U 98067A   24089.51234567  .00016717  00000+0  10270-3 0  9025',
        '2 25544  51.6451 133.5943 0006706  33.2451 326.9020 15.49472719396903'
    ];

    const eciTestData: [number, number, number][] = [
        [2543.6, -3792.8, 5563.3]
    ];

    return (
        <div className="relative h-screen flex">
            {/* Map Container: 2/3 of the screen width */}
            <div className="w-2/3 h-full">
                <SchedulerMap tle={tle} crossingCoordinates={eciTestData} />
            </div>

            {/* Form or Recommended Routes Container */}
            <div className="w-1/3 h-full relative">
                {showForm && (
                    <div
                        className={`absolute w-full h-full transition-opacity duration-500 ease-in-out bg-white shadow-lg ${animateOut ? "opacity-0" : "opacity-100"}`}
                    >
                        <SchedulerForm onSubmitSuccess={handleFormSubmit} />
                    </div>
                )}
                {showRoutes && (
                    <div className="absolute w-full h-full transition-opacity duration-500 ease-in-out opacity-100 bg-white shadow-lg">
                        <RecommendedRoutes />
                    </div>
                )}
            </div>
        </div>
    );
};
