import {useEffect, useMemo, useState} from "react";
import PreviewMap from "../components/PreviewMap"
import VerticalDoubleRange from "../components/RangeSlider"
import Sliders from "../components/Sliders.tsx"
import type {FeatureCollection} from "geojson";
import DatePicker from "../components/DatePicker.tsx";
import {getHeatmap} from "../services/MapService.ts";
import {LngLat} from "mapbox-gl";
import {debounce} from "lodash";
import {HeatmapDto} from "../services/HeatmapDto.ts";

export const PreviewPage = () => {

    const [previousChange, setPreviousChange] = useState<number>(performance.now());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const currentDate = new Date(Date.now());

    const [data, setData] = useState<FeatureCollection | null>(null);
    const [lngLat, setLngLat] = useState<LngLat | null>(new LngLat(0, 0));
    const [hour, setHour] = useState(currentDate.getHours());
    const [minute, setMinute] = useState(currentDate.getMinutes());
    const [calendarData, setCalendarData] = useState({
        start: currentDate.toISOString().slice(0, 16),
    });
    const [minZ, setMinZ] = useState(500);
    const [maxZ, setMaxZ] = useState(2500);

    const debouncedSubmitQuery = useMemo(() =>
        debounce(async () => {
        if (performance.now() - previousChange < 2000) {
            if (!lngLat) return;
            console.log(lngLat);

            const dto: HeatmapDto = {
                "timestamp": `${calendarData.start}:00Z`,
                "minAlt": minZ,
                "maxAlt": maxZ,
            }

            const res = await getHeatmap(dto);
            setData(res);
        } else {
            setPreviousChange(performance.now());
        }
    }, 500), [lngLat, calendarData, minZ, maxZ, previousChange]);

    useEffect(() => {
        if (lngLat) {
            debouncedSubmitQuery();
        }
    }, [lngLat, debouncedSubmitQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const heatmapData = await getHeatmap({
                    "timestamp": "2026-01-01T00:00:00Z",
                    "minAlt": 0,
                    "maxAlt": 2000,
                });
                setData(heatmapData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-black w-full h-full flex justify-center items-center">
            {isLoading ? (
                <div className="bg-black w-1/8">
                    <span className="text-white w-full h-full loading loading-spinner"></span>
                </div>
            ) : (
                <PreviewMap data={data} setData={setData} setLngLat={setLngLat} setIsLoading={setIsLoading}>
                    <div className="absolute z-1 top-1/2 left-0 transform -translate-y-1/2 flex flex-col items-center">
                        <DatePicker formData={calendarData} setFormData={setCalendarData}/>
                        <Sliders hour={hour} setHour={setHour} minute={minute} setMinute={setMinute}/>
                    </div>
                    <VerticalDoubleRange
          min={0}
          max={100}
          initialValues={rangeValues}
          height={400} // колко пиксела висок да е
          onChange={(vals) => setRangeValues(vals)}
        />
                </PreviewMap>
            )}
        </div>
    )
}