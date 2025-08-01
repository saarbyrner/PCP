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
    if (!geoData) {
      console.log('UKMap: No geoData available')
      return
    }

    console.log('UKMap: Rendering with data:', geoData.features?.length, 'features')

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Set up dimensions and projection
    const projection = d3.geoMercator()
      .fitSize([width - 40, height - 60], geoData)

    const path = d3.geoPath().projection(projection)
    
    console.log('UKMap: Projection and path ready')

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')

    // Add test rectangle to verify SVG is working
    g.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', 'red')
      .attr('stroke', 'black')

    // Add regions
    g.selectAll('path')
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
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#1976d2')
      })
      .on('mouseout', function(event, d) {
        const regionData = getRegionData(d.properties.name)
        if (regionData) {
          const intensity = getColorIntensity(regionData.coachesPerMillion)
          d3.select(this).attr('fill', `rgba(25, 118, 210, ${0.3 + intensity * 0.7})`)
        } else {
          d3.select(this).attr('fill', '#f0f0f0')
        }
      })
      .append('title')
      .text((d) => {
        const regionData = getRegionData(d.properties.name)
        return regionData 
          ? `${d.properties.name}: ${regionData.coachesPerMillion} coaches per million`
          : `${d.properties.name}: No data`
      })

    // Add title
    g.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#333')
      .text('UK Regional Distribution')

    g.append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .text('Coaches per Million Population')

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
              backgroundColor: `rgba(25, 118, 210, ${0.3 + getColorIntensity(region.coachesPerMillion) * 0.7})`,
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