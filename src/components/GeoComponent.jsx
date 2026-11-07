import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';

function GeoComponent({dataJson}) {
  if (!dataJson || dataJson.type !== 'FeatureCollection') {
    return <div>Loading earthquakes…</div>;
  }

  const COUNTRIES = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';
  
  const baseMap = new GeoJsonLayer({
    id: 'base-map',
    data: COUNTRIES,
    stroked: true,
    filled: true,
    getLineColor: [60, 60, 60],
    getFillColor: [200, 200, 200],
  })

  /**
   * Mix a color with white to lighten it.
   * amount: 0 = original color, 1 = pure white
   */
  function lighten(rgb, amount) {
    return rgb.map(c => Math.round(c + (255 - c) * amount));
  }

  /**
   * Mix a color with black to darken it.
   * amount: 0 = original color, 1 = pure black
   */
  function darken(rgb, amount) {
    return rgb.map(c => Math.round(c * (1 - amount)));
  }

  function depthToColor(feature) {
    const depth = feature.geometry.coordinates[2];
    const t = Math.min(Math.max(depth / 700, 0), 1);

    const baseRed = [255, 0, 0]; // pure red

    // Deep (t=0): lighten toward white; Shallow (t=1): darken toward black
    const rgb = t < 0.5
      ? lighten(baseRed, 0.6 - t)    // more white when shallow
      : darken(baseRed, (t - 0.5) * 1.2); // more black when deep

    return [...rgb, 180];
  }

  const earthquakeLayer = new GeoJsonLayer({
    id: 'usgs-earthquakes',
    data: dataJson,
    filled: true,
    pointRadiusMinPixels: 2,   // Ensure small earthquakes are still visible when zoomed out
    pointRadiusMaxPixels: 200, // Prevent large earthquakes from being too exaggerated when zoomed in
    pointRadiusScale: 0.3,
    // Control size by magnitude: larger magnitude → larger point
    getPointRadius: f => Math.pow(10, f.properties.mag),
    // Use a unified color for all points; you can also set different colors based on magnitude or depth
    getFillColor: depthToColor,
    pickable: true, // Enable mouse hover to display information
    autoHighlight: true
  })

  

  const tooltip = ({object}) => {
    if (!object) return null;
    const p = object.properties;
    const depth = object.geometry.coordinates[2];
    return {
      text: `${p.place}\nMagnitude: ${p.mag}\nDepth: ${depth} km`,
    }
  }

  return (
    <DeckGL
      initialViewState={{ longitude: -120, latitude: 35, zoom: 3 }}
      controller={true}
      getTooltip={tooltip}
      layers={[baseMap, earthquakeLayer]}
    >
      
    </DeckGL>
  );
}

export default GeoComponent;