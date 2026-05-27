# Dunn Travels - Journeys of Caroline & Paul Dunn

An interactive, high-fidelity spatiotemporal travel log visualizing global journeys outside of their home base in Atlanta, Georgia. This full-stack React and Leaflet-powered application preserves travel check-ins with precise timestamps and geodetic measurements, styled using an elegant **Geometric Balance** design.

Developed with modern **React**, **TypeScript**, **Tailwind CSS**, and **Leaflet Vector Maps**.

---

## 🗺️ Key Features

* **Interactive Timeline Matrix**: Select any year from 2010 to 2026 to see all travel points visited during that timeframe.
* **Professional Blue Oceans Bathymetry**: Custom tile presets (including high-contrast Voyager Blue and World Bathymetry layers) to make landmasses and blue oceans look distinct and clean.
* **Live Route Playback**: Animated vector trajectory polylines that pulse and flow sequentially between destinations.
* **Geodetic Distance Tracker**: Automated calculation of the geodetic distance from the home coordinate base (Atlanta, GA) to every destination using the high-accuracy Haversine formula.
* **Rich Year-By-Year Analytics**: Real-time stats computing total year mileage, furthest travel point from base, peak travel range, and most visited cities.

---

## 🛠️ Technology Stack

* **Front-End Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build System**: [Vite](https://vitejs.dev/)
* **Vector Map Rendering**: [Leaflet](https://leafletjs.com/) with custom HTML coordinate markers
* **Animation & Micro-Transitions**: [Lucide Icons](https://lucide.dev/) for crisp geometric iconography
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) utilizing premium typography pairing (**Inter** + **JetBrains Mono** font family scaling)

---

## 📦 Getting Started & Installation

Follow these steps to run the application locally in development mode or compile it for production:

### 1. Clone & Set Up Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
# Clone the repository
git clone https://github.com/your-username/dunn-travels.git
cd dunn-travels

# Install required dependencies
npm install
```

### 2. Live Development Server
To launch the interactive workspace locally with live reload capabilities:

```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### 3. Production Compilation
To bundle the frontend with optimized CSS and tree-shaken JS assets ready for production or hosting environments:

```bash
npm run build
```
Compiled static assets will be populated into the `/dist` directory.

---

## 🌌 Creative Design Choices

This applet adheres to the **Geometric Balance** philosophy:
* **Thematic Oceanic Blue Styling**: Avoids default flat gray styles in favor of deep-hued oceanic bathymetry layers, matching water boundaries gracefully.
* **Clean Negative Space Layout**: High contrast borders, structured cards, and grid arrangements provide an un-cluttered editorial outlook mimicking vintage travel coordinates tables.
* **Active Routing Vectors**: Moving sequence paths trace travels chronologically in a clear route hierarchy, avoiding spaghetti layouts.
