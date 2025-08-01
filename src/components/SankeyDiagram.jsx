import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

function SankeyDiagram({ data, width = 600, height = 300 }) {
  const svgRef = useRef()
  const [sankeyLib, setSankeyLib] = useState(null)

  // Load d3-sankey library
  useEffect(() => {
    import('d3-sankey').then(lib => {
      setSankeyLib(lib)
    })
  }, [])

  useEffect(() => {
    if (!data || !data.nodes || !data.links || !sankeyLib) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Set up dimensions and margins
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create sankey generator
    const sankeyGenerator = sankeyLib.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [innerWidth - 1, innerHeight - 5]])

    // Process the data
    const graph = sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    })

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(['Academy Coach', 'First Team Assistant', 'Head Coach', 'Other Roles', 'Other'])
      .range(['#1976d2', '#ff6b35', '#4caf50', '#9e9e9e', '#757575'])

    // Add links
    g.append('g')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLib.sankeyLinkHorizontal())
      .attr('stroke', d => color(d.source.name))
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.6)

    // Add nodes
    g.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => color(d.name))
      .attr('rx', 3)

    // Add node labels
    g.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .join('text')
      .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .text(d => `${d.name}\n${d.value}`)
      .each(function(d) {
        const text = d3.select(this)
        const words = [`${d.name}`, `${d.value || ''} coaches`]
        text.text('')
        
        words.forEach((word, i) => {
          text.append('tspan')
            .attr('x', d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .style('font-size', i === 0 ? '11px' : '9px')
            .style('font-weight', i === 0 ? '500' : '400')
            .style('fill', i === 0 ? '#333' : '#666')
            .text(word)
        })
      })

  }, [data, width, height, sankeyLib])

  return <svg ref={svgRef}></svg>
}

SankeyDiagram.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired
  }).isRequired,
  width: PropTypes.number,
  height: PropTypes.number
}

export default SankeyDiagram