import Plot from 'react-plotly.js';

function DepthMagBoxComponent({dataJson}) {

  if (!dataJson || dataJson.type !== 'FeatureCollection') {
    return <div>Loading graph...</div>;
  }

  // crimnge
  function parseData(dataJson) {
    const cols = []

    for (const obj of dataJson.features) {
      const mag = Math.floor(obj.properties.mag)
      const depth = obj.geometry.coordinates[2]
      if (!cols[mag]) {
        cols[mag] = []
      }
      cols[mag].push(depth)
    }

    const data = []

    for (var i = 0; i < cols.length; i++) {
      data[i] = {
        y: cols[i] !== undefined ? cols[i] : [],
        type: 'box',
        name: `${i}.00 - ${i}.99`
      }
    }

    return data
  }

  const data = parseData(dataJson)

  const layout = {
    title: { text: 'Magnitude vs Depth Distribution' },
    xaxis: { tite: { text: 'Magnitude' } },
    yaxis: { title: { text: 'Depth (km)' } },
    showlegend: false, // names already label each box on the x-axis
  }

  return (
    <Plot 
      data={data}
      layout={layout}
    />
  )
}

export default DepthMagBoxComponent