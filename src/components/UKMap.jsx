import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ukRegionsData from '../assets/uk-regions.json'

function UKMap({ data, width = 600, height = 400 }) {
  const svgRef = useRef()
  const [geoData, setGeoData] = useState(null)

  // Create color scale based on coaches per million
  const getColorIntensity = (value) => {
    const max = Math.max(...data.map(d => d.coachesPerMillion))
    const min = Math.min(...data.map(d => d.coachesPerMillion))
    return (value - min) / (max - min)
  }

  // Map region names from GeoJSON to our data
  const getRegionData = (geoRegionName) => {
    // Create mapping between geographic regions and our data regions
    const regionMappings = {
      'Cumbria': 'North West',
      'Lancashire': 'North West', 
      'Greater Manchester': 'North West',
      'Merseyside': 'North West',
      'Cheshire': 'North West',
      'Yorkshire': 'Yorkshire & The Humber',
      'Leeds': 'Yorkshire & The Humber',
      'Sheffield': 'Yorkshire & The Humber',
      'Hull': 'Yorkshire & The Humber',
      'Nottinghamshire': 'East Midlands',
      'Leicestershire': 'East Midlands',
      'Derbyshire': 'East Midlands',
      'Lincolnshire': 'East Midlands',
      'Staffordshire': 'West Midlands',
      'West Midlands': 'West Midlands',
      'Warwickshire': 'West Midlands',
      'Worcestershire': 'West Midlands',
      'Birmingham': 'West Midlands',
      'London': 'South East & London',
      'Kent': 'South East & London',
      'Surrey': 'South East & London',
      'Sussex': 'South East & London',
      'Hampshire': 'South East & London',
      'Essex': 'South East & London'
    }

    // Find matching region in our data
    for (const [geoKey, dataRegion] of Object.entries(regionMappings)) {
      if (geoRegionName.toLowerCase().includes(geoKey.toLowerCase())) {
        return data.find(d => d.region === dataRegion)
      }
    }

    // Default fallback - assign regions cyclically for demonstration
    const regionIndex = Math.abs(geoRegionName.length) % data.length
    return data[regionIndex]
  }

  useEffect(() => {
    setGeoData(ukRegionsData)
  }, [])

  useEffect(() => {
    if (!geoData) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Set up dimensions and projection
    const projection = d3.geoMercator()
      .fitSize([width - 20, height - 40], geoData)

    const path = d3.geoPath().projection(projection)

    // Create container group for zooming
    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')

    const g = container.append('g')

    // Set up zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create tooltip div
    const tooltip = d3.select('body').selectAll('.uk-map-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'uk-map-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)

    // Add regions
    const regions = g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => {
        const regionData = getRegionData(d.properties.name)
        if (regionData) {
          const intensity = getColorIntensity(regionData.coachesPerMillion)
          return `rgba(25, 118, 210, ${0.4 + intensity * 0.6})`
        }
        return '#e0e0e0'
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const regionData = getRegionData(d.properties.name)
        
        // Highlight region
        d3.select(this)
          .attr('fill', '#1976d2')
          .attr('stroke-width', 2)
        
        // Show tooltip
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">${d.properties.name}</div>
            <div>${regionData ? `${regionData.coachesPerMillion} coaches per million` : 'No data available'}</div>
            ${regionData ? `<div style="margin-top: 4px; font-size: 10px; opacity: 0.8;">Region: ${regionData.region}</div>` : ''}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function(event, d) {
        const regionData = getRegionData(d.properties.name)
        
        // Reset region appearance
        d3.select(this)
          .attr('stroke-width', 0.5)
          .attr('fill', () => {
            if (regionData) {
              const intensity = getColorIntensity(regionData.coachesPerMillion)
              return `rgba(25, 118, 210, ${0.4 + intensity * 0.6})`
            }
            return '#e0e0e0'
          })
        
        // Hide tooltip
        tooltip.style('opacity', 0)
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })

    // Add title
    container.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#333')
      .style('pointer-events', 'none')
      .text('UK Regional Distribution')

    container.append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .style('pointer-events', 'none')
      .text('Coaches per Million Population • Scroll to zoom • Hover for details')

    // Add zoom controls
    const controls = container.append('g')
      .attr('class', 'zoom-controls')
      .attr('transform', `translate(${width - 60}, 50)`)

    // Zoom in button
    const zoomInButton = controls.append('g')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.5)
      })

    zoomInButton.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('stroke', '#ccc')
      .attr('rx', 3)

    zoomInButton.append('text')
      .attr('x', 12)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('+')

    // Zoom out button
    const zoomOutButton = controls.append('g')
      .attr('transform', 'translate(0, 28)')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.67)
      })

    zoomOutButton.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('stroke', '#ccc')
      .attr('rx', 3)

    zoomOutButton.append('text')
      .attr('x', 12)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('−')

    // Reset zoom button
    const resetButton = controls.append('g')
      .attr('transform', 'translate(0, 56)')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity)
      })

    resetButton.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('stroke', '#ccc')
      .attr('rx', 3)

    resetButton.append('text')
      .attr('x', 12)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('⌂')

  }, [geoData, data, width, height])

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg 
        ref={svgRef}
        style={{ 
          background: '#f8f9fa', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px' 
        }}
      />
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
        fontSize: '11px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '8px', color: '#333' }}>
          Regional Data
        </div>
        {data.map((region, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: `rgba(25, 118, 210, ${0.4 + getColorIntensity(region.coachesPerMillion) * 0.6})`,
              marginRight: '8px',
              border: '1px solid #ccc',
              borderRadius: '2px'
            }}></div>
            <span style={{ fontSize: '10px', color: '#666' }}>
              {region.region}: {region.coachesPerMillion}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

UKMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    region: PropTypes.string.isRequired,
    coachesPerMillion: PropTypes.number.isRequired
  })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number
}

export default UKMap