import axios from "axios";
import {HeatmapDto} from "./HeatmapDto.ts";
import {FeatureCollection} from "geojson";

export async function getHeatmap(dto: HeatmapDto): Promise<FeatureCollection> {
    const start = performance.now();
    const res = await axios.post(
        'https://nohost',
        dto
    );
    const end = performance.now();
    console.log(end - start);
    return res.data;
}