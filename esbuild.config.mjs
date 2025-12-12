import esbuild from "esbuild";
import process from "process";
import fs from "fs";
import path from "path";

const prod = process.argv[2] === "production";

// Concatenate CSS files
const stylesDir = "src/styles";
const cssFiles = [
    "base.css",
    "commit-graph.css", 
    "calendar.css",
    "legend-tooltip.css",
    "settings.css"
];

let combinedCss = "/* Auto-generated from src/styles - DO NOT EDIT DIRECTLY */\n\n";
for (const file of cssFiles) {
    const filePath = path.join(stylesDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        combinedCss += `/* === ${file} === */\n${content}\n\n`;
    }
}
fs.writeFileSync("styles.css", combinedCss);
console.log("CSS files combined into styles.css");

const context = await esbuild.context({
    entryPoints: ["src/main.js"],
    bundle: true,
    external: ["obsidian"],
    format: "cjs",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    outfile: "main.js",
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}
