// Responsive D3 setup
const container = d3.select("#us-overdose-map");
const width = container.node().getBoundingClientRect().width;
const height = container.node().getBoundingClientRect().height;

const svg = container
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .style("width", "100%")
  .style("height", "100%");

// ✅ Updated color scale to match your real dataset (4.3 → 71.6)
const color = d3.scaleSequential()
  .interpolator(d3.interpolateReds)
  .domain([5, 72]);

// Projection & path
const projection = d3.geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width * 0.7);

const path = d3.geoPath().projection(projection);

// Load map + overdose data
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
  d3.csv("data/overdose_rates_us.csv")
]).then(([us, data]) => {

  // Convert rates to numbers
  const rateByState = new Map(
    data.map(d => [d.state.trim().replace(/"/g, ''), +d.rate])
);
  

  const states = topojson.feature(us, us.objects.states).features;

  // Draw states
  svg.selectAll("path")
    .data(states)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => {
      const name = getStateName(d.id);
      const rate = rateByState.get(name);
      return rate ? color(rate) : "#444";
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.6)
    .append("title")
    .text(d => {
      const name = getStateName(d.id);
      const rate = rateByState.get(name);
      return `${name}: ${rate ? rate.toFixed(1) : "No data"} deaths / 100k (2023)`;
    });
});

// Convert FIPS → State Name
function getStateName(fips) {
  const states = {
    1: "Alabama", 2: "Alaska", 4: "Arizona", 5: "Arkansas", 6: "California",
    8: "Colorado", 9: "Connecticut", 10: "Delaware", 12: "Florida", 13: "Georgia",
    15: "Hawaii", 16: "Idaho", 17: "Illinois", 18: "Indiana", 19: "Iowa",
    20: "Kansas", 21: "Kentucky", 22: "Louisiana", 23: "Maine", 24: "Maryland",
    25: "Massachusetts", 26: "Michigan", 27: "Minnesota", 28: "Mississippi",
    29: "Missouri", 30: "Montana", 31: "Nebraska", 32: "Nevada", 33: "New Hampshire",
    34: "New Jersey", 35: "New Mexico", 36: "New York", 37: "North Carolina",
    38: "North Dakota", 39: "Ohio", 40: "Oklahoma", 41: "Oregon", 42: "Pennsylvania",
    44: "Rhode Island", 45: "South Carolina", 46: "South Dakota", 47: "Tennessee",
    48: "Texas", 49: "Utah", 50: "Vermont", 51: "Virginia", 53: "Washington",
    54: "West Virginia", 55: "Wisconsin", 56: "Wyoming"
  };
  return states[fips];
}

// ✅ Updated Legend to match new domain
const legendWidth = 20;
const legendHeight = 200;
const legendMargin = { top: 20, right: 50 };

const legendSvg = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - legendMargin.right - 150}, ${height / 2 - legendHeight / 2})`);

const defs = svg.append("defs");

const gradient = defs.append("linearGradient")
  .attr("id", "legend-gradient")
  .attr("x1", "0%").attr("y1", "100%")
  .attr("x2", "0%").attr("y2", "0%");

const legendStops = d3.range(0, 1.01, 0.1);

gradient.selectAll("stop")
  .data(legendStops)
  .enter()
  .append("stop")
  .attr("offset", d => `${d * 100}%`)
  .attr("stop-color", d => color(5 + d * (72 - 5)));

legendSvg.append("rect")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .style("fill", "url(#legend-gradient)")
  .style("stroke", "#ccc")
  .style("stroke-width", 0.5);

const legendScale = d3.scaleLinear()
  .domain([5, 72])
  .range([legendHeight, 0]);

const legendAxis = d3.axisRight(legendScale)
  .tickValues([5, 20, 40, 60, 72])
  .tickSize(3);

legendSvg.append("g")
  .attr("class", "legend-axis")
  .attr("transform", `translate(${legendWidth}, 0)`)
  .call(legendAxis)
  .selectAll("text")
  .style("fill", "#eee")
  .style("font-size", "12px");

legendSvg.append("text")
  .attr("x", -40)
  .attr("y", -10)
  .attr("fill", "#fff")
  .style("font-size", "13px")
  .style("font-weight", "600")
  .text("Deaths per 100k (2023)");
