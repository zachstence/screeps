export default () => {
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
