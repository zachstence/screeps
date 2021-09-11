import listJobs from "./listJobs";
import harvester from "./roles/harvester";
import {Job} from "./roles/types";
import upgrader from "./roles/upgrader";

const SPAWN_NAME = "Spawn1";
const LISTCREEPS_TICKS = 10;
const UPGRADERS_PER_HARVESTER = 2;

export function loop() {

    // Delete dead creeps from memory
    for (const name in Memory.creeps) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!Game.creeps[name]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete Memory.creeps[name];
            console.log("Clearing stale creep memory:", name);
        }
    }

    if (Game.time % LISTCREEPS_TICKS === 0) listJobs();

    const numHarvesters = Object.values(Game.creeps).filter(creep => creep.memory.job === Job.Harvester).length;
    const numUpgraders = Object.values(Game.creeps).filter(creep => creep.memory.job === Job.Upgrader).length;

    if (!Game.spawns[SPAWN_NAME].spawning) { // Spawn either a harvester or upgrader to keep given ratio
        const needHarvester = numUpgraders / numHarvesters > UPGRADERS_PER_HARVESTER;
        const newName = `${needHarvester ? "Harvester" : "Upgrader"} ${Game.time}`;
        const spawnReturnCode = Game.spawns[SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {
                job: needHarvester ? Job.Harvester : Job.Upgrader,
            },
        });

        if (spawnReturnCode === 0) console.log(`Spawning ${newName}`);
    } else { // Show status of spawn when spawning creep
        const spawningCreep = Game.creeps[Game.spawns[SPAWN_NAME].spawning!.name];
        Game.spawns[SPAWN_NAME].room.visual.text(
            `Spawning ${spawningCreep.memory.job}...`,
            Game.spawns[SPAWN_NAME].pos.x + 1,
            Game.spawns[SPAWN_NAME].pos.y,
            {align: "left", opacity: 0.8},
        );
    }


    // Do jobs
    for (const creep of Object.values(Game.creeps)) {
        if (creep.memory.job === Job.Harvester) {
            harvester.run(creep);
        } else if (creep.memory.job === Job.Upgrader) {
            upgrader.run(creep);
        }
    }

}
