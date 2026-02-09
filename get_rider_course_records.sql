CREATE OR REPLACE FUNCTION get_rider_course_records(target_rider_id INTEGER)
RETURNS TABLE (
  out_event_slug TEXT,
  out_race_time INTERVAL,
  out_event_name TEXT, -- Renamed to out_event_name for clarity
  out_year INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ranked_history.event_slug, 
    ranked_history.race_time, 
    ranked_history.event_name, -- This now exists!
    ranked_history.year
  FROM (
    SELECT 
      rh.event_slug, 
      rh.rider_id, 
      rh.race_time, 
      rh.year,
      rh.event_name, -- Added this line inside the subquery
      RANK() OVER (PARTITION BY rh.event_slug, rh.gender ORDER BY rh.race_time ASC) as rank
    FROM rider_race_history rh
  ) ranked_history
  WHERE ranked_history.rider_id = target_rider_id 
    AND ranked_history.rank = 1;
END;
$$;