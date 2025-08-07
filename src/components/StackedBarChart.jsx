import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

function StackedBarChart({ data, width = 800, height = 400, margin = { top: 40, right: 120, bottom: 60, left: 60 } }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const container = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Get all demographic categories from the data
    const categories = Object.keys(data[0]).filter(key => key !== 'period')
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(categories)
      .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'])

    // Stack the data
    const stack = d3.stack()
      .keys(categories)
      .value((d, key) => d[key] || 0)

    const stackedData = stack(data)

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .range([innerHeight, 0])

    // Create bars
    container.selectAll(".series")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data.period))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        // Add tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")

        tooltip.transition()
          .duration(200)
          .style("opacity", .9)

        const value = d[1] - d[0]
        const category = d3.select(this.parentNode).datum().key
        
        tooltip.html(`${category}: ${value}%<br/>Period: ${d.data.period}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
      })
      .on("mouseout", function() {
        d3.selectAll(".tooltip").remove()
      })

    // Add x-axis
    container.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px")

    // Add y-axis
    container.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`))
      .selectAll("text")
      .style("font-size", "12px")

    // Add legend
    const legend = container.append("g")
      .attr("transform", `translate(${innerWidth + 20}, 20)`)

    const legendItems = legend.selectAll(".legend-item")
      .data(categories)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)

    legendItems.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => colorScale(d))

    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .style("fill", "#333")
      .text(d => {
        // Format category names
        return d.charAt(0).toUpperCase() + d.slice(1).replace(/([A-Z])/g, ' $1')
      })

    // Add axis labels
    container.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (innerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Percentage (%)")

    container.append("text")
      .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Time Period")

  }, [data, width, height, margin])

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        No data available
      </div>
    )
  }

  return <svg ref={svgRef}></svg>
}

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  })
}

export default StackedBarChart