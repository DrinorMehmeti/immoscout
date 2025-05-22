/*
  # Property View Statistics Functions

  1. Changes
    - Drop and recreate get_property_view_stats function
    - Drop and recreate get_property_with_view_stats function
    
  2. Description
    These functions provide statistics about property views, including:
    - Total views
    - Unique viewers
    - Views in the last 24 hours and 7 days
    - Daily view counts over a specified period
    - Current viewers (estimated)
    
    The get_property_with_view_stats function returns a single property with basic view stats.
*/

-- First, drop existing functions if they exist
DROP FUNCTION IF EXISTS get_property_view_stats(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_property_with_view_stats(UUID);

-- Function to get property view statistics
CREATE OR REPLACE FUNCTION get_property_view_stats(
  property_id_param UUID,
  days_param INTEGER DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
  total_views INTEGER;
  unique_viewers INTEGER;
  views_last_day INTEGER;
  views_last_week INTEGER;
  views_by_day JSON;
  current_viewers INTEGER;
  result JSON;
BEGIN
  -- Calculate date ranges
  -- Get total views
  SELECT COUNT(*) INTO total_views
  FROM property_views
  WHERE property_id = property_id_param;
  
  -- Get unique viewers
  SELECT COUNT(DISTINCT viewer_id) INTO unique_viewers
  FROM property_views
  WHERE 
    property_id = property_id_param 
    AND viewer_id IS NOT NULL;
  
  -- Get views in last 24 hours
  SELECT COUNT(*) INTO views_last_day
  FROM property_views
  WHERE 
    property_id = property_id_param 
    AND viewed_at > NOW() - INTERVAL '1 day';
  
  -- Get views in last 7 days
  SELECT COUNT(*) INTO views_last_week
  FROM property_views
  WHERE 
    property_id = property_id_param 
    AND viewed_at > NOW() - INTERVAL '7 days';
  
  -- Get views grouped by day for the past N days
  WITH days AS (
    SELECT generate_series(
      CURRENT_DATE - (days_param - 1) * INTERVAL '1 day',
      CURRENT_DATE,
      INTERVAL '1 day'
    )::date AS day
  ),
  daily_counts AS (
    SELECT 
      DATE_TRUNC('day', viewed_at)::date AS day,
      COUNT(*) AS count
    FROM property_views
    WHERE 
      property_id = property_id_param 
      AND viewed_at > CURRENT_DATE - (days_param * INTERVAL '1 day')
    GROUP BY 1
  )
  SELECT json_agg(
    json_build_object(
      'date', TO_CHAR(d.day, 'YYYY-MM-DD'),
      'count', COALESCE(dc.count, 0)
    )
    ORDER BY d.day
  ) INTO views_by_day
  FROM days d
  LEFT JOIN daily_counts dc ON d.day = dc.day;

  -- Simulate current viewers
  -- In a real implementation, we would use our current_viewers table
  -- but for simplicity, let's estimate based on recent views
  SELECT COUNT(*) INTO current_viewers
  FROM property_views
  WHERE 
    property_id = property_id_param 
    AND viewed_at > NOW() - INTERVAL '10 minutes';
  
  -- Build final result
  result := json_build_object(
    'total_views', total_views,
    'unique_viewers', unique_viewers,
    'views_last_day', views_last_day,
    'views_last_week', views_last_week,
    'daily_views', views_by_day,
    'current_viewers', current_viewers
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get a single property with basic view stats
CREATE OR REPLACE FUNCTION get_property_with_view_stats(p_property_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price NUMERIC,
  location TEXT,
  type TEXT,
  listing_type TEXT,
  total_views BIGINT,
  views_today BIGINT,
  current_viewers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, 
    p.title, 
    p.price, 
    p.location, 
    p.type, 
    p.listing_type,
    COUNT(pv.id) AS total_views,
    COUNT(pv.id) FILTER (WHERE pv.viewed_at > CURRENT_DATE) AS views_today,
    (SELECT COUNT(*) 
     FROM property_views 
     WHERE property_id = p.id AND viewed_at > NOW() - INTERVAL '15 minutes') AS current_viewers
  FROM 
    properties p
  LEFT JOIN
    property_views pv ON p.id = pv.property_id
  WHERE 
    p.id = p_property_id
  GROUP BY
    p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;