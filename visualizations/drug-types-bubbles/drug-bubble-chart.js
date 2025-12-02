// Drug overdose bubble chart visualization - With Filters
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubbleChart);
  } else {
    initBubbleChart();
  }

  function initBubbleChart() {
    console.log("Initializing drug bubble chart with filters...");

    // Check if container exists
    const container = document.getElementById('drug-bubble-chart');
    if (!container) {
      console.error("Container #drug-bubble-chart not found!");
      return;
    }

    // Get container dimensions for responsive sizing
    const containerWidth = container.clientWidth;
    const margin = { top: 10, right: 20, bottom: 20, left: 20 };
    const width = Math.min(containerWidth - 40, 900) - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#drug-bubble-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("display", "block")
      .style("margin", "0 auto")
      .append("g")
      .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

    console.log("SVG created for bubble chart with dimensions:", width, "x", height);

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "drug-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "15px")
      .style("border-radius", "8px")
      .style("font-size", "14px")
      .style("max-width", "300px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("box-shadow", "0 4px 6px rgba(0,0,0,0.3)");

    // Bubble size scale
    const sizeScale = d3.scaleSqrt()
      .range([30, 105]);

    // Animation control
    let hasAnimated = false;
    let nodes = null;
    let simulation = null;
    let fullData = null;

    // Current filter state
    let currentFilter = {
      type: 'overall', // 'overall', 'age', 'gender'
      age: null,
      gender: null
    };

    // Function to create bubbles
    function createBubbles(data, animate = false) {
      console.log("Creating bubbles with data:", data);

      // Update scale
      sizeScale.domain([0, d3.max(data, d => d.deaths)]);

      // Create nodes in zigzag pattern
      nodes = data.map((d, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const xSpacing = width / 5;
        const ySpacing = height / 4;
        const xOffset = row % 2 === 0 ? 0 : xSpacing / 2;
        
        return {
          ...d,
          radius: sizeScale(d.deaths),
          x: (col - 1) * xSpacing + xOffset,
          y: (row - 1) * ySpacing
        };
      });

      // Force simulation with position constraints
      simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(5))
        .force("collision", d3.forceCollide().radius(d => d.radius + 2))
        .force("x", d3.forceX(d => d.x).strength(0.8))
        .force("y", d3.forceY(d => d.y).strength(0.8));

      // Stop simulation initially if not animating
      if (!animate) {
        simulation.stop();
      }

      // Circles
      const circles = svg.selectAll(".drug-bubble")
        .data(nodes, d => d.name);

      circles.exit()
        .transition()
        .duration(500)
        .attr("r", 0)
        .remove();

      const circlesEnter = circles.enter()
        .append("circle")
        .attr("class", "drug-bubble")
        .attr("r", 0)
        .style("cursor", "pointer")
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("opacity", 0);

      const allCircles = circlesEnter.merge(circles);

      // Animate if flag is set
      if (animate) {
        allCircles
          .transition()
          .duration(1000)
          .delay((d, i) => i * 100)
          .attr("r", d => d.radius)
          .style("opacity", 0.8);
      } else {
        allCircles
          .attr("r", d => d.radius)
          .style("opacity", 0.8);
      }

      // Hover tooltip
      allCircles
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .attr("stroke-width", 4);

          tooltip
            .style("visibility", "visible")
            .html(`
              <strong style="font-size: 16px; color: ${d.color}">${d.name}</strong><br/>
              <strong style="font-size: 20px; color: #FFD700">${d.deaths.toFixed(2)}</strong> avg rate<br/>
              <hr style="margin: 8px 0; border-color: rgba(255,255,255,0.3)">
              <span style="color: #ddd">${d.info}</span>
            `);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 15) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.8)
            .attr("stroke-width", 2);

          tooltip.style("visibility", "hidden");
        });

      // Labels
      const labels = svg.selectAll(".drug-label")
        .data(nodes, d => d.name);

      labels.exit().remove();

      const labelsEnter = labels.enter()
        .append("text")
        .attr("class", "drug-label")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("font-weight", "bold")
        .style("fill", "white")
        .style("pointer-events", "none")
        .style("opacity", 0);

      const allLabels = labelsEnter.merge(labels);

      allLabels.text(d => d.name)
        .style("font-size", d => {
          if (d.radius > 90) return "18px";
          if (d.radius > 60) return "14px";
          return "9px";
        });

      // Animate labels if flag is set
      if (animate) {
        allLabels
          .transition()
          .duration(1000)
          .delay((d, i) => i * 100 + 400)
          .style("opacity", 1);
      } else {
        allLabels.style("opacity", 1);
      }

      // Update on tick
      simulation.on("tick", () => {
        allCircles
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        allLabels
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });

      console.log("Bubbles created successfully");
    }

    // Function to aggregate data based on filters
    function aggregateData(data, filterType, age = null, gender = null) {
      console.log("Aggregating data with filter:", filterType, age, gender);

      const drugs = [
        { name: "Fentanyl", key: "fentanyl_rate", color: "#B22222" },
        { name: "Heroin", key: "heroin_rate", color: "#DC143C" },
        { name: "Stimulants", key: "stimulant_rate", color: "#FF4500" },
        { name: "Cocaine", key: "cocaine_rate", color: "#CD5C5C" },
        { name: "Methamphetamine", key: "methamphetamine_rate", color: "#FF6347" },
        { name: "Benzodiazepines", key: "benzodiazepine_rate", color: "#FFA07A" }
      ];

      let filteredData;

      if (filterType === 'overall') {
        // Overall: sex = "Total" AND age_range = "Total"
        filteredData = data.filter(d => d.sex === "Total" && d.age_range === "Total");
      } else if (filterType === 'age' && age) {
        // By Age: age_range = selected age AND sex = "Total"
        filteredData = data.filter(d => d.age_range === age && d.sex === "Total");
      } else if (filterType === 'gender' && gender) {
        // By Gender: sex = selected gender AND age_range = "Total"
        filteredData = data.filter(d => d.sex === gender && d.age_range === "Total");
      } else {
        // Default to overall
        filteredData = data.filter(d => d.sex === "Total" && d.age_range === "Total");
      }

      console.log("Filtered data rows:", filteredData.length);

      // Aggregate (average) the rate for each drug
      const aggregatedData = drugs.map(drug => {
        const values = filteredData.map(d => +d[drug.key]).filter(v => !isNaN(v) && v !== 0);
        const mean = d3.mean(values) || 0;
        
        let infoText = `${drug.name} average nonfatal overdose rate`;
        if (filterType === 'age' && age) {
          infoText += ` for ages ${age}`;
        } else if (filterType === 'gender' && gender) {
          infoText += ` for ${gender === 'M' ? 'males' : 'females'}`;
        } else {
          infoText += ` overall`;
        }
        
        return {
          name: drug.name,
          deaths: mean,
          info: infoText,
          color: drug.color
        };
      });

      return aggregatedData;
    }

    // Function to update visualization based on filter
    function updateVisualization() {
      if (!fullData) return;

      const aggregatedData = aggregateData(
        fullData, 
        currentFilter.type, 
        currentFilter.age, 
        currentFilter.gender
      );

      // Remove old bubbles and labels
      svg.selectAll(".drug-bubble").remove();
      svg.selectAll(".drug-label").remove();

      // Create new bubbles with animation
      createBubbles(aggregatedData, true);
    }

    // Function to trigger animation
    function triggerAnimation() {
      if (simulation && nodes) {
        console.log("Triggering bubble animation!");
        
        simulation.alpha(1).restart();
        
        svg.selectAll(".drug-bubble")
          .transition()
          .duration(1000)
          .delay((d, i) => i * 100)
          .attr("r", d => d.radius)
          .style("opacity", 0.8);
        
        svg.selectAll(".drug-label")
          .transition()
          .duration(1000)
          .delay((d, i) => i * 100 + 400)
          .style("opacity", 1);
      }
    }

    // Create filter controls
    function createFilterUI() {
      const filterContainer = d3.select("#drug-bubble-filters");
      if (!filterContainer.node()) {
        console.error("Filter container #drug-bubble-filters not found!");
        return;
      }

      filterContainer.html(''); // Clear existing content

      // Filter type selection
      const filterTypeDiv = filterContainer
        .append("div")
        .attr("class", "bubble-filter-type")
        .style("margin-bottom", "20px");

      filterTypeDiv.append("label")
        .style("font-weight", "600")
        .style("margin-right", "15px")
        .text("View by:");

      const filterTypes = [
        { value: 'overall', label: 'Overall' },
        { value: 'age', label: 'Age Group' },
        { value: 'gender', label: 'Gender' }
      ];

      filterTypes.forEach(type => {
        const label = filterTypeDiv.append("label")
          .style("margin-right", "20px")
          .style("cursor", "pointer");

        label.append("input")
          .attr("type", "radio")
          .attr("name", "bubble-filter-type")
          .attr("value", type.value)
          .property("checked", type.value === 'overall')
          .on("change", function() {
            currentFilter.type = this.value;
            currentFilter.age = null;
            currentFilter.gender = null;
            updateSecondaryFilters();
            updateVisualization();
          });

        label.append("span")
          .style("margin-left", "5px")
          .text(type.label);
      });

      // Secondary filter container
      filterContainer.append("div")
        .attr("id", "bubble-secondary-filter")
        .style("margin-top", "15px");

      updateSecondaryFilters();
    }

    // Update secondary filters based on filter type
    function updateSecondaryFilters() {
      const secondaryContainer = d3.select("#bubble-secondary-filter");
      secondaryContainer.html('');

      if (currentFilter.type === 'age') {
        // Age group dropdown
        const ageGroups = ["0 to 14", "15 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65+"];
        
        secondaryContainer.append("label")
          .style("font-weight", "600")
          .style("margin-right", "10px")
          .text("Select Age Group:");

        const select = secondaryContainer.append("select")
          .attr("class", "bubble-filter-select")
          .style("padding", "8px")
          .style("font-size", "14px")
          .style("border-radius", "4px")
          .on("change", function() {
            currentFilter.age = this.value;
            updateVisualization();
          });

        select.append("option")
          .attr("value", "")
          .text("-- Select Age --");

        ageGroups.forEach(age => {
          select.append("option")
            .attr("value", age)
            .text(age);
        });

      } else if (currentFilter.type === 'gender') {
        // Gender dropdown
        const genders = [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' }
        ];

        secondaryContainer.append("label")
          .style("font-weight", "600")
          .style("margin-right", "10px")
          .text("Select Gender:");

        const select = secondaryContainer.append("select")
          .attr("class", "bubble-filter-select")
          .style("padding", "8px")
          .style("font-size", "14px")
          .style("border-radius", "4px")
          .on("change", function() {
            currentFilter.gender = this.value;
            updateVisualization();
          });

        select.append("option")
          .attr("value", "")
          .text("-- Select Gender --");

        genders.forEach(gender => {
          select.append("option")
            .attr("value", gender.value)
            .text(gender.label);
        });
      }
    }

    // Load real dataset
    d3.csv("data/DOSE_SyS_Dashboard_Download_10-23-2025 - Overall.csv").then(function(data) {
      console.log("Loaded overdose data:", data.length, "rows");

      fullData = data;

      // Create filter UI
      createFilterUI();

      // Create initial bubbles (overall view)
      const initialData = aggregateData(data, 'overall');
      createBubbles(initialData, false);

      // Set up Intersection Observer for scroll-triggered animation
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            console.log("Bubble chart is visible, triggering animation!");
            triggerAnimation();
            hasAnimated = true;
          }
        });
      }, observerOptions);

      observer.observe(container);

    }).catch(error => {
      console.error("Error loading dataset:", error);
    });

    console.log("Drug bubble chart initialization complete!");
  }
})();