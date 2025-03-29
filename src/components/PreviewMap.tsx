import './preview-map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import {useEffect, useRef} from "react";

export default function PreviewMap() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(HTMLDivElement.prototype);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWxla3NuaWtvbG92MiIsImEiOiJjbTh1MDduZGswNWRhMmtxd2V5M281OGtvIn0.IAp5PAdsbQ0WBbyLCF7dDA';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [23, 42],
            zoom: 3
        });

        return () => {
            mapRef.current?.remove();
        }
    }, []);

    return (
        <div id='preview-map-container'  ref={mapContainerRef}>
            <p>Bastun</p>
        </div>
    )
}