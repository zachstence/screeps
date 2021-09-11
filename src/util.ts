import type {CreepPrototype} from "./prototypes";

/**
 * Removes any creeps from the Game that do not exist in Memory (due to creep death).
 */
export const deallocCreeps = (doLog = false) => {
    // Delete dead creeps from memory
    for (const name in Memory.creeps) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!Game.creeps[name]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete Memory.creeps[name];
            if (doLog) console.log("Deallocating creep from memory:", name);
        }
    }
};

export const listJobs = () => {
    // TODO make this use Job
    const jobCounts: Record<string, number> = {};

    for (const creep of Object.values(Game.creeps)) {
        const job = creep.memory.job;
        if (jobCounts[job] >= 0) jobCounts[job]++;
        else jobCounts[job] = 0;
    }

    let out: string = "Employed creeps:\n";
    out += Object.entries(jobCounts)
        .map(entry => `  ${entry[0]}\t${entry[1]}`)
        .join("\n");

    console.log(out);
};

export const spawnCreep = (spawn: StructureSpawn, prototype: CreepPrototype): ScreepsReturnCode => {
    const name = `${prototype.namePrefix} ${Game.time}`;
    return spawn.spawnCreep(prototype.body, name, prototype.opts);
};

export const spawnStatus = (spawn: StructureSpawn): void => {
    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            `Spawning ${spawningCreep.memory.job}...`,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: "left", opacity: 0.8},
        );
    }
};
