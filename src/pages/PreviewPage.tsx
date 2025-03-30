import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom"; // <-- React Router за работа с query string
import PreviewMap from "../components/PreviewMap";
import VerticalDoubleRange from "../components/RangeSlider";
import Sliders from "../components/Sliders";
import type { FeatureCollection } from "geojson";
import DatePicker from "../components/DatePicker";
import { getHeatmap } from "../services/MapService";
import { LngLat } from "mapbox-gl";
import { debounce } from "lodash";
import { HeatmapDto } from "../services/HeatmapDto";

export const PreviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Малък helper за парсване на число от string | null
  function parseNumber(param: string | null, fallback: number) {
    if (param == null) return fallback;
    const n = Number(param);
    return Number.isFinite(n) ? n : fallback;
  }

  // Текуща дата/час за fallback
  const now = new Date();

  // 1) Четем параметрите от URL (ако ги има):
  const paramStart = searchParams.get("start"); // YYYY-MM-DDTHH:mm
  const paramHour = parseNumber(searchParams.get("hour"), now.getHours());
  const paramMinute = parseNumber(searchParams.get("minute"), now.getMinutes());
  const paramAltLow = parseNumber(searchParams.get("altLow"), 20);
  const paramAltHigh = parseNumber(searchParams.get("altHigh"), 80);
  const paramLng = parseNumber(searchParams.get("lng"), 0);
  const paramLat = parseNumber(searchParams.get("lat"), 0);

  // Проверка дали "start" е валиден datetime-local (поне 16 символа: YYYY-MM-DDTHH:mm)
  const defaultStart =
    paramStart && paramStart.length >= 16
      ? paramStart
      : now.toISOString().slice(0, 16);

  // 2) Локален state за входните полета
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  // Държим lngLat в родителя (PreviewPage), за да го sync-нем с URL.
  const [lngLat, setLngLat] = useState<LngLat | null>(new LngLat(paramLng, paramLat));

  // Дата/час от DatePicker
  const [calendarData, setCalendarData] = useState({ start: defaultStart });

  // Час/минута от двата слайдера
  const [hour, setHour] = useState(paramHour);
  const [minute, setMinute] = useState(paramMinute);

  // Altitude range (0..100 в UI)
  const [rangeValues, setRangeValues] = useState<[number, number]>([
    paramAltLow,
    paramAltHigh,
  ]);

  // Реални стойности (м) – примерно 500..2500
  const [minZ, setMinZ] = useState(500);
  const [maxZ, setMaxZ] = useState(2500);

  // 3) Когато rangeValues (0..100) се сменят => смятаме реалния диапазон (500..2500)
  useEffect(() => {
    const [low, high] = rangeValues;
    const minAltitude = 500;
    const maxAltitude = 2500;

    const scale = (val: number) =>
      minAltitude + (val / 100) * (maxAltitude - minAltitude);

    setMinZ(scale(low));
    setMaxZ(scale(high));
  }, [rangeValues]);

  // 4) Debounce зареждане на heatmap (не показваме spinner при всяко мръдване)
  const debouncedGetHeatmap = useMemo(
    () =>
      debounce(async (isoTimestamp: string, lowAlt: number, highAlt: number) => {
        if (!lngLat) return;
        try {
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

  // 5) Всеки път когато потребителят смени нещо (calendarData, hour, minute, alt, или карта),
  //    викаме debouncedGetHeatmap, за да презаредим данните
  useEffect(() => {
    if (!lngLat) return;

    // Правим Date от "calendarData.start" и set-ваме час/минута
    const d = new Date(calendarData.start);
    d.setHours(hour);
    d.setMinutes(minute);

    debouncedGetHeatmap(d.toISOString(), minZ, maxZ);

    return () => {
      debouncedGetHeatmap.cancel();
    };
  }, [lngLat, calendarData.start, hour, minute, minZ, maxZ, debouncedGetHeatmap]);

  // 6) Първоначално зареждане с някакви примерни параметри (включваме spinner)
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

  // 7) Sync-ваме state обратно към URL – при всяка промяна ъпдейтваме searchParams
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("start", calendarData.start);
    newParams.set("hour", String(hour));
    newParams.set("minute", String(minute));
    newParams.set("altLow", String(rangeValues[0]));
    newParams.set("altHigh", String(rangeValues[1]));

    if (lngLat) {
      // за по-къс URL, ограничаваме до 5 знака след дес. точка
      newParams.set("lng", lngLat.lng.toFixed(5));
      newParams.set("lat", lngLat.lat.toFixed(5));
    }

    // setSearchParams с { replace: true } да не трупа entries в history
    setSearchParams(newParams, { replace: true });
  }, [
    calendarData.start,
    hour,
    minute,
    rangeValues,
    lngLat,
    searchParams,
    setSearchParams,
  ]);

  // 8) Рендираме
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
          lngLat={lngLat} // подаваме при инициализация, за да центрира картата веднъж
          setIsLoading={setIsLoading}
        >
          {/* Ляв панел - дата и час */}
          <div className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 flex flex-col items-center space-y-4">
            <DatePicker
              formData={calendarData}
              setFormData={setCalendarData}
            />
            <Sliders
              hour={hour}
              setHour={setHour}
              minute={minute}
              setMinute={setMinute}
            />
          </div>

          {/* Десен панел - алтиметър */}
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
