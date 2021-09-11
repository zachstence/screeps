import type {CreepPrototype} from "./prototypes";
import {BaseCreep, Builder} from "./prototypes";

export interface RosterRole {
    prototype: CreepPrototype;
    count: number;
}

export const roster: RosterRole[] = [
    {prototype: BaseCreep, count: 4},
    {prototype: Builder, count: 10},
];

export const countCreepsWithPrototype = (prototype: CreepPrototype): number => {
    let count = 0;
    Object.values(Game.creeps).forEach(creep => {
        if (creep.memory.prototypeBaseName === prototype.baseName) count++;
    });
    return count;
};

