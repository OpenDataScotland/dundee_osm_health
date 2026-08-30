---
title: "Hotels"
description: "A list of hotels in Dundee"
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
      hotels.osm_id,
      hotels.osm_type,
      hotels.tags,
      hotels.geom
  FROM postpass_pointpolygon AS hotels
  CROSS JOIN dundee
  WHERE
      hotels.tags @> '{"tourism": "hotel"}'::jsonb
      AND hotels.geom && dundee.geom
      AND ST_Intersects(hotels.geom, dundee.geom)
---
