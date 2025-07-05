import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "public/affiliateTracking.ts",
  output: {
    file: "public/affiliateTrackingJavascript.js",
    format: "iife",
    name: "AffiliateTracker",
    sourcemap: true,
  },
  plugins: [nodeResolve(), commonjs(), typescript()],
};
