---
title: "Petrol Stations"
description: "A list of petrol stations in Dundee"
query: |
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  (
    nwr["amenity"="fuel"](area.searchArea);
  );

  out center;
---
