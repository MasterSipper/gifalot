// Get version from environment variable (set at build time) or use default
// This allows version to be updated via REACT_APP_VERSION env var
export const getVersion = () => {
  // Use REACT_APP_VERSION if set, otherwise default to package version
  // Format: "0.1.0" -> "v0.1.0"
  const version = process.env.REACT_APP_VERSION || '1.0.8';
  return `v${version}`;
};

// Get build date (set at build time via REACT_APP_BUILD_DATE)
export const getBuildDate = () => {
  return process.env.REACT_APP_BUILD_DATE || new Date().toISOString().split('T')[0];
};

// Get git commit hash (set at build time via REACT_APP_GIT_COMMIT)
export const getGitCommit = () => {
  const commit = process.env.REACT_APP_GIT_COMMIT;
  return commit ? commit.substring(0, 7) : null;
};

// Get full version string
export const getFullVersion = () => {
  const version = getVersion();
  const commit = getGitCommit();
  return commit ? `${version} (${commit})` : version;
};

