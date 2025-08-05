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
      .nodeWidth(18)
      .nodePadding(8)
      .extent([[1, 1], [innerWidth - 1, innerHeight - 5]])

    // Process the data
    const graph = sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    })

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', 'transparent')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(['Academy Coach', 'First Team Assistant', 'Head Coach', 'Other Roles', 'Other'])
      .range(['#1976d2', '#ff6b35', '#4caf50', '#9e9e9e', '#757575'])

    // Add links
    const links = g.append('g')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLib.sankeyLinkHorizontal())
      .attr('stroke', d => color(d.source.name))
      .attr('stroke-width', d => Math.max(2, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.6)
      .attr('class', 'sankey-link')

    // Create simple tooltip for hover
    const tooltip = d3.select('body').selectAll('.sankey-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')

    // Helper function to get all connected nodes and links in the funnel
    const getConnectedElements = (node) => {
      const connectedNodes = new Set([node])
      const connectedLinks = new Set()
      
      // Function to traverse forward through the flow
      const traverseForward = (currentNode) => {
        currentNode.sourceLinks.forEach(link => {
          connectedLinks.add(link)
          if (!connectedNodes.has(link.target)) {
            connectedNodes.add(link.target)
            traverseForward(link.target)
          }
        })
      }
      
      // Function to traverse backward through the flow
      const traverseBackward = (currentNode) => {
        currentNode.targetLinks.forEach(link => {
          connectedLinks.add(link)
          if (!connectedNodes.has(link.source)) {
            connectedNodes.add(link.source)
            traverseBackward(link.source)
          }
        })
      }
      
      // Traverse both directions to get the complete funnel
      traverseForward(node)
      traverseBackward(node)
      
      return { nodes: connectedNodes, links: connectedLinks }
    }

    // Add nodes with hover tooltips and highlighting
    const nodes = g.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(12, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => color(d.name))
      .attr('rx', 3)
      .attr('class', 'sankey-node')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Calculate node value for tooltip
        const nodeValue = d.sourceLinks.reduce((sum, link) => sum + link.value, 0) || 
                         d.targetLinks.reduce((sum, link) => sum + link.value, 0) || 
                         d.value || 0
        
        // Calculate total coaches from all entry-level flows (first column nodes)
        const entryNodes = graph.nodes.filter(node => node.x0 === 1)
        const totalCoaches = entryNodes.reduce((sum, node) => {
          return sum + (node.sourceLinks.reduce((linkSum, link) => linkSum + link.value, 0) || 0)
        }, 0) || 2000
        
        const percentage = nodeValue > 0 ? Math.round((nodeValue / totalCoaches) * 100) : 0
        
        // Show tooltip with smart positioning
        const tooltipWidth = 200 // Estimated tooltip width
        const tooltipHeight = 60 // Estimated tooltip height
        const leftPos = event.pageX + 10 + tooltipWidth > window.innerWidth 
          ? event.pageX - tooltipWidth - 10 
          : event.pageX + 10
        const topPos = event.pageY - 10 - tooltipHeight < 0 
          ? event.pageY + 20 
          : event.pageY - 10
        
        tooltip
          .style('visibility', 'visible')
          .html(`<strong>${d.name}</strong><br/>${nodeValue.toLocaleString()} coaches (${percentage}%)`)
          .style('left', leftPos + 'px')
          .style('top', topPos + 'px')
        
        // Get connected elements for highlighting
        const connected = getConnectedElements(d)
        
        // Highlight funnel - keep nodes opaque but dim links only
        nodes.style('opacity', 1)
        links.style('opacity', link => connected.links.has(link) ? 0.8 : 0.1)
          .style('stroke', link => connected.links.has(link) ? color(link.source.name) : '#ccc')
        
        // Show all labels for connected nodes
        labels.style('visibility', node => connected.nodes.has(node) ? 'visible' : 'hidden')
          .style('font-weight', node => connected.nodes.has(node) ? '600' : '400')
          .style('font-size', node => connected.nodes.has(node) ? '12px' : '8px')
      })
      .on('mousemove', function(event) {
        const tooltipWidth = 200
        const tooltipHeight = 60
        const leftPos = event.pageX + 10 + tooltipWidth > window.innerWidth 
          ? event.pageX - tooltipWidth - 10 
          : event.pageX + 10
        const topPos = event.pageY - 10 - tooltipHeight < 0 
          ? event.pageY + 20 
          : event.pageY - 10
        
        tooltip
          .style('left', leftPos + 'px')
          .style('top', topPos + 'px')
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden')
        
        // Reset all nodes and links to normal state
        nodes.style('opacity', 1)
        links.style('opacity', 0.6)
          .style('stroke', d => color(d.source.name))
        
        // Hide all labels again
        labels.style('visibility', d => (d.y1 - d.y0) > 20 ? 'visible' : 'hidden')
          .style('font-weight', '500')
          .style('font-size', '8px')
      })

    // Add node labels - initially hidden, shown on hover
    const labels = g.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .join('text')
      .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .style('fill', '#000')
      .style('pointer-events', 'none')
      .style('visibility', d => (d.y1 - d.y0) > 20 ? 'visible' : 'hidden')
      .each(function(d) {
        const text = d3.select(this)
        
        // Calculate node value from links
        const nodeValue = d.sourceLinks.reduce((sum, link) => sum + link.value, 0) || 
                         d.targetLinks.reduce((sum, link) => sum + link.value, 0) || 
                         d.value || 0
        
        // Calculate total coaches from all entry-level flows (first column nodes)
        const entryNodes = graph.nodes.filter(node => node.x0 === 1)
        const totalCoaches = entryNodes.reduce((sum, node) => {
          return sum + (node.sourceLinks.reduce((linkSum, link) => linkSum + link.value, 0) || 0)
        }, 0) || 2000
        
        const percentage = nodeValue > 0 ? Math.round((nodeValue / totalCoaches) * 100) : 0
        
        // Multi-line labels with name and stats
        const words = [
          d.name.length > 15 ? d.name.substring(0, 12) + '...' : d.name,
          `${nodeValue.toLocaleString()} (${percentage}%)`
        ]
        text.text('')
        
        words.forEach((word, i) => {
          text.append('tspan')
            .attr('x', d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .style('font-size', i === 0 ? '10px' : '8px')
            .style('font-weight', i === 0 ? '600' : '400')
            .style('fill', '#000')
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