import {Task} from "../tasks";

export interface CreepPrototype {
    baseName: string;
    body: BodyPartConstant[];
    opts?: SpawnOptions;
}

export const BaseCreep: CreepPrototype = {
    baseName: "BaseCreep",
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            prototypeBaseName: "BaseCreep",
            task: Task.NoTask,
        },
    },
};

