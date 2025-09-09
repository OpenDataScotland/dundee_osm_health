# Dundee OSM Health

A web application that helps identify and improve the quality of OpenStreetMap data in Dundee. The tool visualizes the completeness of place data (cafes, supermarkets, etc.) and provides an interactive way to discover places that need updating.

You can see the site at <https://osm.dundee.opendata.scot/>.

## Features

- **Interactive Map**: Visualize places across Dundee with colour-coded markers indicating data quality
- **Quality Assessment**: Evaluate completeness of name, address, and opening hours data
- **Category Filtering**: Switch between different place reports (cafes, supermarkets, etc.)
- **Smart Place Picker**: Randomly select places with missing data to visit and update
- **Summary Statistics**: View overall data quality metrics for each category
- **Direct OSM Editing**: Quick links to edit places directly in OpenStreetMap
- **Mobile-Friendly**: Responsive design that works on all devices

## 🗺️ Data Quality Indicators

These are currently fixed but will be dynamic per report type

- **🟢 Green**: Complete data (name, address, and opening hours)
- **🟠 Orange**: Partial data (missing 1-2 fields)
- **🔴 Red**: Missing data (missing 2-3 fields)

## Getting Started

### Prerequisites

- Node.js (for the Cloudflare Worker)
- Ruby and Jekyll (for the static site)

### Installation

<!-- TODO: Need to add dev vs. prod config for site and API url endpoints -->

1. **Clone the repository**

   ```bash
   git clone https://github.com/opendatascotland/dundee_osm_health.git
   cd dundee_osm_health
   ```

2. **Set up the Cloudflare Worker**

   ```bash
   cd osm-dundee-worker
   npm install
   ```

3. **Run the worker**

   ```bash
   npx wrangler dev
   ```

4. **Set up the static site**

   ```bash
   cd site
   bundle install
   ```

5. **Run the development server**

   ```bash
   bundle exec jekyll serve
   ```

The application will be available at `http://localhost:4000`

## How It Works

### Frontend (Jekyll Site)

- Uses Leaflet.js for interactive mapping
- Custom legend control with toggle functionality
- Responsive design with mobile-first approach
- Real-time data filtering and visualization

### Backend (Cloudflare Worker)

- Fetches data from OpenStreetMap Overpass API
- Processes and filters place data for Dundee
- Returns JSON data for frontend consumption
- Handles different place categories (cafes, supermarkets, etc.)
- TODO: Caches data from OpenStreetMap Overpass API

### Data Quality Assessment

The application evaluates three key data fields at the moment:

1. **Name**: Presence of a proper business name
2. **Address**: Complete address (street, house number/unit/housename, postcode)
3. **Opening Hours**: Business operating hours

## Usage

### Basic Navigation

1. **Select a Category**: Use the tabs at the top to switch between different place type reports
2. **View the Map**: See colour-coded markers indicating data quality
3. **Use the Legend**: Toggle the legend to understand marker colours and filter options

### Finding Places to Update

1. **Click "Pick a place to visit and update"**: The button below the map will randomly select a place with missing data
2. **Review Details**: The selected place will be highlighted and its details shown
3. **Visit and Update**: Use the "Update this" link to edit the place in OpenStreetMap

### Filtering Options

- **Hide Incomplete**: Toggle to show only places with complete data
- **Legend Toggle**: Collapse/expand the legend on mobile devices

## Configuration

### Adding New Categories

Create a new report `.md` file in `site/_reports/` with the following schema:

```yaml
---
title: "Cafes" # Your report name - determines the name of the tab in the app
description: "A list of cafes in Dundee" # A description of what the report pulls
query: | # An Overpass API query
  [out:json][timeout:25];

  // Fetch the Dundee area
  area["name"="Dundee City"]["admin_level"="6"]->.searchArea;

  // Find all cafes within the Dundee area
  (
    node["amenity"="cafe"](area.searchArea);
    way["amenity"="cafe"](area.searchArea);
    relation["amenity"="cafe"](area.searchArea);
  );

  out center;
---
```

### Customizing the Map

- Modify the center coordinates in `site/index.html`
- Adjust zoom levels and tile layers as needed
- Customize marker icons and colours

## Data Sources

- **OpenStreetMap**: Primary data source via Overpass API
- **Geographic Scope**: Dundee, Scotland
- **Update Frequency**: Real-time via API calls to Overpass API
