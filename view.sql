CREATE OR REPLACE VIEW categorized_results AS
SELECT 
    res.id AS result_id,
    res.year,
    res.points,
    res.race_id,
    res.rider_id,
    r.name AS rider_name,
    r.gender,
    res.year - r.birth_year AS age_at_race,
    -- Determine the Category Label
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
    END || ' ' || 
    CASE 
        WHEN r.gender = 'M' THEN 'Men'
        WHEN r.gender = 'F' THEN 'Women'
        ELSE ''
    END AS category_label
FROM results res
JOIN riders r ON res.rider_id = r.id;