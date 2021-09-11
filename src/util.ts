import type {CreepPrototype} from "./prototypes";
import type {Task} from "./tasks";

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

export const listTasks = () => {
    const taskCounts: { [key in Task]: number} = {
        NoTask: 0,
        GetEnergy: 0,
        TransferEnergyToSpawn: 0,
        UpgradeController: 0,
    };

    for (const creep of Object.values(Game.creeps)) {
        const task = creep.memory.task as Task;
        taskCounts[task]++;
    }

    let out: string = "";
    out += Object.entries(taskCounts)
        .map(entry => `${entry[1].toString().padStart(2)}\t${entry[0]}`)
        .join("\n");

    console.log(out);
};

export const spawnCreep = (spawn: StructureSpawn, prototype: CreepPrototype): ScreepsReturnCode => {
    const name = `${prototype.namePrefix}${Game.time}`;
    return spawn.spawnCreep(prototype.body, name, prototype.opts);
};

export const spawnStatus = (spawn: StructureSpawn): void => {
    if (spawn.spawning) {
        spawn.room.visual.text(
            `Spawning...`,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: "left", opacity: 0.8},
        );
    }
};
