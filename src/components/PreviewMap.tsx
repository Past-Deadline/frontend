import { useEffect, useRef, useState } from 'react';
import './preview-map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import type { FeatureCollection } from 'geojson';

export default function PreviewMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    // We'll store our GeoJSON data here
    const [data, setData] = useState<FeatureCollection | null>(null);

    // 1. Fetch data from your API once when component mounts
    useEffect(() => {
        const handlePost = async () => {
            try {
                const res = await axios.post(
                    'https://server-production-7795.up.railway.app/satellites/heatmap',
                    {
                        minLat: -180,
                        maxLat: 180,
                        minLon: -180,
                        maxLon: 180,
                        timestamp: '2026-01-01T00:00:00Z',
                        minAlt: 1000,
                        maxAlt: 2000,
                    }
                );
                console.log('API Response:', res.data);
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        handlePost();
    }, []);

    // 2. Create map once on mount
    useEffect(() => {
        // Only proceed if our container ref is set
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

        // Create the map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12', // Specify a valid style URL
            center: [23, 42],
            zoom: 3,
        });

        mapRef.current = map;

        // When map finishes loading the style, we can add sources/layers
        map.on('load', () => {
            // If data is already fetched, add the source/layer now
            if (data) {
                map.addSource('space-objects', {
                    type: 'geojson',
                    data: data,
                });

                // Example layer. Adjust to your needs (e.g., heatmap, circle, etc.)
                map.addLayer({
                    id: 'space-objects-layer',
                    type: 'heatmap',
                    source: 'space-objects',
                });
            }
        });

        // Cleanup on unmount
        return () => {
            map.remove();
        };
    }, []);

    // 3. Whenever `data` changes (e.g., new fetch), update or add the source
    useEffect(() => {
        if (!mapRef.current || !data) return;

        // If the map style has not fully loaded, wait
        if (!mapRef.current.isStyleLoaded()) return;

        const map = mapRef.current;

        // Check if the source already exists
        const existingSource = map.getSource('space-objects');
        if (existingSource) {
            // Just update the data
            (existingSource as mapboxgl.GeoJSONSource).setData(data);
        } else {
            // If for some reason it doesn't exist yet (e.g., slow fetch),
            // then add the source/layer now
            map.addSource('space-objects', {
                type: 'geojson',
                data: data,
            });
            map.addLayer({
                id: 'space-objects-layer',
                type: 'heatmap',
                source: 'space-objects',
            });
        }
    }, [data]);

    return (
        <div
            id="preview-map-container"
            className="relative z-0"
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%' }}
        >
            <p id="waterway-label" className="absolute z-1">
                Bastun
            </p>
        </div>
    );
}
