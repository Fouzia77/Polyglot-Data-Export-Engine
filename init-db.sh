#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'EOSQL'

CREATE TABLE IF NOT EXISTS records (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  value DECIMAL(18,4) NOT NULL,
  metadata JSONB NOT NULL
);

INSERT INTO records (name, value, metadata)
SELECT
  'Name ' || g,
  random() * 1000,
  jsonb_build_object(
    'city', 'City ' || g,
    'nested', jsonb_build_object('key', g)
  )
FROM generate_series(1, 10000) g;

EOSQL