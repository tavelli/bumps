DROP MATERIALIZED VIEW IF EXISTS rider_race_history;

CREATE MATERIALIZED VIEW rider_race_history AS
WITH BaseData AS (
    SELECT 
        res.year,
        res.rider_id,
        res.race_id,
        res.points,
        res.race_time,
        r.name as rider_name,
        r.birth_year,
        r.gender,
        e.name as event_name,
        e.slug as event_slug,
        ra.event_date as race_date,
        -- Define the bucket ID once for consistency
        CASE 
            WHEN (res.year - r.birth_year) < 20 THEN 1
            WHEN (res.year - r.birth_year) BETWEEN 20 AND 29 THEN 2
            WHEN (res.year - r.birth_year) BETWEEN 30 AND 39 THEN 3
            WHEN (res.year - r.birth_year) BETWEEN 40 AND 49 THEN 4
            WHEN (res.year - r.birth_year) BETWEEN 50 AND 59 THEN 5
            WHEN (res.year - r.birth_year) BETWEEN 60 AND 69 THEN 6
            WHEN (res.year - r.birth_year) BETWEEN 70 AND 74 THEN 7
            WHEN (res.year - r.birth_year) BETWEEN 75 AND 79 THEN 8
            WHEN (res.year - r.birth_year) >= 80 THEN 9
            ELSE 0
        END as age_group_id,
        -- Human Readable Label
        CASE 
            WHEN (res.year - r.birth_year) < 20 THEN 'Under 20'
            WHEN (res.year - r.birth_year) BETWEEN 20 AND 29 THEN '20-29'
            WHEN (res.year - r.birth_year) BETWEEN 30 AND 39 THEN '30-39'
            WHEN (res.year - r.birth_year) BETWEEN 40 AND 49 THEN '40-49'
            WHEN (res.year - r.birth_year) BETWEEN 50 AND 59 THEN '50-59'
            WHEN (res.year - r.birth_year) BETWEEN 60 AND 69 THEN '60-69'
            WHEN (res.year - r.birth_year) BETWEEN 70 AND 74 THEN '70-74'
            WHEN (res.year - r.birth_year) BETWEEN 75 AND 79 THEN '75-79'
            WHEN (res.year - r.birth_year) >= 80 THEN '80+'
            ELSE 'Unknown'
        END as age_group_label
    FROM results res
    JOIN riders r ON res.rider_id = r.id
    JOIN races ra ON res.race_id = ra.id
    JOIN events e ON ra.event_id = e.id
)
SELECT 
    *,
    -- Overall Rank (Within Gender/Race context)
    RANK() OVER (PARTITION BY race_id, gender ORDER BY race_time ASC) as overall_rank,
    
    -- Category Rank (Within Age Group/Gender/Race context)
    RANK() OVER (PARTITION BY race_id, gender, age_group_id ORDER BY race_time ASC) as category_rank,
    
    -- Field Sizes
    COUNT(*) OVER (PARTITION BY race_id, gender) as overall_total,
    COUNT(*) OVER (PARTITION BY race_id, gender, age_group_id) as category_total,
    
    -- Final Label String
    age_group_label || ' ' || (CASE WHEN gender = 'M' THEN 'Men' WHEN gender = 'W' THEN 'Women' ELSE '' END) as category_label
FROM BaseData;

CREATE INDEX idx_rider_history_rider_id 
ON rider_race_history (rider_id);

-- Index for showing all riders in a specific race, ordered by their finish position
CREATE INDEX idx_rrh_race_lookup 
ON rider_race_history (race_id, overall_rank ASC);