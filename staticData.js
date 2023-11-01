function displayData(data) {
    const asteroids = data.near_earth_objects;
    let diameterData = [];
    let distanceData = [];
    let asteroidNames = [];

    for (let date in asteroids) {
        asteroids[date].forEach(asteroid => {
            let avgDiameter = (asteroid.estimated_diameter.meters.estimated_diameter_min + asteroid.estimated_diameter.meters.estimated_diameter_max) / 2;
            let distance = asteroid.close_approach_data[0].miss_distance.kilometers * 0.000001;
            diameterData.push(avgDiameter);
            distanceData.push(parseFloat(distance));
            asteroidNames.push(asteroid.name);
        });
    }

    d3.select('#diameterChart').selectAll("*").remove();
    d3.select('#distanceChart').selectAll("*").remove();
    d3.select('#bubbleChart').selectAll("*").remove(); // Remove existing content

    console.log("Diameter Data:", diameterData);
    console.log("Distance Data:", distanceData);
    console.log("Asteroid Names:", asteroidNames);

    createBarChart('#diameterChart', diameterData, 'Asteroid Diameter in meters', 'Asteroid Name');
    createScatterChart('#distanceChart', distanceData, 'Distance from Earth in Megameters', 'Asteroid Name');
}