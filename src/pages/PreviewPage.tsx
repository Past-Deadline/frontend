import { useEffect, useMemo, useState } from "react";
import PreviewMap from "../components/PreviewMap";
import VerticalDoubleRange from "../components/RangeSlider";
import Sliders from "../components/Sliders.tsx";
import type { FeatureCollection } from "geojson";
import DatePicker from "../components/DatePicker.tsx";
import { getHeatmap } from "../services/MapService.ts";
import { LngLat } from "mapbox-gl";
import { debounce } from "lodash";
import { HeatmapDto } from "../services/HeatmapDto.ts";

export const PreviewPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get current date/time as defaults
  const currentDate = new Date();

  // GeoJSON data returned from the server
  const [data, setData] = useState<FeatureCollection | null>(null);

  // Map center from Mapbox
  const [lngLat, setLngLat] = useState<LngLat | null>(new LngLat(0, 0));

  // DatePicker form data (string "YYYY-MM-DDTHH:mm")
  const [calendarData, setCalendarData] = useState({
    start: currentDate.toISOString().slice(0, 16),
  });

  // Sliders for hour/minute
  const [hour, setHour] = useState(currentDate.getHours());
  const [minute, setMinute] = useState(currentDate.getMinutes());

  // Vertical double-range for altitude selection (UI 0..100)
  const [rangeValues, setRangeValues] = useState<[number, number]>([20, 80]);

  // Actual alt in "real" units (e.g. 500..2500)
  const [minZ, setMinZ] = useState(500);
  const [maxZ, setMaxZ] = useState(2500);

  /**
   * Map 0..100 => 500..2500 for altitude
   */
  useEffect(() => {
    const [low, high] = rangeValues;
    const minAltitude = 500;
    const maxAltitude = 2500;

    const scale = (val: number) =>
      minAltitude + (val / 100) * (maxAltitude - minAltitude);

    setMinZ(scale(low));
    setMaxZ(scale(high));
  }, [rangeValues]);

  /**
   * Debounced function that calls getHeatmap() 
   * WITHOUT showing the spinner on subsequent loads.
   */
  const debouncedGetHeatmap = useMemo(
    () =>
      debounce(async (isoTimestamp: string, lowAlt: number, highAlt: number) => {
        if (!lngLat) return; // Only call if we have a valid map center

        try {
          // Don't set isLoading = true; user wants no spinner on subsequent loads

          const dto: HeatmapDto = {
            timestamp: isoTimestamp,
            minAlt: lowAlt,
            maxAlt: highAlt,
          };

          const res = await getHeatmap(dto);
          setData(res);
        } catch (err) {
          console.error(err);
        }
      }, 2000),
    [lngLat]
  );

  /**
   * Whenever user changes date/hours/min/alt-range or the map center,
   * trigger the debounced heatmap fetch.
   */
  useEffect(() => {
    if (!lngLat) return;

    // Convert the date + hour/minute => final ISO
    const d = new Date(calendarData.start);
    d.setHours(hour);
    d.setMinutes(minute);

    debouncedGetHeatmap(d.toISOString(), minZ, maxZ);

    return () => {
      debouncedGetHeatmap.cancel();
    };
  }, [lngLat, calendarData.start, hour, minute, minZ, maxZ, debouncedGetHeatmap]);

  /**
   * Fetch an initial heatmap once on mount (with spinner).
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const heatmapData = await getHeatmap({
          timestamp: "2026-01-01T00:00:00Z",
          minAlt: 0,
          maxAlt: 2000,
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
        <PreviewMap
          data={data}
          setData={setData}
          setLngLat={setLngLat}
          setIsLoading={setIsLoading}
        >
          {/* Left-side controls (Date + time sliders) */}
          <div className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 flex flex-col items-center space-y-4">
            <DatePicker formData={calendarData} setFormData={setCalendarData} />
            <Sliders
              hour={hour}
              setHour={setHour}
              minute={minute}
              setMinute={setMinute}
            />
          </div>

          {/* Right-side altitude slider + label */}
          <div className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2 pt-4">

            <VerticalDoubleRange
              min={0}
              max={100}
              initialValues={rangeValues}
              height={400}
              onChange={(vals) => setRangeValues(vals)}
            />
            <div className="flex flex-col items-center text-white">
              <span className="text-sm">Altitude Range</span>
              <span className="text-sm">
                {minZ.toFixed(0)} - {maxZ.toFixed(0)} m
              </span>
              <div className="w-4 h-20 bg-gradient-to-t from-green-500 to-red-500 mt-2" />
            </div>
          </div>
        </PreviewMap>
      )}
    </div>
  );
};
