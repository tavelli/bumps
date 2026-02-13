-- 1. Drop existing view if it exists
DROP VIEW IF EXISTS event_participation_stats;

CREATE OR REPLACE VIEW event_participation_stats AS
SELECT 
    event_slug,
    rider_id,
    rider_name,
    COUNT(*) as appearance_count,
    SUM(points) as total_event_points,
    -- New: The most recent year they competed in this event
    MAX(year) as most_recent_appearance,
    -- Wins logic
    COUNT(*) FILTER (WHERE overall_rank = 1) as overall_wins,
    COUNT(*) FILTER (WHERE category_rank = 1) as category_wins
FROM rider_race_history
GROUP BY event_slug, rider_id, rider_name;