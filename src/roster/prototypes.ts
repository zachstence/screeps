import {Task} from "../tasks";

export interface CreepPrototype {
    baseName: string;
    body: BodyPartConstant[];
    opts?: SpawnOptions;

    tasks: Task[];
}

export const BaseCreep: CreepPrototype = {
    baseName: "BaseCreep",
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            prototypeBaseName: "BaseCreep",
        },
    },
    tasks: [Task.NoTask, Task.GetEnergy, Task.TransferEnergyToSpawn, Task.UpgradeController],
};

export const Builder: CreepPrototype = {
    baseName: "Builder",
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            prototypeBaseName: "Builder",
        },
    },
    tasks: [Task.NoTask, Task.GetEnergy, Task.Build],
};

export const prototypes: CreepPrototype[] = [BaseCreep, Builder];
