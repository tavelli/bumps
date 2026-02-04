DROP VIEW IF EXISTS category_leaders;

CREATE OR REPLACE VIEW category_leaders AS
-- 1. Get Top 3 Overall Men and Women
SELECT 
    year,
    'Overall ' || (CASE WHEN gender = 'M' THEN 'Men' ELSE 'Women' END) AS category_display,
    overall_standing_rank AS rank,
    rider_name,
    season_points,
    rider_id
FROM categorized_results
WHERE overall_standing_rank <= 3

UNION ALL

-- 2. Get Top 3 for each Age Category
SELECT 
    year,
    category_label AS category_display,
    category_standing_rank AS rank,
    rider_name,
    season_points,
    rider_id
FROM categorized_results
WHERE category_standing_rank <= 3

ORDER BY year DESC, category_display ASC, rank ASC;