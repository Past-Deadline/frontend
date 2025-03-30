import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PreviewMap from "../components/PreviewMap";
import VerticalDoubleRange from "../components/RangeSlider";
import Sliders from "../components/Sliders";
import type { FeatureCollection } from "geojson";
import DatePicker from "../components/DatePicker";
import { getHeatmap } from "../services/MapService";
import { LngLat } from "mapbox-gl";
import { debounce } from "lodash";
import { HeatmapDto } from "../services/HeatmapDto";
import Footer from "../components/layout/Footer.tsx";
import Header from "../components/layout/Header.tsx";
import Checkbox from "../components/Checkbox";

// Define the type for satellite types
type SatelliteType = 1 | 2 | 3 | "undefined";

export const PreviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();

  // Helper to parse numeric params safely
  const parseNumber = (param: string | null, fallback: number) => {
    if (param == null) return fallback;
    const n = Number(param);
    return Number.isFinite(n) ? n : fallback;
  };

  // 1) Extract initial params from URL (or use fallback)
  const paramStart = searchParams.get("start");
  const paramHour = parseNumber(searchParams.get("hour"), now.getHours());
  const paramMinute = parseNumber(searchParams.get("minute"), now.getMinutes());
  const paramAltLow = parseNumber(searchParams.get("altLow"), 20);
  const paramAltHigh = parseNumber(searchParams.get("altHigh"), 80);
  const paramLng = parseNumber(searchParams.get("lng"), 0);
  const paramLat = parseNumber(searchParams.get("lat"), 0);

  // Parse "types" from URL. If not present or invalid, default to all.
  const paramTypesRaw = searchParams.get("types"); // e.g. "1,3"
  const defaultAllTypes: SatelliteType[] = [1, 2, 3, "undefined"];
  let parsedTypes: SatelliteType[] = [];
  if (paramTypesRaw) {
    const splitted = paramTypesRaw.split(",").map((t) => t.trim());
    const validSet = new Set(["1", "2", "3", "undefined"]);
    splitted.forEach((val) => {
      if (validSet.has(val)) {
        if (val === "1") parsedTypes.push(1);
        else if (val === "2") parsedTypes.push(2);
        else if (val === "3") parsedTypes.push(3);
        else parsedTypes.push("undefined");
      }
    });
  }
  if (parsedTypes.length === 0) {
    parsedTypes = defaultAllTypes;
  }

  // If start param is invalid or missing, default to current ISO (sliced to "YYYY-MM-DDTHH:mm")
  const defaultStart =
    paramStart && paramStart.length >= 16
      ? paramStart
      : now.toISOString().slice(0, 16);

  // 2) Main state for the preview
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [lngLat, setLngLat] = useState<LngLat | null>(
    new LngLat(paramLng, paramLat)
  );
  const [calendarData, setCalendarData] = useState({ start: defaultStart });
  const [hour, setHour] = useState(paramHour);
  const [minute, setMinute] = useState(paramMinute);

  // Range slider is [0..100]; we convert to altitude [500..2500]
  const [rangeValues, setRangeValues] = useState<[number, number]>([
    paramAltLow,
    paramAltHigh,
  ]);

  // State for the selected satellite types
  const [typesFilter, setTypesFilter] = useState<SatelliteType[]>(parsedTypes);

  // Single source of truth for actual alt range
  const [minZ, maxZ] = useMemo(() => {
    const minAltitude = 500;
    const maxAltitude = 2500;
    const scale = (val: number) =>
      minAltitude + (val / 100) * (maxAltitude - minAltitude);
    return [scale(rangeValues[0]), scale(rangeValues[1])] as [number, number];
  }, [rangeValues]);

  // Show spinner while we do the FIRST load only
  const [initialLoading, setInitialLoading] = useState(true);

  // 3) Build correct timestamp from calendar/hours/minutes
  const buildIsoTimestamp = useCallback((): string => {
    const d = new Date(calendarData.start);
    if (!isNaN(d.getTime())) {
      d.setHours(hour);
      d.setMinutes(minute);
      return d.toISOString();
    } else {
      return new Date().toISOString();
    }
  }, [calendarData.start, hour, minute]);

  // Helper to get the effective types (if none selected, use all)
  const getEffectiveTypes = useCallback((): SatelliteType[] => {
    return typesFilter.length === 0 ? defaultAllTypes : typesFilter;
  }, [typesFilter]);

  // 4) Do ONE immediate fetch on mount
  useEffect(() => {
    if (!lngLat) return;
    const fetchInitialData = async () => {
      try {
        const isoTimestamp = buildIsoTimestamp();
        const dto: HeatmapDto = {
          timestamp: isoTimestamp,
          minAlt: minZ,
          maxAlt: maxZ,
          types: getEffectiveTypes(),
        };
        const res = await getHeatmap(dto);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps => runs only once

  // 5) Debounced fetch for *subsequent* changes
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        async (
          isoTimestamp: string,
          lowAlt: number,
          highAlt: number,
          currentTypes: SatelliteType[]
        ) => {
          if (!lngLat) return;
          try {
            const dto: HeatmapDto = {
              timestamp: isoTimestamp,
              minAlt: lowAlt,
              maxAlt: highAlt,
              types: currentTypes,
            };
            const res = await getHeatmap(dto);
            setData(res);
          } catch (err) {
            console.error(err);
          }
        },
        1000 // adjust delay as desired
      ),
    [lngLat]
  );

  useEffect(() => {
    if (initialLoading) return;
    const isoTimestamp = buildIsoTimestamp();
    debouncedUpdate(isoTimestamp, minZ, maxZ, getEffectiveTypes());
    return () => {
      debouncedUpdate.cancel();
    };
  }, [
    initialLoading,
    buildIsoTimestamp,
    minZ,
    maxZ,
    lngLat,
    typesFilter,
    debouncedUpdate,
    getEffectiveTypes,
  ]);

  // 6) Keep URL in sync with the current state
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    // Basic time/altitude/position
    newParams.set("start", calendarData.start);
    newParams.set("hour", String(hour));
    newParams.set("minute", String(minute));
    newParams.set("altLow", String(rangeValues[0]));
    newParams.set("altHigh", String(rangeValues[1]));

    if (lngLat) {
      newParams.set("lng", lngLat.lng.toFixed(5));
      newParams.set("lat", lngLat.lat.toFixed(5));
    }

    // For types: if all types are selected, remove the parameter
    const activeTypes = getEffectiveTypes();
    if (activeTypes.length === defaultAllTypes.length) {
      newParams.delete("types");
    } else {
      newParams.set("types", activeTypes.join(","));
    }

    setSearchParams(newParams, { replace: true });
  }, [
    calendarData.start,
    hour,
    minute,
    rangeValues,
    lngLat,
    typesFilter,
    searchParams,
    setSearchParams,
    getEffectiveTypes,
  ]);

  return (
    <>
      <Header />
      <div className="bg-black w-full h-full flex justify-center items-center">
        {initialLoading ? (
          <div className="bg-black w-1/8">
            {/* Spinner is shown only during the first load */}
            <span className="text-white w-full h-full loading loading-spinner" />
          </div>
        ) : (
          <PreviewMap data={data} setLngLat={setLngLat} lngLat={lngLat}>
            {/* Left UI overlay: date/time pickers and satellite type filters */}
            <div className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 flex flex-col items-center space-y-4">
              <DatePicker formData={calendarData} setFormData={setCalendarData} />
              <Sliders hour={hour} setHour={setHour} minute={minute} setMinute={setMinute} />
              <Checkbox
                selectedTypes={typesFilter}
                onChange={(updated) => setTypesFilter(updated)}
              />
            </div>

            {/* Right UI overlay: altitude range slider */}
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
              </div>
            </div>
          </PreviewMap>
        )}
      </div>
      <Footer />
    </>
  );
};
