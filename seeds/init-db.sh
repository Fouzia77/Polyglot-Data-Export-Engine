#!/bin/bash
set -e

psql -U user -d exports_db <<EOSQL

CREATE TABLE IF NOT EXISTS records (
 id BIGSERIAL PRIMARY KEY,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 name VARCHAR(255) NOT NULL,
 value DECIMAL(18,4) NOT NULL,
 metadata JSONB NOT NULL
);

INSERT INTO records (name,value,metadata)
SELECT
 'name_' || gs,
 random()*1000,
 jsonb_build_object(
  'city','city_'||(gs % 100),
  'country','country_'||(gs % 50)
 )
FROM generate_series(1,10000000) gs;

EOSQL