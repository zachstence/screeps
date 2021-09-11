import {BaseCreep} from "./prototypes";
import {doTask} from "./tasks";
import {
    deallocCreeps, listTasks, spawnCreep,
} from "./util";

const SPAWN_NAME = "Spawn1";
const LISTCREEPS_TICKS = 10;

const NUM_CREEPS = 12;

export function loop() {

    const spawn1 = Game.spawns[SPAWN_NAME];

    deallocCreeps();
    if (Game.time % LISTCREEPS_TICKS === 0) listTasks();

    // Spawn creeps until we reach NUM_CREEPS
    if (Object.values(Game.creeps).length < NUM_CREEPS && !spawn1.spawning) {
        spawnCreep(spawn1, BaseCreep);
    }

    // Do tasks
    Object.values(Game.creeps).forEach(creep => {
        doTask(creep);
    });
}
