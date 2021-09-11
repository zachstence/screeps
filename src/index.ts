import {countCreepsWithPrototype, roster} from "./roster";
import {doTask} from "./tasks";
import {
    deallocCreeps, listTasks, spawnCreep,
} from "./util";

const SPAWN_NAME = "Spawn1";
const LISTCREEPS_TICKS = 10;

export function loop() {

    const spawn1 = Game.spawns[SPAWN_NAME];

    deallocCreeps();
    if (Game.time % LISTCREEPS_TICKS === 0) listTasks();

    // Spawn creeps to fill roster
    for (const role of roster) {
        const neededCreeps = role.count - countCreepsWithPrototype(role.prototype);
        if (neededCreeps > 0) {
            spawnCreep(spawn1, role.prototype);
        }
    }

    // Do tasks
    Object.values(Game.creeps).forEach(creep => {
        doTask(creep);
    });
}
