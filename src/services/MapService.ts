import axios from "axios";
import {HeatmapDto} from "./HeatmapDto.ts";
import {FeatureCollection} from "geojson";

export async function getHeatmap(dto: HeatmapDto): Promise<FeatureCollection> {
    const res = await axios.post(
        'https://api.spaceguard.app/v01/heatmap',
        dto
    );
    return res.data;
}