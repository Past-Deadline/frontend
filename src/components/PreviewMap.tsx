import { useEffect, useRef, useState } from 'react';
import './preview-map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Layer } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import { getHeatmap } from '../services/MapService.ts';

export default function PreviewMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<FeatureCollection | null>(null);

    const heatmapId: string = 'space-objects';
    const heatmapLayer: Layer = {
        id: 'space-objects-layer',
        type: 'heatmap',
        source: 'space-objects',
        paint: {
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(0,0,0,0)',
                0.2,
                'rgba(255,145,0,0.2)',
                0.4,
                'rgba(255,64,0,0.4)',
                0.6,
                'rgba(255,50,0,0.6)',
                0.8,
                'rgba(255,0,0,0.8)',
                1,
                'rgb(151,0,0)',
            ]
        }
    };

    const handlePost = async () => {
        try {
            const data = await getHeatmap({
                timestamp: new Date().toISOString(),
                minAlt: 1000,
                maxAlt: 2000,
            });
            setData(data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        handlePost();
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [23, 42],
            zoom: 3,
        });

        mapRef.current = map;

        map.on('load', () => {
            if (data) {
                map.addSource(heatmapId, {
                    type: 'geojson',
                    data: data,
                });
                map.addLayer(heatmapLayer);
                setIsLoading(false);
            }
        });

        return () => {
            map.remove();
        };
    }, [data]);

    useEffect(() => {
        if (!mapRef.current || !data) return;

        if (!mapRef.current.isStyleLoaded()) return;

        const map = mapRef.current;

        const existingSource = map.getSource('space-objects');
        if (existingSource) {
            (existingSource as mapboxgl.GeoJSONSource).setData(data);
        } else {
            map.addSource(heatmapId, {
                type: 'geojson',
                data: data,
            });
            map.addLayer(heatmapLayer);
        }
    }, [data]);

    return (
        <div className="bg-black w-full h-full flex justify-center items-center">
            {isLoading ? (
                <div className="bg-black w-1/8">
                    <span className="text-white w-full h-full loading loading-spinner"></span>
                </div>
            ) : (
                <div
                    id="preview-map-container"
                    className="w-full h-full relative z-0"
                    ref={mapContainerRef}
                />
            )}
        </div>
    );
}