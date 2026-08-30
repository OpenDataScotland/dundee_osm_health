---
title: "Restaurants"
description: "A list of restaurants in Dundee"
query: |
  WITH dundee AS (
      SELECT geom
      FROM postpass_polygon
      WHERE
          osm_type = 'R'
          AND tags @> '{
              "boundary": "administrative",
              "admin_level": "6",
              "name": "Dundee City"
          }'::jsonb
  )
  SELECT
      restaurants.osm_id,
      restaurants.osm_type,
      restaurants.tags,
      restaurants.geom
  FROM postpass_pointpolygon AS restaurants
  CROSS JOIN dundee
  WHERE
      restaurants.tags @> '{"amenity": "restaurant"}'::jsonb
      AND restaurants.geom && dundee.geom
      AND ST_Intersects(restaurants.geom, dundee.geom)
---
