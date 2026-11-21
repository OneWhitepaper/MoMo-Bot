# MoMo bot documentation

Documentation lives in `content/docs` in this Next.js and Fumadocs app. The repository's top-level `docs` folder holds design, development, and verification notes.

From the repository root, run:

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
```

Open `http://localhost:3000`. To verify changes, run:

```bash
pnpm --filter @openmausbot/docs types:check
pnpm --filter @openmausbot/docs lint
pnpm docs:build
```

The changelog reads non-prerelease builds from `OneWhitepaper/MoMo-Bot` and caches them for five minutes. Set `GITHUB_RELEASES_TOKEN` in the docs server environment only if needed for repository access or API limits.

To host the site, set the project root to `apps/docs`. Set `MOMO_DOCS_URL` to the actual site origin if you want a sitemap and absolute link previews. A local build needs no public domain.
