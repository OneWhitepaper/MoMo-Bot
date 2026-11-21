export const TEAM_LIBRARY_REPOSITORY_ENV = "OMB_TEAM_LIBRARY_REPOSITORY";

export function teamLibrarySource(env: NodeJS.ProcessEnv = process.env) {
  const input = env[TEAM_LIBRARY_REPOSITORY_ENV]?.trim() ?? "";
  const match = /^https:\/\/github\.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/?$/.exec(input);
  if (!match) return null;
  const [, owner, repo] = match;
  const repositoryUrl = `https://github.com/${owner}/${repo}`;
  return { repositoryUrl, rawRoot: `https://raw.githubusercontent.com/${owner}/${repo}/main`, uploadUrl: `${repositoryUrl}/upload/main/teams` };
}
