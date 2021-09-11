export enum Job {
    Harvester = "Harvester",
    Upgrader = "Upgrader",
}

export type JobFunction = (creep: Creep) => void;
