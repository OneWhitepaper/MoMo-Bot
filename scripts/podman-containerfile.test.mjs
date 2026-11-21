import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const buildCopies = (text) =>
  [...text.matchAll(/^COPY --from=build (?:--chown=\S+ )?(\S+) (\S+)$/gm)].map(([, from, to]) => `${from} ${to}`);

describe("Podman image build", () => {
  it("ships the bundled skills, as the Docker server image does", () => {
    const dockerfile = read("../Dockerfile");
    const base = /^FROM (\S+) AS server$/m.exec(dockerfile)?.[1];
    expect(base).toBe("server-files");
    const server = dockerfile.split(/^FROM server-base AS server-files$/m)[1]?.split(/^FROM /m)[0];
    expect(server).toBeDefined();
    expect(buildCopies(server)).toContain("/src/skills ./skills");
    expect(buildCopies(read("../deploy/podman/Containerfile"))).toContain("/src/skills ./skills");
  });
});
