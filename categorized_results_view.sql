-- 1. Drop existing view if it exists (must specify if it was a standard view)
DROP MATERIALIZED VIEW IF EXISTS categorized_results;

-- 2. Create the Materialized View
CREATE MATERIALIZED VIEW categorized_results AS
WITH RankedResults AS (
    SELECT 
        res.*,
        r.name AS rider_name,
        r.gender,
        r.birth_year,
        -- Rank individual races for the "Best of X" calculation
        ROW_NUMBER() OVER (
            PARTITION BY res.rider_id, res.year 
            ORDER BY res.points DESC
        ) as race_rank,
        -- Define the "Best of X" limit for each year
        CASE 
            WHEN res.year = '2025' THEN 4
            WHEN res.year = '2024' THEN 4
            WHEN res.year = '2023' THEN 3
            ELSE 5 
        END as points_limit
    FROM results res
    JOIN riders r ON res.rider_id = r.id
),
AggregatedTotals AS (
    SELECT 
        year,
        rider_id,
        rider_name,
        gender,
        race_time,
        year - birth_year AS age_at_race,
        SUM(points) AS total_points,
        -- Calculate season points based on the "Best of X"
        SUM(CASE WHEN race_rank <= points_limit THEN points ELSE 0 END) AS season_points,
        COUNT(race_id) AS total_races,
        -- Category Label logic
        CASE 
            WHEN (year - birth_year) < 20 THEN 'Under 20'
            WHEN (year - birth_year) BETWEEN 20 AND 29 THEN '20-29'
            WHEN (year - birth_year) BETWEEN 30 AND 39 THEN '30-39'
            WHEN (year - birth_year) BETWEEN 40 AND 49 THEN '40-49'
            WHEN (year - birth_year) BETWEEN 50 AND 59 THEN '50-59'
            WHEN (year - birth_year) BETWEEN 60 AND 69 THEN '60-69'
            WHEN (year - birth_year) BETWEEN 70 AND 74 THEN '70-74'
            WHEN (year - birth_year) BETWEEN 75 AND 79 THEN '75-79'
            WHEN (year - birth_year) >= 80 THEN '80+'
            ELSE 'Unknown'
        END || ' ' || 
        CASE 
            WHEN gender = 'M' THEN 'Men'
            WHEN gender = 'W' THEN 'Women'
            ELSE ''
        END AS category_label
    FROM RankedResults
    GROUP BY 
        year, 
        rider_id, 
        rider_name, 
        gender, 
        birth_year,
        race_time
)
SELECT 
    *,
    -- Calculate Overall Standing Rank per year
    RANK() OVER (
        PARTITION BY year , gender
        ORDER BY season_points DESC
    ) as overall_standing_rank,
    -- Calculate Category Standing Rank per year
    RANK() OVER (
        PARTITION BY year, category_label 
        ORDER BY season_points DESC
    ) as category_standing_rank
FROM AggregatedTotals;

-- 3. Create an index on the materialized view for fast rider lookups
CREATE INDEX idx_categorized_results_rider_id ON categorized_results (rider_id);