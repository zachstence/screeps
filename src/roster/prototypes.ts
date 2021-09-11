import {Task} from "../tasks";

export interface CreepPrototype {
    baseName: string;
    body: BodyPartConstant[];
    opts?: SpawnOptions;

    tasks: Task[];
}

export enum CreepPrototypeBaseName {
    BaseCreep = "BaseCreep",
    Builder = "Builder",
}

export const BaseCreep: CreepPrototype = {
    baseName: CreepPrototypeBaseName.BaseCreep,
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            prototypeBaseName: CreepPrototypeBaseName.BaseCreep,
        },
    },
    tasks: [Task.NoTask, Task.GetEnergy, Task.TransferEnergyToSpawn, Task.UpgradeController],
};

export const Builder: CreepPrototype = {
    baseName: CreepPrototypeBaseName.Builder,
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            prototypeBaseName: CreepPrototypeBaseName.Builder,
        },
    },
    tasks: [Task.NoTask, Task.GetEnergy, Task.Build],
};

export const prototypes: CreepPrototype[] = [BaseCreep, Builder];
