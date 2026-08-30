---
title: "Petrol Stations"
description: "A list of petrol stations in Dundee"
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
      petrol_stations.osm_id,
      petrol_stations.osm_type,
      petrol_stations.tags,
      petrol_stations.geom
  FROM postpass_pointpolygon AS petrol_stations
  CROSS JOIN dundee
  WHERE
      petrol_stations.tags @> '{"amenity": "fuel"}'::jsonb
      AND petrol_stations.geom && dundee.geom
      AND ST_Intersects(petrol_stations.geom, dundee.geom)
---
