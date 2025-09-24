---
title: "Shops"
description: "A list of shops in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  // Find all cafes within the Dundee area
  (
    node["shop"](area.searchArea);
    way["shop"](area.searchArea);
    relation["shop"](area.searchArea);
  );

  out center;
---
