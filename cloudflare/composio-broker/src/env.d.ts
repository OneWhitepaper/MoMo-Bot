interface Env {
  COMPOSIO_WEBHOOK_SECRET?: string;
  CLOUD_GRANT_SECRET?: string;
  STATS_TOKEN?: string;
  /** Origin of the operator's Cloud Admin service for waking sleeping Clouds. */
  CLOUD_ADMIN_URL?: string;
}
