import axios from "axios";
import {HeatmapDto} from "./HeatmapDto.ts";

export function getHeatmap(): HeatmapDto {
    const loadData = async () => {
        const res = await axios
            .post<HeatmapDto>("https://server-production-7795.up.railway.app/satellites/heatmap", {
                "minLat": -10,
                "maxLat": 10,
                "minLon": -20,
                "maxLon": 20,
                "timestamp": "2026-01-01T00:00:00Z",
                "minAlt": 0,
                "maxAlt": 2000,
                "zoom": 5,
                "timeDirection": "forward",
                "types": [
                    0,
                    3
                ]
            });
        return res.data;
    }

    loadData();
}

