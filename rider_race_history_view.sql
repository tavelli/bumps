-- 1. Drop existing view
DROP MATERIALIZED VIEW IF EXISTS rider_race_history;

-- 2. Create the Materialized View
CREATE MATERIALIZED VIEW rider_race_history AS
WITH RaceRankings AS (
    SELECT 
        res.year,
        res.rider_id,
        res.race_id,
        res.points,
        -- Ranks
        RANK() OVER (
            PARTITION BY res.race_id 
            ORDER BY res.points DESC
        ) as overall_rank,
        RANK() OVER (
            PARTITION BY res.race_id, (res.year - r.birth_year), r.gender 
            ORDER BY res.points DESC
        ) as category_rank,
        -- Total Field Counts
        COUNT(*) OVER (
            PARTITION BY res.race_id, r.gender
        ) as overall_total,
        COUNT(*) OVER (
            PARTITION BY res.race_id, (res.year - r.birth_year), r.gender
        ) as category_total,
        
        -- Rider Details
        r.name as rider_name,
        r.birth_year,
        r.gender,
        -- Event and Race Details
        e.name as event_name,
        e.slug as event_slug,
        ra.event_date as race_date,
        -- Category Label logic
        CASE 
            WHEN (res.year - birth_year) < 20 THEN 'Under 20'
            WHEN (res.year - birth_year) BETWEEN 20 AND 29 THEN '20-29'
            WHEN (res.year - birth_year) BETWEEN 30 AND 39 THEN '30-39'
            WHEN (res.year - birth_year) BETWEEN 40 AND 49 THEN '40-49'
            WHEN (res.year - birth_year) BETWEEN 50 AND 59 THEN '50-59'
            WHEN (res.year - birth_year) BETWEEN 60 AND 69 THEN '60-69'
            WHEN (res.year - birth_year) BETWEEN 70 AND 74 THEN '70-74'
            WHEN (res.year - birth_year) BETWEEN 75 AND 79 THEN '75-79'
            WHEN (res.year - birth_year) >= 80 THEN '80+'
            ELSE 'Unknown'
        END || ' ' || 
        CASE 
            WHEN gender = 'M' THEN 'Men'
            WHEN gender = 'W' THEN 'Women'
            ELSE ''
        END AS category_label
    FROM results res
    JOIN riders r ON res.rider_id = r.id
    JOIN races ra ON res.race_id = ra.id
    JOIN events e ON ra.event_id = e.id
)
SELECT * FROM RaceRankings;

CREATE INDEX idx_rider_history_rider_id 
ON rider_race_history (rider_id);

-- Index for showing all riders in a specific race, ordered by their finish position
CREATE INDEX idx_rrh_race_lookup 
ON rider_race_history (race_id, overall_rank ASC);