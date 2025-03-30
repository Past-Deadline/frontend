export interface HeatmapDto {
    minLat?: number;
    maxLat?: number;
    minLon?: number;
    maxLon?: number;
    timestamp: string;
    minAlt: number;
    maxAlt: number;
    /**
     * An array of satellite types to filter by.
     * Can be [1, 2, 3, "undefined"], or any subset.
     */
    types: Array<1 | 2 | 3 | "undefined">;
}
