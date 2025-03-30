export default function RecommendedRoutes({routes}: { routes: AdequateLaunch[] }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="text-center text-2xl font-bold mb-6">Recommended Routes</div>
            {routes.map((route, index) => {
                return (
                    <div key={index} className="mb-4">
                        <SatelliteCard sat={route.point} />
                    </div>
                );
            })}
        </div>
    );
}

import { FaRocket, FaSatellite, FaGlobe } from "react-icons/fa";
import {AdequateLaunch} from "../services/SchedulerDto.ts";

export const SatelliteCard = ({ sat }: {sat}) => {
    return (
        <div className="card w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-2xl p-6 rounded-xl border border-gray-600">
            <div className="card-body">
                <div className="flex items-center space-x-4 mb-6">
                    <FaSatellite className="text-yellow-400 text-3xl" />
                    <h2 className="card-title text-2xl font-bold">{sat.name} ({sat.altName})</h2>
                </div>
                <p className="text-gray-300 mb-4 italic">{sat.payload}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-semibold text-yellow-300">Launch Date:</span> {sat.launchDate}
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">Owner:</span> {sat.owner}
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">Manufacturer:</span> {sat.manufacturer}
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">Mass:</span> {sat.Mass} kg
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">Shape:</span> {sat.shape}
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">Launch Vehicle:</span> {sat.launchVehicle}
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">Launch Site:</span> {sat.launchSite} ({sat.launchPad})
                    </div>
                    <div>
                        <span className="font-semibold text-yellow-300">RCS:</span> {sat.rcs}
                    </div>
                </div>
                <div className="mt-6 flex space-x-3">
                    <div className="badge badge-outline flex items-center space-x-2 px-3 py-1 border-yellow-400 text-yellow-400">
                        <FaRocket className="text-red-500" />
                        <span className="font-semibold">{sat.status === "+" ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="badge badge-outline flex items-center space-x-2 px-3 py-1 border-green-400 text-green-400">
                        <FaGlobe className="text-green-400" />
                        <span className="font-semibold">{sat.country}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};