// Assemble the private MoMo bot CLI package. Run `npm pack` in release/npm
// to make a tarball for local installation.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "release", "npm");
const app = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

for (const required of ["dist-server/index.js", "dist-server/openmausbot.js", "dist/index.html"]) {
  if (!existsSync(join(root, required))) {
    console.error(`missing ${required}: run \`pnpm build:server && pnpm exec vite build\` first`);
    process.exit(1);
  }
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const serverDist = join(root, "dist-server");
cpSync(serverDist, join(out, "dist-server"), {
  recursive: true,
  filter: (source) => relative(serverDist, source).split(sep)[0] !== "enterprise",
});
cpSync(join(root, "dist"), join(out, "dist"), { recursive: true });
if (existsSync(join(root, "skills"))) cpSync(join(root, "skills"), join(out, "skills"), { recursive: true });
for (const file of ["LICENSE", "NOTICE"]) cpSync(join(root, file), join(out, file));

// The bin lives next to the bundle so serverEntry() finds index.js by path.
writeFileSync(join(out, "cli.js"), `#!/usr/bin/env node\nprocess.env.OMB_CLI_PREFIX ??= ${JSON.stringify(app.name)};\nawait import("./dist-server/openmausbot.js");\n`);

writeFileSync(
  join(out, "package.json"),
  JSON.stringify(
    {
      name: app.name,
      private: true,
      version: app.version,
      description: "Run the MoMo bot server and pair your devices to it",
      license: "Apache-2.0",
      type: "module",
      bin: { [app.name]: "cli.js" },
      // Never bundled, so npm installs them beside the server: DuckDB and
      // resvg are native addons that npm picks per platform from their
      // optional packages, and the 1Password SDK reads its WebAssembly core
      // from beside itself.
      dependencies: {
        "@1password/sdk": app.dependencies["@1password/sdk"],
        "@duckdb/node-api": app.dependencies["@duckdb/node-api"],
        "@resvg/resvg-js": app.dependencies["@resvg/resvg-js"],
      },
      files: ["cli.js", "dist-server", "dist", "skills", "LICENSE", "NOTICE", "README.md"],
      engines: { node: ">=24" },
      repository: app.repository,
      homepage: app.homepage,
      keywords: ["momobot", "agents", "self-hosted", "server"],
    },
    null,
    2,
  ) + "\n",
);

writeFileSync(
  join(out, "README.md"),
  `# MoMo bot CLI

Requires Node 24+. Install the tarball you built locally:

\`\`\`sh
npm install -g ./momobot-${app.version}.tgz
momobot
\`\`\`

Run \`momobot --help\` for commands. Use \`momobot serve --data-dir <path>\`
to choose the server's data directory explicitly.

Source and documentation: ${app.homepage}
`,
);
