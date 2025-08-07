import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

function DonutChart({ data, width = 300, height = 300, title, innerRadius = 0.6 }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const radius = Math.min(width, height) / 2
    const outerRadius = radius - 10
    const innerRadiusPixels = outerRadius * innerRadius

    const container = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'])

    // Pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)

    // Arc generator
    const arc = d3.arc()
      .innerRadius(innerRadiusPixels)
      .outerRadius(outerRadius)

    // Arc generator for labels
    const labelArc = d3.arc()
      .innerRadius(outerRadius + 10)
      .outerRadius(outerRadius + 10)

    // Create pie slices
    const arcs = container.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")

    // Add paths
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => colorScale(d.data.name))
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 0.8)
        
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

        tooltip.html(`${d.data.name}: ${d.data.value}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 1)
        d3.selectAll(".tooltip").remove()
      })

    // Add percentage labels on the slices
    arcs.append("text")
      .attr("transform", function(d) {
        const [x, y] = arc.centroid(d)
        return `translate(${x}, ${y})`
      })
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .text(d => d.data.value >= 5 ? `${d.data.value}%` : '') // Only show percentage if >= 5%

    // Add center title if provided
    if (title) {
      container.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", "#333")
        .text(title)
    }

    // Add legend below the chart
    const legend = svg.append("g")
      .attr("transform", `translate(10, ${height - 20})`)

    const legendItems = legend.selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${(i % 2) * 140}, ${Math.floor(i / 2) * 20})`)

    legendItems.append("circle")
      .attr("r", 6)
      .attr("fill", d => colorScale(d.name))

    legendItems.append("text")
      .attr("x", 12)
      .attr("y", 4)
      .style("font-size", "11px")
      .style("fill", "#333")
      .text(d => `${d.name} (${d.value}%)`)

  }, [data, width, height, title, innerRadius])

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

DonutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })),
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.string,
  innerRadius: PropTypes.number
}

export default DonutChart