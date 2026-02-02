-- 1. Drop existing view if it exists
DROP MATERIALIZED VIEW IF EXISTS event_race_details;

-- 2. Create the Materialized View
CREATE MATERIALIZED VIEW event_race_details AS
SELECT 
    e.id AS event_id,
    e.slug AS event_slug,
    e.name AS event_name,
    ra.id AS race_id,
    ra.event_date AS race_date,
    ra.year AS race_year
FROM events e
JOIN races ra ON e.id = ra.event_id;

-- 3. Create an index for fast lookups by event_id
CREATE INDEX idx_erd_event_id ON event_race_details (event_slug);

-- 4. Unique index for concurrent refreshes
CREATE UNIQUE INDEX idx_erd_unique_race ON event_race_details (race_id);