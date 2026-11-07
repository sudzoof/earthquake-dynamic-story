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
    getFillColor: [255, 70, 30, 180],
    pickable: true, // Enable mouse hover to display information
    autoHighlight: true
  })

  const tooltip = ({object}) => {
    if (!object) return null;
    const p = object.properties;
    return {
      text: `${p.place}\nMagnitude: ${p.mag}`,
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