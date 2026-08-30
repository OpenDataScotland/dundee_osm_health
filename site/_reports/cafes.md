---
title: "Cafes"
description: "A list of cafes in Dundee"
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
      cafes.osm_id,
      cafes.osm_type,
      cafes.tags,
      cafes.geom
  FROM postpass_pointpolygon AS cafes
  CROSS JOIN dundee
  WHERE
      cafes.tags @> '{"amenity": "cafe"}'::jsonb
      AND cafes.geom && dundee.geom
      AND ST_Intersects(cafes.geom, dundee.geom)
---
