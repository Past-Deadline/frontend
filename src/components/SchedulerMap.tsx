import { ReactElement, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { propagate, twoline2satrec, SatRec, EciVec3 } from 'satellite.js';

interface SchedulerMapProps {
  tle: [string, string]; // Single satellite TLE
  crossingCoordinates: [number, number, number][]; // ECI (x, y, z) crossing points
}

// Helper to split orbit path on ±180° wraparound
function splitOrbitOnWraparound(coords: [number, number][]): [number, number][][] {
  const segments: [number, number][][] = [];
  let currentSegment: [number, number][] = [];

  for (let i = 0; i < coords.length - 1; i++) {
    currentSegment.push(coords[i]);

    const lon1 = coords[i][0];
    const lon2 = coords[i + 1][0];
    const diff = Math.abs(lon1 - lon2);

    if (diff > 180) {
      // Detected longitude jump, start new segment
      segments.push(currentSegment);
      currentSegment = [];
    }
  }

  currentSegment.push(coords[coords.length - 1]);
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

export default function SchedulerMap({
  tle,
  crossingCoordinates,
}: SchedulerMapProps): ReactElement {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

    const map: mapboxgl.Map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: 2,
      
    });

    mapRef.current = map;

    const satrec: SatRec = twoline2satrec(tle[0], tle[1]);

    const positions: [number, number][] = [];
    const now: Date = new Date();

    for (let i = 0; i < 90; i++) {
      const time: Date = new Date(now.getTime() + i * 60000);
      const pos = propagate(satrec, time);

      if (pos.position && typeof pos.position !== 'boolean') {
        const { x, y, z }: EciVec3<number> = pos.position;

        const lng = (Math.atan2(y, x) * 180) / Math.PI;
        const lat = (Math.asin(z / Math.sqrt(x * x + y * y + z * z)) * 180) / Math.PI;

        positions.push([lng, lat]);
      }
    }

    map.on('load', () => {
      if (map.getLayer('orbit-line')) map.removeLayer('orbit-line');
      if (map.getSource('orbit')) map.removeSource('orbit');

      const orbitSegments = splitOrbitOnWraparound(positions);

      map.addSource('orbit', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: orbitSegments.map((segment) => ({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: segment,
            },
            properties: {},
          })),
        },
      });

      map.addLayer({
        id: 'orbit-line',
        type: 'line',
        source: 'orbit',
        paint: {
          'line-color': '#0000FF',
          'line-width': 4,
        },
      });

      crossingCoordinates.forEach((eciPoint, index) => {
        const [x, y, z] = eciPoint;
        const lng = (Math.atan2(y, x) * 180) / Math.PI;
        const lat = (Math.asin(z / Math.sqrt(x * x + y * y + z * z)) * 180) / Math.PI;

        const isOnOrbit = positions.some(
          ([orbitLng, orbitLat]) =>
            Math.abs(lat - orbitLat) < 0.1 && Math.abs(lng - orbitLng) < 0.1
        );

   //     if (isOnOrbit) {
          const crossingId = `crossing-${index}`;

          if (map.getLayer(`crossing-point-${index}`)) {
            map.removeLayer(`crossing-point-${index}`);
          }
          if (map.getSource(crossingId)) {
            map.removeSource(crossingId);
          }

          map.addSource(crossingId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              properties: {},
            },
          });

          map.addLayer({
            id: `crossing-point-${index}`,
            type: 'circle',
            source: crossingId,
            paint: {
              'circle-radius': 8,
              'circle-color': '#FF0000',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
            },
          });

          new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setHTML(`<h3 style="color: black;">Crossing Point ${index + 1}</h3><p style="color: black;"></p>`)
    .addTo(map);

      });
    });

    return () => {
      map.remove();
    };
  }, [tle, crossingCoordinates]);

  return <div className="w-full h-full" ref={mapContainerRef}></div>;
}