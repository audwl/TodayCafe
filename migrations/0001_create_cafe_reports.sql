CREATE TABLE IF NOT EXISTS cafe_reports (
  cafe_id TEXT NOT NULL,
  reporter_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('여유', '보통', '혼잡')),
  reported_at INTEGER NOT NULL,
  PRIMARY KEY (cafe_id, reporter_id)
);

CREATE INDEX IF NOT EXISTS idx_cafe_reports_recent
  ON cafe_reports (cafe_id, reported_at DESC);
