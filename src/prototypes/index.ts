import {Job} from "../jobs/types";

export interface CreepPrototype {
    namePrefix: string;
    body: BodyPartConstant[];
    opts?: SpawnOptions;
}

export const HarvesterPrototype: CreepPrototype = {
    namePrefix: "Harvester",
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            job: Job.Harvester,
        },
    },
};

export const UpgraderPrototype: CreepPrototype = {
    namePrefix: "Upgrader",
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            job: Job.Upgrader,
        },
    },
};
