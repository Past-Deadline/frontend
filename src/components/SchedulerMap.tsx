import { ReactElement, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { propagate, twoline2satrec, SatRec, EciVec3 } from 'satellite.js';
import { AdequateLaunch } from "../services/SchedulerDto"; // import your type

interface SchedulerMapProps {
  tle: [string, string]; // Single satellite TLE
  crossingCoordinates: [number, number, number][]; // ECI (x, y, z) crossing points
  recommendedRoutes?: AdequateLaunch[]; // <== new prop
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

// Simple ECI -> lat/lng converter
function eciToLatLng(x: number, y: number, z: number): [number, number] {
  const lng = (Math.atan2(y, x) * 180) / Math.PI;
  const lat = (Math.asin(z / Math.sqrt(x * x + y * y + z * z)) * 180) / Math.PI;
  return [lng, lat];
}

export default function SchedulerMap({
  tle,
  crossingCoordinates,
  recommendedRoutes = [],
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

    // 1) Draw the “default orbit path” for your TLE
    const satrec: SatRec = twoline2satrec(tle[0], tle[1]);
    const positions: [number, number][] = [];
    const now: Date = new Date();

    for (let i = 0; i < 90; i++) {
      const time: Date = new Date(now.getTime() + i * 60000);
      const pos = propagate(satrec, time);

      if (pos.position && typeof pos.position !== 'boolean') {
        const { x, y, z }: EciVec3<number> = pos.position;
        const [lng, lat] = eciToLatLng(x, y, z);
        positions.push([lng, lat]);
      }
    }

    // 2) Once map is loaded, draw everything
    map.on('load', () => {
      // Remove old layers/sources if they exist
      if (map.getLayer('orbit-line')) map.removeLayer('orbit-line');
      if (map.getSource('orbit')) map.removeSource('orbit');

      // Draw the default orbit lines
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

      // 3) If you have crossingCoordinates (demo ECI points), draw them
      crossingCoordinates.forEach((eciPoint, index) => {
        const [x, y, z] = eciPoint;
        const [lng, lat] = eciToLatLng(x, y, z);

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
          .setHTML(`<h3 style="color: black;">Crossing Point ${index + 1}</h3>`)
          .addTo(map);
      });

      // 4) Draw recommended routes
      recommendedRoutes.forEach((route, routeIndex) => {
        // Convert the main route insertion point (ECI -> lat/lng)
        const [rx, ry, rz] = route.point;
        const [routeLng, routeLat] = eciToLatLng(rx, ry, rz);

        // Add a marker (or circle layer) for the route insertion point
        const routePointSourceId = `recommended-route-point-${routeIndex}`;

        map.addSource(routePointSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [routeLng, routeLat],
            },
            properties: {
              title: `Route ${routeIndex + 1} Launch Point`,
            },
          },
        });

        map.addLayer({
          id: routePointSourceId,
          type: 'circle',
          source: routePointSourceId,
          paint: {
            'circle-radius': 7,
            'circle-color': '#FFFF00', // Yellow for the recommended route point
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000',
          },
        });

        // You can add a popup for the route's launch
        new mapboxgl.Popup()
          .setLngLat([routeLng, routeLat])
          .setHTML(
            `<h3 style="color: black;">Route ${routeIndex + 1} Launch: ${route.launch?.name || ''}</h3>
             <p style="color: black;">NET: ${route.launch?.net || ''}</p>`
          )
          .addTo(map);

        // 5) Draw each interception satellite
        route.interceptions?.forEach((intr, intrIndex) => {
          const [sx, sy, sz] = intr.interception_point;
          const [satLng, satLat] = eciToLatLng(sx, sy, sz);

          // Source/Layer for interception point
          const intrPointSourceId = `recommended-route-${routeIndex}-intr-${intrIndex}`;

          map.addSource(intrPointSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [satLng, satLat],
              },
              properties: {
                title: `Interception ${intrIndex + 1} of Route ${routeIndex + 1}`,
              },
            },
          });

          map.addLayer({
            id: intrPointSourceId,
            type: 'circle',
            source: intrPointSourceId,
            paint: {
              'circle-radius': 6,
              'circle-color': '#00FF00', // green for interception
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
            },
          });

          // (Optional) add popup for the intercepting satellite
          new mapboxgl.Popup()
            .setLngLat([satLng, satLat])
            .setHTML(
              `<h3 style="color: black;">Intercept Sat: ${intr.sat?.name || ''}</h3>`
            )
            .addTo(map);

          // 6) (Optional) Draw a line from route point to interception point
          const routeLineSourceId = `recommended-route-line-${routeIndex}-intr-${intrIndex}`;
          map.addSource(routeLineSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [routeLng, routeLat],
                  [satLng, satLat],
                ],
              },
              properties: {},
            },
          });

          map.addLayer({
            id: routeLineSourceId,
            type: 'line',
            source: routeLineSourceId,
            paint: {
              'line-color': '#00ff00',
              'line-width': 2,
            },
          });
        });
      });
    });

    return () => {
      map.remove();
    };
  }, [tle, crossingCoordinates, recommendedRoutes]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
