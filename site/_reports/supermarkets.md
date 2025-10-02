---
title: "Supermarkets"
description: "A list of supermarkets in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    nwr["shop"="supermarket"](area.searchArea);
    way["shop"="convenience"](area.searchArea);
  );

  out center;
---
