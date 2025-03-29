import { useState } from "react";
import PreviewMap from "../components/PreviewMap"
import RangeSlider from "../components/RangeSlider"
import Sliders from "../components/Sliders.tsx"
import {useState} from "react";
import type {FeatureCollection} from "geojson";
import DatePicker from "../components/DatePicker.tsx";

export const PreviewPage = () => {

    const [data, setData] = useState<FeatureCollection | null>(null);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [formData, setFormData] = useState({
        start: new Date().toISOString().slice(0, 16),
    });
    const [minZ, setMinZ] = useState(0);
    const [maxZ, setMaxZ] = useState(100);

    return (
        <PreviewMap data={data} setData={setData}>
            <div className="absolute z-1 top-1/2 left-0 transform -translate-y-1/2 flex flex-col items-center">
                <DatePicker formData={formData} setFormData={setFormData}/>
                <Sliders hour={hour} setHour={setHour} minute={minute} setMinute={setMinute}/>
            </div>
            <RangeSlider min={0} max={100} initialValues={[minZ, maxZ]} onChange={(values) => {
                setMinZ(values[0])
                setMaxZ(values[1])
            }
            }
                         className={"absolute z-1 top-1/2 right-0 transform -translate-y-1/2"}
            />
        </PreviewMap>

    )
}