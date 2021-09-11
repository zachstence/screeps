import typescript from "@rollup/plugin-typescript";
import {execSync} from "child_process";

import config from "./config.json";

const branchName = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();
if (!branchName) throw new Error("Could not determine current git branch name");

export default {
    input: "src/index.ts",
    output: {
        file: `${config.deployDirectory}/${branchName}/main.js`,
        format: "cjs",
    },
    plugins: [
        typescript(),
    ],
};
