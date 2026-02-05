import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowlist = [
  "@google/generative-ai",
  "axios",
  "express",
  "express-session",
  "memorystore",
  "passport",
  "passport-local",
  "pg",
  "drizzle-orm",
  "drizzle-zod",
  "zod"
];

async function build() {
  const distPath = path.resolve(__dirname, "..", "dist");
  
  try {
    await rm(distPath, { recursive: true, force: true });
    console.log("Cleaned dist directory");

    console.log("Building client...");
    await viteBuild();
    
    console.log("Building server...");
    const pkg = JSON.parse(await readFile(path.resolve(__dirname, "..", "package.json"), "utf8"));
    const externals = Object.keys(pkg.dependencies || {}).filter(dep => !allowlist.includes(dep));

    await esbuild.build({
      entryPoints: [path.resolve(__dirname, "..", "server", "index.ts")],
      bundle: true,
      platform: "node",
      target: "node20",
      format: "cjs",
      outfile: path.resolve(distPath, "index.cjs"),
      external: [...externals, "vite", "./vite"],
      sourcemap: true,
      minify: process.env.NODE_ENV === "production",
    });

    console.log("Build complete!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
