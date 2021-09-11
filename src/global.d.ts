// eslint-disable-next-line spaced-comment
/// <reference types="screeps" />

import type {CreepPrototypeBaseName} from "./roster/prototypes";
import type {Task} from "./tasks";

declare global {
    interface CreepMemory {
        prototypeBaseName: CreepPrototypeBaseName;
        task?: Task;
    }
}
