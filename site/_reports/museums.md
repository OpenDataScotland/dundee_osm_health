---
title: "Museums"
description: "A list of museums in Dundee"
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
      museums.osm_id,
      museums.osm_type,
      museums.tags,
      museums.geom
  FROM postpass_pointpolygon AS museums
  CROSS JOIN dundee
  WHERE
      museums.tags @> '{"tourism": "museum"}'::jsonb
      AND museums.geom && dundee.geom
      AND ST_Intersects(museums.geom, dundee.geom)
---
