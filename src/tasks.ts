import {prototypes} from "./roster/prototypes";

type TaskFunction = (creep: Creep) => void;

export enum Task {
    NoTask = "NoTask",
    GetEnergy = "GetEnergy",
    TransferEnergyToSpawn = "TransferEnergyToSpawn",
    UpgradeController = "UpgradeController",

    Build = "Build",
}

/**
 * Assigns a task to the given creep depending on things that need to be done.
 * @param creep The creep to assign a task to.
 */
const assignTask: TaskFunction = (creep: Creep): void => {
    const creepPrototype = prototypes.find(proto => proto.baseName === creep.memory.prototypeBaseName);
    if (!creepPrototype) {
        console.error(`${creep.name} has unknown prototype ${creep.memory.prototypeBaseName}`);
        return;
    }
    const availableTasks = creepPrototype.tasks;

    if (availableTasks.includes(Task.GetEnergy) && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) { // If the creep has no energy, get energy
        creep.memory.task = Task.GetEnergy;
    } else if (availableTasks.includes(Task.TransferEnergyToSpawn) && Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) > 0) { // Else if the creep has energy, and spawn is not full, transfer to spawn
        // TODO could optimize further, if a creep is already going to spawn and it will make it full, another creep doesn't need
        creep.memory.task = Task.TransferEnergyToSpawn;
    } else if (availableTasks.includes(Task.UpgradeController) && Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) === 0) { // Else if the creep has energy and spawn is full, upgrade controller
        creep.memory.task = Task.UpgradeController;
    } else if (availableTasks.includes(Task.Build)) {
        creep.memory.task = Task.Build;
    } else {
        console.error(`Could not find a suitable task for ${creep.name}`);
        return;
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
        console.error(`${creep.name} perform task ${Task.GetEnergy} because no energy sources exist in the room ${creep.room.name}`);
        creep.memory.task = Task.NoTask;
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
        // console.log(`${creep.name} unable to perform task ${Task.GetEnergy}, error code ${ret}`);
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
        // console.log(`${creep.name} unable to perform task ${Task.TransferEnergyToSpawn}, error code ${ret}`);
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
        console.error(`${creep.name} unable to perform task ${Task.UpgradeController} because no controller exists in the room ${creep.room.name}`);
        creep.memory.task = Task.NoTask;
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
        // console.log(`${creep.name} unable to perform task ${Task.UpgradeController}, error code ${ret}`);
        creep.memory.task = Task.NoTask;
    }
};

/**
 * Instructs the given creep to build something.
 * @param creep The creep that should build something.
 */
const build: TaskFunction = (creep: Creep): void => {
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (!target) {
        console.log(`${creep.name} unable to perform task ${Task.Build} because there are no construction sites in need of building`);
        return;
    }

    const ret = creep.build(target);

    if (ret === OK) {
        if (creep.store.getFreeCapacity() === 0) { // If energy store is empty, done with task
            creep.memory.task = Task.NoTask;
        }
    } else if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else { // Some other error
        // console.log(`${creep.name} unable to perform task ${Task.Build}, error code ${ret}`);
        creep.memory.task = Task.NoTask;
    }
};

// // // // // // // // // // // // // // // // // // //

const TaskFunctions: { [key in Task]: TaskFunction} = {
    NoTask: assignTask,
    GetEnergy: getEnergy,
    TransferEnergyToSpawn: transferEnergyToSpawn,
    UpgradeController: upgradeController,
    Build: build,
};

export const doTask = (creep: Creep): void => {
    const task = creep.memory.task ?? Task.NoTask as Task;
    const run = TaskFunctions[task];
    run(creep);
};
