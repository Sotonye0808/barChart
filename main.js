document.addEventListener("DOMContentLoaded", function () {
    // Constants for United States GDP
    const usMargin = { top: 20, right: 20, bottom: 70, left: 70 };
    const usWidth = 800 - usMargin.left - usMargin.right;
    const usHeight = 400 - usMargin.top - usMargin.bottom;
  
    // Append the SVG for United States GDP
    const svgUS = d3.select("#chart-us")
      .attr("width", usWidth + usMargin.left + usMargin.right)
      .attr("height", usHeight + usMargin.top + usMargin.bottom)
      .append("g")
      .attr("transform", `translate(${usMargin.left},${usMargin.top})`);
  
    // Tooltip for United States GDP
    const tooltipUS = d3.select("#tooltip-us");
  
    // Fetch data for United States GDP
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
      .then(response => response.json())
      .then(data => {
        const gdpData = data.data;
  
        // X scale for United States GDP
        const xUS = d3.scaleBand()
          .domain(gdpData.map(d => d[0]))
          .range([0, usWidth])
          .padding(0.1);

         // Filter years to display on x-axis
         const years = gdpData.map(d => +d[0].slice(0, 4));
         const filteredYears = years.filter(year => year % 5 === 0);

        // Y scale for United States GDP
        const yUS = d3.scaleLinear()
          .domain([0, d3.max(gdpData, d => d[1])])
          .range([usHeight, 0]);
  
        // X axis for United States GDP
        const xAxisUS = d3.axisBottom(xUS)
        .tickValues(filteredYears.map(year => `${year}-01-01`)); // Set tick values
        svgUS.append("g")
          .attr("id", "x-axis-us")
          .attr("transform", `translate(0,${usHeight})`)
          .call(xAxisUS)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)");
  
        // Y axis for United States GDP
        const yAxisUS = d3.axisLeft(yUS)
        .tickFormat(d => `$${d}`);
        svgUS.append("g")
          .attr("id", "y-axis-us")
          .call(yAxisUS);
  
        // Bars for United States GDP
        svgUS.selectAll(".bar")
          .data(gdpData)
          .enter()
          .append("rect")
          .attr("color", "steelblue")
          .attr("class", "bar")
          .attr("data-date", d => d[0])
          .attr("data-gdp", d => d[1])
          .attr("x", d => xUS(d[0]))
          .attr("y", d => yUS(d[1]))
          .attr("width", xUS.bandwidth())
          .attr("height", d => usHeight - yUS(d[1]))
          .style("fill", "steelblue") // Steelblue color for US bars
          .on("mouseover", function (event, d) {
            tooltipUS.style("display", "block")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px")
              .attr("data-date", d[0])
              .html(`<strong>Date:</strong> ${d[0]}<br><strong>GDP:</strong> $${d[1].toFixed(2)} billion`);
          })
          .on("mouseout", function () {
            tooltipUS.style("display", "none");
          });
      })
      .catch(error => console.error("Error fetching US data:", error));
  
    // Constants for Nigeria GDP
    const ngMargin = { top: 20, right: 20, bottom: 70, left: 70 };
    const ngWidth = 800 - ngMargin.left - ngMargin.right;
    const ngHeight = 400 - ngMargin.top - ngMargin.bottom;
  
    // Append the SVG for Nigeria GDP
    const svgNG = d3.select("#chart-ng")
      .attr("width", ngWidth + ngMargin.left + ngMargin.right)
      .attr("height", ngHeight + ngMargin.top + ngMargin.bottom)
      .append("g")
      .attr("transform", `translate(${ngMargin.left},${ngMargin.top})`);
  
    // Tooltip for Nigeria GDP
    const tooltipNG = d3.select("#tooltip-ng");
  
    // Fetch data for Nigeria GDP
    fetch("https://api.worldbank.org/v2/country/NGA/indicator/NY.GDP.MKTP.CD?format=json&date=1960:2020")
      .then(response => response.json())
      .then(data => {
        const gdpData = data[1].filter(d => d.value !== null);
  
        // X scale for Nigeria GDP
        const xNG = d3.scaleBand()
          .domain(gdpData.map(d => d.date))
          .range([0, ngWidth])
          .padding(0.1);
  
        // Y scale for Nigeria GDP
        const yNG = d3.scaleLinear()
          .domain([0, d3.max(gdpData, d => d.value)])
          .range([ngHeight, 0]);
  
        // X axis for Nigeria GDP
        const xAxisNG = d3.axisBottom(xNG);
        svgNG.append("g")
          .attr("id", "x-axis-ng")
          .attr("transform", `translate(0,${ngHeight})`)
          .call(xAxisNG)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)");
  
        // Y axis for Nigeria GDP
        const yAxisNG = d3.axisLeft(yNG)
        .tickFormat(d => `$${d / 1000000}`);
        svgNG.append("g")
          .attr("id", "y-axis-ng")
          .call(yAxisNG);
  
        // Bars for Nigeria GDP
        svgNG.selectAll(".bar")
          .data(gdpData)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("data-date", d => d.date)
          .attr("data-gdp", d => d.value)
          .attr("x", d => xNG(d.date))
          .attr("y", d => yNG(d.value))
          .attr("width", xNG.bandwidth())
          .attr("height", d => ngHeight - yNG(d.value))
          .style("fill", "green") // Green color for Nigeria bars
          .on("mouseover", function (event, d) {
            tooltipNG.style("display", "block")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px")
              .attr("data-date", d.date)
              .html(`<strong>Date:</strong> ${d.date}<br><strong>GDP:</strong> $${(d.value / 1000000).toFixed(2)} billion`);
          })
          .on("mouseout", function () {
            tooltipNG.style("display", "none");
          });
      })
      .catch(error => console.error("Error fetching Nigeria data:", error));
  });
  