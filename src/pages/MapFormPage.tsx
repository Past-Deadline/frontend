import { useState } from "react";
import SchedulerForm from "../components/Form";
import SchedulerMap from "../components/SchedulerMap";

export const MapFormPage = () => {
    const [showForm, setShowForm] = useState(true);
    const [animateOut, setAnimateOut] = useState(false);

    const handleFormSubmit = () => {
        setAnimateOut(true); // Start animation
        setTimeout(() => setShowForm(false), 500); // Remove after animation ends
    };
    const tle: [string, string] = [
        '1 25544U 98067A   24089.51234567  .00016717  00000+0  10270-3 0  9025',
        '2 25544  51.6451 133.5943 0006706  33.2451 326.9020 15.49472719396903'
      ];
      
      // Example crossing points (latitude, longitude)
      const eciTestData: [number, number, number][] = [
       [2543.6, -3792.8, 5563.3]
      ];
      
      
      
    return (
        <div className="relative h-screen">
            {/* Map Container: Always 100% width */}
            <div className="w-full h-full">
            <SchedulerMap tle={tle} crossingCoordinates={eciTestData} />
  

            </div>

            {/* Form Container: Positioned absolutely on the right */}
            <div
                className={`transition-all duration-500 ease-in-out absolute ${
                    animateOut ? "opacity-0" : "opacity-100"
                } ${showForm ? "block" : "hidden"}`}
                style={{
                    top: "50%",
                    right: "0", // Move form to the right
                    transform: "translateY(-50%)", // Only vertically center
                }}
            >
                {showForm && (
                    <SchedulerForm onSubmitSuccess={handleFormSubmit} />
                )}
            </div>
        </div>
    );
};
