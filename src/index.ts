import harvester from "./jobs/harvester";
import {Job} from "./jobs/types";
import upgrader from "./jobs/upgrader";
import {HarvesterPrototype, UpgraderPrototype} from "./prototypes";
import {
    deallocCreeps, listJobs, spawnCreep, spawnStatus,
} from "./util";

const SPAWN_NAME = "Spawn1";
const LISTCREEPS_TICKS = 10;
const UPGRADERS_PER_HARVESTER = 3;

export function loop() {

    const spawn1 = Game.spawns[SPAWN_NAME];

    deallocCreeps();
    if (Game.time % LISTCREEPS_TICKS === 0) listJobs();

    // Spawn either a harvester or upgrader to keep given ratio
    if (!spawn1.spawning) {
        const numHarvesters = Object.values(Game.creeps).filter(creep => creep.memory.job === Job.Harvester).length;
        const numUpgraders = Object.values(Game.creeps).filter(creep => creep.memory.job === Job.Upgrader).length;
    
        const needHarvester = numUpgraders / numHarvesters > UPGRADERS_PER_HARVESTER;
        const ret = spawnCreep(spawn1, needHarvester ? HarvesterPrototype : UpgraderPrototype);
        if (ret === 0) console.log(`Spawning`);
    }

    spawnStatus(spawn1);

    // Do jobs
    for (const creep of Object.values(Game.creeps)) {
        if (creep.memory.job === Job.Harvester) {
            harvester.run(creep);
        } else if (creep.memory.job === Job.Upgrader) {
            upgrader.run(creep);
        }
    }

}
