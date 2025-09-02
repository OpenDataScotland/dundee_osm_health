---
title: "Supermarkets"
description: "A list of supermarkets in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    node["amenity"="pub"](area.searchArea);
    way["amenity"="pub"](area.searchArea);
    relation["amenity"="pub"](area.searchArea);
  );

  out center;
---
