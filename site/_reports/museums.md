---
title: "Museums"
description: "A list of museums in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    nwr["tourism"="museum"](area.searchArea);
  );

  out center;
---
