import type {JobFunction} from "./types";

const run: JobFunction = (creep: Creep) => {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    } else {
        // eslint-disable-next-line no-lonely-if
        if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns.Spawn1);
        }
    }
};

export default {run};
