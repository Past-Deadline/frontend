import {useEffect, useMemo, useState} from "react";
import PreviewMap from "../components/PreviewMap"
import RangeSlider from "../components/RangeSlider"
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

    function addParamsToUrl(dto: HeatmapDto) {
        const url = new URL(window.location.href);
        url.searchParams.set("minLat", dto.minLat.toString());
        url.searchParams.set("maxLat", dto.maxLat.toString());
        url.searchParams.set("minLon", dto.minLon.toString());
        url.searchParams.set("maxLon", dto.maxLon.toString());
        url.searchParams.set("timestamp", dto.timestamp);
        url.searchParams.set("minAlt", dto.minAlt.toString());
        url.searchParams.set("maxAlt", dto.maxAlt.toString());
        url.search = url.searchParams.toString();
        window.history.pushState({}, "", url);
    }

    const debouncedSubmitQuery = useMemo(() =>
        debounce(async () => {

            if (performance.now() - previousChange < 2000) {
            if (!lngLat) return;
            console.log(lngLat);

            const dto: HeatmapDto = {
                "minLat": lngLat.lat - 10,
                "maxLat": lngLat.lat + 10,
                "minLon": lngLat.lng - 10,
                "maxLon": lngLat.lng + 10,
                "timestamp": `${calendarData.start}:00Z`,
                "minAlt": minZ,
                "maxAlt": maxZ,
            }

            const res = await getHeatmap(dto);

            addParamsToUrl(dto);

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
                    "minLat": -10,
                    "maxLat": 10,
                    "minLon": -20,
                    "maxLon": 20,
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
                    <div className="absolute z-1 top-1/2 left-0 transform -translate-y-1/2 flex flex-col space-y-4 p-4 bg-black text-white rounded-lg shadow-md">
                        <span className="text-center text-2xl font-bold mb-6">Select specific time</span>
                        <DatePicker date={calendarData} setDate={setCalendarData}/>
                        <Sliders hour={hour} setHour={setHour} minute={minute} setMinute={setMinute}/>
                    </div>
                    <RangeSlider min={500} max={2500} height={500} initialValues={[minZ, maxZ]} onChange={(values) => {
                        setMinZ(values[0])
                        setMaxZ(values[1])
                    }
                    }
                                 className={"absolute z-1 top-1/2 right-0 transform -translate-y-1/2"}
                    />
                </PreviewMap>
            )}
        </div>
    )
}