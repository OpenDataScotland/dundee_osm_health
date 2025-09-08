---
title: "Restaurants"
description: "A list of restaurants in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    node["amenity"="restaurant"](area.searchArea);
    way["amenity"="restaurant"](area.searchArea);
    relation["amenity"="restaurant"](area.searchArea);
  );

  out center;
---
