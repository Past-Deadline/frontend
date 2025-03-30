export interface SchedulerDto {
    count: number;
    adequete_launches: AdequateLaunch[];
}

export interface AdequateLaunch {
    point: number[];
    launch: LaunchDetails;
    interceptions: Interception[];
}

export interface Interception {
    interception: {

    }
}

interface LaunchDetails {
    id: string;
    name: string;
    status: Status;
    net: string;
    launch_service_provider: LaunchServiceProvider;
    rocket: Rocket;
    mission: Mission;
    pad: Pad;
    image: string;
}

interface Status {
    name: string;
}

interface LaunchServiceProvider {
    name: string;
}

interface Rocket {
    configuration: RocketConfiguration;
}

interface RocketConfiguration {
    name: string;
    full_name: string;
}

interface Mission {
    name: string;
    type: string;
    orbit: Orbit;
}

interface Orbit {
    name: string;
}

interface Pad {
    name: string;
    location: Location;
}

interface Location {
    name: string;
    country_code: string;
}
