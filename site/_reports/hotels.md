---
title: "Hotels"
description: "A list of hotels in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    nwr["tourism"="hotel"](area.searchArea);
  );

  out center;
---
