/*
  # Create function to get property view counts

  1. New Functions
    - `get_property_view_counts` - Returns the count of views for each property
*/

-- Drop the function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS get_property_view_counts();

-- Create the function to get view counts for all properties
CREATE OR REPLACE FUNCTION get_property_view_counts()
RETURNS TABLE (
  property_id UUID,
  view_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    property_id, 
    COUNT(*) as view_count
  FROM 
    property_views
  GROUP BY 
    property_id
  ORDER BY 
    view_count DESC;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_property_view_counts() TO authenticated;