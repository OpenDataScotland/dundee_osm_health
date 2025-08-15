---
title: "Supermarkets"
description: "A list of supermarkets in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    node["shop"="supermarket"](area.searchArea);
    way["shop"="supermarket"](area.searchArea);
    relation["shop"="supermarket"](area.searchArea);
  );

  out center;
---
