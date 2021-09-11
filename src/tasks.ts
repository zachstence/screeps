type TaskFunction = (creep: Creep) => void;

export enum Task {
    NoTask = "NoTask",
    GetEnergy = "GetEnergy",
    TransferEnergyToSpawn = "TransferEnergyToSpawn",
    UpgradeController = "UpgradeController",
}

/**
 * Assigns a task to the given creep depending on things that need to be done.
 * @param creep The creep to assign a task to.
 */
const assignTask: TaskFunction = (creep: Creep): void => {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) { // If the creep has no energy, get energy
        creep.memory.task = Task.GetEnergy;
    } else if (Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) > 0) { // Else if the creep has energy, and spawn is not full, transfer to spawn
        // TODO could optimize further, if a creep is already going to spawn and it will make it full, another creep doesn't need
        creep.memory.task = Task.TransferEnergyToSpawn;
    } else if (Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) === 0) { // Else if the creep has energy and spawn is full, upgrade controller
        creep.memory.task = Task.UpgradeController;
    }

    console.log(`${creep.name} assigned task ${creep.memory.task}`);
};

/**
 * Instructs the given creep to find an energy source and harvest energy until done.
 * @param creep The creep that should get energy.
 */
const getEnergy: TaskFunction = (creep: Creep): void => {
    // Try to harvest energy
    const sources = creep.room.find(FIND_SOURCES);
    if (!sources.length) {
        console.log(`${creep.name} perform task ${Task.GetEnergy} because no energy sources exist in the room ${creep.room.name}`);
        creep.memory.task = "";
        return;
    }
    const ret = creep.harvest(sources[0]);

    if (ret === OK) {
        if (creep.store.getFreeCapacity() === 0) { // If energy store full, done with task
            creep.memory.task = Task.NoTask;
        }
    } else if (ret === ERR_NOT_IN_RANGE) { // If not in range, move towards energy source
        creep.moveTo(sources[0]);
    } else { // Some other error
        console.log(`${creep.name} unable to perform task ${Task.GetEnergy}, error code ${ret}`);
        creep.memory.task = Task.NoTask;
    }
};


/**
 * Instructs the given creep to transfer its energy to spawn until empty.
 * @param creep The creep that should transfer energy to spawn
 */
const transferEnergyToSpawn: TaskFunction = (creep: Creep): void => {
    const spawn1 = Game.spawns.Spawn1;

    // Try to transfer energy to spawn
    const ret = creep.transfer(spawn1, RESOURCE_ENERGY);

    if (ret === OK) { // If transfer successful, done with task
        creep.memory.task = Task.NoTask;
    } else if (ret === ERR_NOT_IN_RANGE) { // If not in range, move towards energy source
        creep.moveTo(spawn1);
    } else { // Some other error
        console.log(`${creep.name} unable to perform task ${Task.TransferEnergyToSpawn}, error code ${ret}`);
        creep.memory.task = Task.NoTask;
    }
};

/**
 * Instructs the given creep to upgrade the room's controller.
 * @param creep The creep that should upgrade the room's controller.
 */
const upgradeController: TaskFunction = (creep: Creep): void => {
    const controller = creep.room.controller;
    if (!controller) {
        console.log(`${creep.name} unable to perform task ${Task.UpgradeController} because no controller exists in the room ${creep.room.name}`);
        creep.memory.task = "";
        return;
    }

    // Try to upgrade controller
    const ret = creep.upgradeController(controller);

    if (ret === OK) {
        if (creep.store.getFreeCapacity() === 0) { // If energy store is empty, done with task
            creep.memory.task = Task.NoTask;
        }
    } else if (ret === ERR_NOT_IN_RANGE) { // If not in range, move towards energy source
        creep.moveTo(controller);
    } else { // Some other error
        console.log(`${creep.name} unable to perform task ${Task.UpgradeController}, error code ${ret}`);
        creep.memory.task = Task.NoTask;
    }
};


//

const TaskFunctions: { [key in Task]: TaskFunction} = {
    NoTask: assignTask,
    GetEnergy: getEnergy,
    TransferEnergyToSpawn: transferEnergyToSpawn,
    UpgradeController: upgradeController,
};

export const doTask = (creep: Creep): void => {
    const task = creep.memory.task as Task;
    const run = TaskFunctions[task];
    run(creep);
};
