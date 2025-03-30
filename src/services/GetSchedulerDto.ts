export interface GetSchedulerDto {
    time_frame: {
        start: string;
        end: string;
    },
    orbit: string,
    points_of_interest: [
        [string, string, string]
    ]
}