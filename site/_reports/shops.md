---
title: "Shops"
description: "A list of shops in Dundee"
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
      shops.osm_id,
      shops.osm_type,
      shops.tags,
      shops.geom
  FROM postpass_pointpolygon AS shops
  CROSS JOIN dundee
  WHERE
      shops.tags ? 'shop'
      AND shops.geom && dundee.geom
      AND ST_Intersects(shops.geom, dundee.geom)
---
