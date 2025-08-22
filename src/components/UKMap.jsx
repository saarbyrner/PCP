import React, { useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ukRegionsData from '../assets/uk-regions.json'

function UKMap({ data, width = 600, height = 400 }) {
  const svgRef = useRef()

  const getColorIntensity = useCallback((value) => {
    const max = Math.max(...data.map(d => d.coachCount || d.coachesPerMillion))
    const min = Math.min(...data.map(d => d.coachCount || d.coachesPerMillion))
    return max === min ? 0.5 : (value - min) / (max - min)
  }, [data])

  const getRegionData = useCallback((geoRegionName) => {
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

    for (const [geoKey, dataRegion] of Object.entries(regionMappings)) {
      if (geoRegionName.toLowerCase().includes(geoKey.toLowerCase())) {
        return data.find(d => d.region === dataRegion)
      }
    }

    const regionIndex = Math.abs(geoRegionName.length) % data.length
    return data[regionIndex]
  }, [data])

  useEffect(() => {
    const geoData = ukRegionsData;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up dimensions and projection
    // Account for zoom controls on the left (24px width + 20px margin = 44px total)
    const controlSpace = 44
    const projection = d3.geoMercator()
      .fitSize([width - controlSpace, height - 40], geoData)

    const path = d3.geoPath().projection(projection)

    // Create container group for zooming
    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')

    // Center the map by translating the group to account for control space
    const g = container.append('g')
      .attr('transform', `translate(${controlSpace / 2}, 0)`)

    // Set up zoom behavior with center-based zooming
    const zoom = d3.zoom()
      .scaleExtent([1, 12])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    // Store the initial transform for proper reset
    const initialTransform = d3.zoomIdentity

    svg.call(zoom)

    // Add keyboard shortcuts for zooming
    d3.select('body')
      .on('keydown.zoom', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
          return // Don't interfere with input fields
        }
        
        const mapCenter = [width / 2, height / 2]
        
        if (event.key === '+' || event.key === '=') {
          event.preventDefault()
          svg.transition().duration(200).call(zoom.scaleBy, 1.5, mapCenter)
        } else if (event.key === '-') {
          event.preventDefault()
          svg.transition().duration(200).call(zoom.scaleBy, 0.67, mapCenter)
        } else if (event.key === '0') {
          event.preventDefault()
          svg.transition().duration(400).call(zoom.transform, initialTransform)
        }
      })

    // Create tooltip div
    const tooltip = d3.select('body').selectAll('.uk-map-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'uk-map-tooltip')
      .style('position', 'absolute')
      .style('background', 'var(--color-primary)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)

    // Add regions
    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => {
        const regionData = getRegionData(d.properties.name)
        if (regionData) {
          const coachValue = regionData.coachCount || regionData.coachesPerMillion
          const intensity = getColorIntensity(coachValue)
          const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#1976d2'
          const rgb = primaryColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16))
          return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.2 + intensity * 0.8})`
        }
        return getComputedStyle(document.documentElement).getPropertyValue('--color-border-primary').trim() || '#e0e0e0'
      })
      .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--color-background-primary').trim() || '#ffffff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const regionData = getRegionData(d.properties.name)
        
        // Highlight region
        d3.select(this)
          .attr('fill', getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#1976d2')
          .attr('stroke-width', 2)
        
        // Show tooltip
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">${d.properties.name}</div>
            <div>${regionData ? `${regionData.coachCount || regionData.coachesPerMillion} coaches` : 'No data available'}</div>
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
              const coachValue = regionData.coachCount || regionData.coachesPerMillion
              const intensity = getColorIntensity(coachValue)
              const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#1976d2'
          const rgb = primaryColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16))
          return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.2 + intensity * 0.8})`
            }
            return getComputedStyle(document.documentElement).getPropertyValue('--color-border-primary').trim() || '#e0e0e0'
          })
        
        // Hide tooltip
        tooltip.style('opacity', 0)
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })

    // Title and subtitle removed - now handled by DashboardCard title

    // Add zoom controls - positioned to avoid filter drawer
    const controls = container.append('g')
      .attr('class', 'zoom-controls')
      .attr('transform', `translate(20, 50)`)
      .style('z-index', 1000)

    // Get map center for consistent zooming
    const mapCenter = [width / 2, height / 2]

    // Zoom in button
    const zoomInButton = controls.append('g')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(200).call(zoom.scaleBy, 1.5, mapCenter)
      })

    zoomInButton.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', 'var(--color-background-primary)')
      .attr('stroke', 'var(--color-border-primary)')
      .attr('rx', 3)

    zoomInButton.append('text')
      .attr('x', 12)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--color-text-primary)')
      .text('+')

    // Zoom out button
    const zoomOutButton = controls.append('g')
      .attr('transform', 'translate(0, 28)')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(200).call(zoom.scaleBy, 0.67, mapCenter)
      })

    zoomOutButton.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', 'var(--color-background-primary)')
      .attr('stroke', 'var(--color-border-primary)')
      .attr('rx', 3)

    zoomOutButton.append('text')
      .attr('x', 12)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--color-text-primary)')
      .text('−')

    // Reset zoom button
    const resetButton = controls.append('g')
      .attr('transform', 'translate(0, 56)')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(400).call(zoom.transform, initialTransform)
      })

    resetButton.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', 'var(--color-background-primary)')
      .attr('stroke', 'var(--color-border-primary)')
      .attr('rx', 3)

    resetButton.append('text')
      .attr('x', 12)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--color-text-primary)')
      .text('⌂')

  }, [data, width, height, getColorIntensity, getRegionData])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg 
        ref={svgRef}
        style={{ 
          width: '100%',
          height: '100%',
          background: 'var(--color-background-secondary)'
        }}
      />
      
      {/* Color Scale Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'var(--color-background-primary)',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid var(--color-border-primary)',
        fontSize: '11px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minWidth: '120px'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
          Coach Count
        </div>
        {(() => {
          const max = Math.max(...data.map(d => d.coachCount || d.coachesPerMillion))
          const min = Math.min(...data.map(d => d.coachCount || d.coachesPerMillion))
          const steps = 5
          const stepSize = (max - min) / (steps - 1)
          
          return Array.from({ length: steps }, (_, i) => {
            const value = Math.round(min + (stepSize * i))
            const intensity = (value - min) / (max - min)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{
                  width: '16px',
                  height: '12px',
                  backgroundColor: (() => {
                    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#1976d2'
                    const rgb = primaryColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16))
                    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.2 + intensity * 0.8})`
                  })(),
                  marginRight: '8px',
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: '2px'
                }}></div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                  {value}
                </span>
              </div>
            )
          })
        })()}
        <div style={{ fontSize: '9px', color: 'var(--color-text-disabled)', marginTop: '4px', fontStyle: 'italic' }}>
          Fewer ← → More
        </div>
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