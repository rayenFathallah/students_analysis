// Load the data and render the initial chart
d3.csv('data/processed.csv').then(data => {
  // Save the data to a global variable
  window.data = data;

  // Render the initial chart
  const initialColumn = 'district';
  updateChart(initialColumn);
}).catch(error => {
  console.error('Error loading data:', error);
});

// Function to update the bar chart based on the selected column
function updateChart(column) {
  // Remove the previous bar chart, if exists
  d3.select('#interactiveBar').selectAll('*').remove();

  // Extract the required data for the bar chart
  const districtCounts = {};
  window.data.forEach(row => {
    const district = row[column];
    districtCounts[district] = (districtCounts[district] || 0) + 1;
  });

  const districts = Object.keys(districtCounts);
  const counts = districts.map(district => districtCounts[district]);

  // Define the dimensions and margins for the bar chart
  const width = 600;
  const height = 400;
  const margin = { top: 50, right: 50, bottom: 70, left: 70 };

  // Create the bar chart SVG container
  const svg = d3.select('#interactiveBar')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create x-scale and y-scale for the bar chart
  const xScale = d3.scaleBand()
    .domain(districts)
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(counts)])
    .range([height, 0]);

  // Create x-axis and y-axis for the bar chart
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Add x-axis to the bar chart
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')
    .attr('dx', '-0.8em')
    .attr('dy', '0.15em');

  // Add y-axis to the bar chart
  svg.append('g')
    .call(yAxis);

  // Create a color scale for the bar chart
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([d3.min(counts), d3.max(counts)]);

  // Create bars for the bar chart
  const bars = svg.selectAll('.bar')
    .data(districts)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d))
    .attr('y', height)
    .attr('width', xScale.bandwidth())
    .attr('height', 0)
    .attr('fill', d => colorScale(districtCounts[d]))
    .attr('rx', 6)
    .attr('ry', 6);

  // Add animation to the bars
  bars.transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .attr('y', d => yScale(districtCounts[d]))
    .attr('height', d => height - yScale(districtCounts[d]));

  // Add tooltips to the bars
  bars.append('title')
    .text(d => `Water Sources: ${districtCounts[d]}`);

  // Add value labels on top of the bars
  bars.append('text')
    .attr('class', 'value-label')
    .attr('x', d => xScale(d) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(districtCounts[d]) - 5)
    .attr('text-anchor', 'middle')
    .text(d => districtCounts[d])
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', 'white');

  // Add title to the bar chart
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '18px')
    .style('font-weight', 'bold')
    // .text('Number of Water Sources per District');

  // Add x-axis label to the bar chart
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('District');

  // Add y-axis label to the bar chart
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('Water Sources');
}
