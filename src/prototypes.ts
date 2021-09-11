import {Task} from "./tasks";

export interface CreepPrototype {
    namePrefix: string;
    body: BodyPartConstant[];
    opts?: SpawnOptions;
}

export const BaseCreep: CreepPrototype = {
    namePrefix: "BaseCreep",
    body: [WORK, CARRY, MOVE],
    opts: {
        memory: {
            task: Task.NoTask,
        },
    },
};
