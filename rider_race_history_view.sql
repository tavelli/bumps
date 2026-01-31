DROP VIEW IF EXISTS rider_race_history;

CREATE VIEW rider_race_history AS
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
        ra.event_date as race_date
    FROM results res
    JOIN riders r ON res.rider_id = r.id
    JOIN races ra ON res.race_id = ra.id
    JOIN events e ON ra.event_id = e.id
)
SELECT * FROM RaceRankings;