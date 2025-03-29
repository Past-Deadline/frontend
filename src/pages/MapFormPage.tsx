import { useState } from "react";
import SchedulerForm from "../components/Form";

export const MapFormPage = () => {
    const [showForm, setShowForm] = useState(true);
    const [animateOut, setAnimateOut] = useState(false);

    const handleFormSubmit = () => {
        setAnimateOut(true); // Start animation
        setTimeout(() => setShowForm(false), 500); // Remove after animation ends
    };

    return (
        <div className="flex h-screen">
            <div className="flex-1"></div>

            {/* Keeps the width intact */}
            <div className="w-1/3 relative overflow-hidden">
                {showForm && (
                    <div
                        className={`w-full transition-transform duration-500 ease-in-out ${
                            animateOut ? "-translate-x-full" : "translate-x-0"
                        }`}
                    >
                        <SchedulerForm onSubmitSuccess={handleFormSubmit} />
                    </div>
                )}
            </div>
        </div>
    );
};
