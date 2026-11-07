
async function fetchEarthquakeData() {
  try {
    const params = new URLSearchParams({
      format: 'geojson'
    });


    const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`);
    
    // Check if the response status is OK (200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }

  return false;
}

export default fetchEarthquakeData;