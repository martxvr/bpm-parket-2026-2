-- Track which Facebook post (or other external source) a project was imported from.
-- Enables idempotent re-imports via UNIQUE constraint on source_post_id.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_post_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_source_post_id
  ON projects(source_post_id)
  WHERE source_post_id IS NOT NULL;
