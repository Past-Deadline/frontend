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

  // DatePicker form data (string "YYYY-MM-DDTHH:mm" from <input type="datetime-local">)
  const [calendarData, setCalendarData] = useState({
    start: currentDate.toISOString().slice(0, 16), // default partial ISO
  });

  // Sliders for hour/minute
  const [hour, setHour] = useState(currentDate.getHours());
  const [minute, setMinute] = useState(currentDate.getMinutes());

  // Vertical double-range for altitude selection (0..100 in the UI)
  const [rangeValues, setRangeValues] = useState<[number, number]>([20, 80]);
  // Actual minZ/maxZ in "real" units (e.g. 500..2500)
  const [minZ, setMinZ] = useState(500);
  const [maxZ, setMaxZ] = useState(2500);

  /**
   * Example scaling: map 0..100 => 500..2500
   */
  useEffect(() => {
    const [low, high] = rangeValues;
    const scale = (val: number) => {
      const minAltitude = 500;
      const maxAltitude = 2500;
      return minAltitude + (val / 100) * (maxAltitude - minAltitude);
    };
    setMinZ(scale(low));
    setMaxZ(scale(high));
  }, [rangeValues]);

  /**
   * Debounced function that calls getHeatmap(). 
   * Waits 2s after last change to avoid spamming.
   */
  const debouncedGetHeatmap = useMemo(
    () =>
      debounce(async (isoTimestamp: string, lowAlt: number, highAlt: number) => {
        if (!lngLat) return; // Only call if we have a valid map center

        try {
          setIsLoading(true);

          const dto: HeatmapDto = {
            timestamp: isoTimestamp, // e.g. "2026-01-01T13:45:00.000Z"
            minAlt: lowAlt,
            maxAlt: highAlt,
          };

          const res = await getHeatmap(dto);
          setData(res);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 2000),
    [lngLat] // Re-create the debounce if lngLat changes 
  );

  /**
   * Whenever user changes date/hours/minutes/alt-range or the map center changes,
   * trigger our debounced heatmap fetch.
   */
  useEffect(() => {
    if (!lngLat) return;

    // Convert the date string (ignoring its time) + hour/minute → final ISO
    const d = new Date(calendarData.start);
    d.setHours(hour);
    d.setMinutes(minute);

    // Fire off the debounced request
    debouncedGetHeatmap(d.toISOString(), minZ, maxZ);

    // Cleanup so that if these dependencies change again, 
    // the old debounce is cancelled
    return () => {
      debouncedGetHeatmap.cancel();
    };
  }, [lngLat, calendarData.start, hour, minute, minZ, maxZ, debouncedGetHeatmap]);

  /**
   * Fetch an initial heatmap once on mount, to show something by default.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
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
          {/* Controls overlay */}
          <div className="absolute z-1 top-1/2 left-0 transform -translate-y-1/2 flex flex-col items-center">
            <DatePicker formData={calendarData} setFormData={setCalendarData} />
            <Sliders
              hour={hour}
              setHour={setHour}
              minute={minute}
              setMinute={setMinute}
            />
          </div>

          {/* Altitude double-range */}
          <VerticalDoubleRange
            min={0}
            max={100}
            initialValues={rangeValues}
            height={400}
            onChange={(vals) => setRangeValues(vals)}
          />
        </PreviewMap>
      )}
    </div>
  );
};
