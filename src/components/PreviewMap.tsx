import { ReactElement, useEffect, useRef } from 'react';
import './preview-map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Layer, LngLat } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';

export interface PreviewMapProps {
    data: FeatureCollection | null;
    setData: (data: FeatureCollection | null) => void;
    setLngLat: (lngLat: LngLat | null) => void;
    lngLat: LngLat | null;             // <- Използваме при инициализация
    setIsLoading: (isLoading: boolean) => void;
    children: ReactElement | ReactElement[];
}

export default function PreviewMap({
    data,
    setLngLat,
    lngLat,
    setIsLoading,
    children
}: PreviewMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const heatmapId = 'space-objects';

    useEffect(() => {
        if (!mapContainerRef.current) return;
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

        // Картата се създава *само веднъж*
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            // При първоначално създаване - център е lngLat (или [0,0] ако не е зададено)
            center: lngLat ? [lngLat.lng, lngLat.lat] : [0, 0],
            zoom: 3,
        });

        mapRef.current = map;

        map.on('load', () => {
            if (data) {
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
                map.addSource(heatmapId, {
                    type: 'geojson',
                    data: data,
                });
                map.addLayer(heatmapLayer);
                setIsLoading(false);
            }
        });

        // Когато потребителят пусне местенето на картата, ъпдейтваме state в PreviewPage
        map.on('moveend', (event) => {
            setLngLat(event.target.getCenter());
        });

        // Cleanup – махаме listener при unmount
        return () => {
            map.off('moveend', (event) => {
                setLngLat(event.target.getCenter());
            });
        };
    }, []);

    // Ако данните (data) се сменят, обновяваме source
    useEffect(() => {
        if (!mapRef.current || !data) return;
        if (!mapRef.current.isStyleLoaded()) return;

        const map = mapRef.current;
        const existingSource = map.getSource(heatmapId);
        if (existingSource) {
            (existingSource as mapboxgl.GeoJSONSource).setData(data);
        }
    }, [data]);

    // !! МАХАМЕ useEffect, който re-center-ваше при всяка смяна на lngLat
    // Така потребителят може да си върти/мести свободно, без да го връща обратно.

    return (
        <div
            id="preview-map-container"
            className="w-full h-full relative z-0"
            ref={mapContainerRef}
        >
            {children}
        </div>
    );
}
