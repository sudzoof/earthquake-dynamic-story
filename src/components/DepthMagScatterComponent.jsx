import Plot from 'react-plotly.js';

function DepthMagScatterComponent({dataJson}) {
  // TODO: Histogram?

  if (!dataJson || dataJson.type !== 'FeatureCollection') {
    return <div>Loading graph...</div>;
  }

  const x = dataJson.features.map((obj) => obj.properties.mag)
  const y = dataJson.features.map((obj) => obj.geometry.coordinates[2])

  const data= [
    {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'markers',
      marker: { color: 'blue', size: 10 },
    }
  ]

  const layout = {
    width: 600,
    height: 400,
    title: { text: 'Magnitude vs Depth' },
    xaxis: { title: { text: 'Magnitude' } },
    yaxis: { title: { text: 'Depth (km)' } },
  }

  console.log(dataJson)

  return (
    <Plot 
      data={data}
      layout={layout}
    />
  )
}

export default DepthMagScatterComponent;