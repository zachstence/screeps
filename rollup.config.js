import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default {
    input: "src/index.ts",
    output: {
        file: "/mnt/c/Users/zachs/AppData/Local/Screeps/scripts/***REMOVED***/tasks/main.js",
        format: "cjs",
    },
    plugins: [
        typescript(),
        // terser(),
    ],
};
