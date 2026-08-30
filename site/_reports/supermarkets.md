---
title: "Supermarkets"
description: "A list of supermarkets in Dundee"
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
      supermarkets.osm_id,
      supermarkets.osm_type,
      supermarkets.tags,
      supermarkets.geom
  FROM postpass_pointpolygon AS supermarkets
  CROSS JOIN dundee
  WHERE
      supermarkets.tags @> '{"shop": "supermarket"}'::jsonb
      AND supermarkets.geom && dundee.geom
      AND ST_Intersects(supermarkets.geom, dundee.geom)
---
