const width = 800;
const height = 800;
let orbits = null; // Declare orbits with let

const svg = d3.select("#orbit-map")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

// Add a tooltip element to the document
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add event listener to the "Load Asteroids Art" button
const loadDataButton = document.getElementById("loadData");
loadDataButton.addEventListener("click", loadAsteroidsArt);

function loadAsteroidsArt() {
    const dateInput = document.getElementById('dateInput').value;
    const apiKey = "GoeMBuuZBNwxjErw8AJfbweuUpRIxqesP2PevTZu";
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}&date=${dateInput}`;

    // Fetch asteroid data for the selected date
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const asteroids = data.near_earth_objects;
            if (orbits === null) {
                orbits = svg.append("g").attr("class", "orbits");
            }
            renderAsteroidOrbits(asteroids);
        })
        .catch(error => console.error("Error fetching data:", error.message));
}

function renderAsteroidOrbits(asteroids) {
    asteroids.sort((a, b) => {
        return a.close_approach_data[0].miss_distance.kilometers - b.close_approach_data[0].miss_distance.kilometers;
    });

    // Define a scale for mapping close approach distances to the size of the orbits
    const scale = d3.scaleLinear()
        .domain([0, d3.max(asteroids, d => d.close_approach_data[0].miss_distance.kilometers)])
        .range([10, width / 2]);

    const colorScale = d3.scaleSequential(d3.interpolateRgb('yellow', 'blue')) // Change to interpolateRgb for smoother color blending
        .domain([0, asteroids.length]);

    const asteroidOrbits = orbits.selectAll("circle")
        .data(asteroids)
        .enter()
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", d => scale(d.close_approach_data[0].miss_distance.kilometers))
        .attr("fill", "none")
        .attr("stroke", (d, i) => colorScale(i / (asteroids.length - 1)))
        .attr("stroke-opacity", 0.6) // Increase opacity for more vivid colors
        .attr("stroke-width", 6) // Increase stroke width for thicker circles
        .on("mouseover", function (event, d) {
            // Display the tooltip with asteroid information
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(
                "Name: " + d.name + "<br>" +
                "Diameter: " + d.estimated_diameter.kilometers.estimated_diameter_max + " kilometers<br>" +
                "Distance from Earth: " + d.close_approach_data[0].miss_distance.kilometers + " kilometers"
            )
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            // Hide the tooltip when not hovering
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
