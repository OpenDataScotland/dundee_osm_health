---
title: "Pubs"
description: "A list of pubs in Dundee"
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
      pubs.osm_id,
      pubs.osm_type,
      pubs.tags,
      pubs.geom
  FROM postpass_pointpolygon AS pubs
  CROSS JOIN dundee
  WHERE
      pubs.tags @> '{"amenity": "pub"}'::jsonb
      AND pubs.geom && dundee.geom
      AND ST_Intersects(pubs.geom, dundee.geom)
---
