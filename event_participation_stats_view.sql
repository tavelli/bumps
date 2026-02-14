-- 1. Drop existing view if it exists
DROP VIEW IF EXISTS event_participation_stats;

CREATE OR REPLACE VIEW event_participation_stats AS
SELECT 
    event_slug,
    rider_id,
    rider_name,
    birth_year,
    COUNT(*) as appearance_count,
    SUM(points) as total_event_points,
    MAX(year) as most_recent_appearance,
    -- The oldest age they were while competing in this event
    (MAX(year) - birth_year) as max_age_attained,
    -- The youngest age they were when they first did this event
    (MIN(year) - birth_year) as min_age_attained,
    COUNT(*) FILTER (WHERE overall_rank = 1) as overall_wins,
    COUNT(*) FILTER (WHERE category_rank = 1) as category_wins
FROM rider_race_history
GROUP BY event_slug, rider_id, rider_name, birth_year;