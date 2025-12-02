# Missing Pieces: Understanding Overdoses Beyond the Statistics

An interactive data visualization website exploring the global overdose crisis through statistics, personal stories, and community solutions.

## Table of Contents
- [Description](#description)
- [How to Run](#how-to-run)
- [Libraries and Dependencies](#libraries-and-dependencies)
- [Project Structure](#project-structure)
- [Features](#features)
- [Data Sources](#data-sources)
- [Browser Requirements](#browser-requirements)

## Description

This project is an interactive scrolling website that presents overdose data through multiple visualization techniques including choropleth maps, line charts, bubble charts, Sankey diagrams, and interactive quizzes. The site combines quantitative data with qualitative storytelling to provide a comprehensive understanding of the overdose crisis.

## How to Run

This is a client-side web application with no build process required. All dependencies are loaded via CDN.

### Option 1: Open Directly in Browser
Simply double-click `index.html` to open it in your default web browser.

### Option 2: Use a Local Server (Recommended)
To avoid potential issues when loading data files and iframes, use a local development server:

#### Using VS Code Live Server:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Libraries and Dependencies

All libraries are loaded via CDN (no installation required):

### Core Visualization Library
- **D3.js v7** (`https://d3js.org/d3.v7.min.js`)
  - Used for all data visualizations including charts, maps, and interactive elements
  - Powers: bar charts, line charts, bubble charts, choropleth maps, Sankey diagrams

### Supporting Libraries
- **TopoJSON Client v3** (`https://cdn.jsdelivr.net/npm/topojson-client@3`)
  - Converts TopoJSON files to GeoJSON for map rendering
  - Used in: US choropleth map, global map visualizations

- **D3-Sankey v0.12.3** (`https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js`)
  - Creates flow diagrams showing the prescription opioid pipeline
  - Used in: Section 9 (Addiction Pipeline)

### Native Browser APIs
- **Intersection Observer API** - Triggers animations when sections scroll into view
- **HTML5 Audio API** - Plays personal story audio clips with synchronized transcripts
- **CSS Scroll Snap** - Provides smooth section-to-section scrolling

## Project Structure

```
cs171_final_project/
│
├── index.html                  # Main HTML file with all sections
├── styles.css                  # Global styles and section-specific CSS
├── script.js                   # Navigation, scroll indicators, audio controls
├── README.md                   # This file
│
├── data/                       # All datasets and media files
│   ├── overdose_rates.csv
│   ├── overdose_rates_us.csv
│   ├── naloxone_distribution.csv
│   ├── DOSE_SyS_Dashboard_Download_10-23-2025 - Overall.csv
│   ├── jonathans_story.mp3
│   ├── sofias_story.mp3
│   ├── jakes_story.mp3
│   └── *.png                   # Story images
│
└── visualizations/             # Modular visualization components
    ├── hero-typewriter/
    │   └── herotypewriter.js
    ├── global-bar-chart.js
    ├── drug-quiz/
    │   └── drug-quiz.js
    ├── us-choropleth/
    │   └── us-overdose-map.js
    ├── age-line-chart/
    │   └── age-line-chart.js
    ├── employment-addiction/
    │   └── employment-addiction.js
    ├── stories/
    │   └── stories.js
    ├── drug-types-bubbles/
    │   └── drug-bubble-chart.js
    ├── sankey-addiction-pipeline/
    │   └── addiction-pipeline.js
    ├── naloxone-quiz/
    │   └── naloxonequiz.js
    ├── info-on-naloxone/
    │   └── info-on-naloxone.js
    ├── naloxone-distribution/
    │   └── bar-and-line-graph.js
    └── solution-in-focus/
        └── solution-in-focus.html
```

## Features

### Interactive Visualizations
- **Global Bar Chart** - Top countries by overdose death rates
- **Interactive World Map** - Explore overdose rates by country
- **US Choropleth Map** - State-by-state overdose statistics
- **Age Group Line Chart** - Trends over time by demographic
- **Industry Bubble Chart** - Substance use patterns across professions
- **Drug Type Bubbles** - Substances driving the crisis
- **Sankey Diagram** - Prescription opioid pipeline flow
- **Naloxone Distribution Charts** - Bar and line graphs showing naloxone access

### Interactive Elements
- **Knowledge Quizzes** - Test understanding of drug use statistics and naloxone awareness
- **Audio Stories** - Personal narratives with synchronized transcripts
- **Story Gallery** - Navigate through multiple personal accounts
- **Solutions Map** - Community programs making an impact

### Navigation
- **Smooth Scrolling** - Snap-to-section behavior for seamless transitions
- **Scroll Indicators** - 14 dots on the right side for quick section jumping
- **Keyboard Navigation** - Arrow keys to move between sections
- **Responsive Design** - Adapts to different screen sizes


## Data Sources

- **World Health Organization (WHO)** - Global overdose statistics
- **Centers for Disease Control and Prevention (CDC)** - US overdose data
- **National Institutes of Health (NIH)** - Research data and treatment statistics
- **Global Drug Observatory** - International drug use patterns
- **SAMHSA** - Substance use and mental health data


## Credits

**Course:** CS171 - Visualization  
**Project:** Final Project  
**Theme:** Missing Pieces: Understanding Overdoses Beyond the Statistics  
**Developed by:** Sahana Thayagabalu, Carolyn Dorantes, Kathrine Alderete

---

For questions or issues, please refer to the course materials or contact the development team.
