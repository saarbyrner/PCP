import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ukRegionsData from '../assets/uk-regions.json'

function MapTest() {
  const svgRef = useRef()

  useEffect(() => {
    console.log('MapTest: Component mounted')
    console.log('MapTest: ukRegionsData loaded:', ukRegionsData ? 'YES' : 'NO')
    console.log('MapTest: Features count:', ukRegionsData?.features?.length || 'NONE')
    
    if (ukRegionsData?.features?.length > 0) {
      console.log('MapTest: First feature:', ukRegionsData.features[0])
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    if (!ukRegionsData || !ukRegionsData.features) {
      console.error('MapTest: No GeoJSON data available')
      return
    }

    const width = 600
    const height = 400

    console.log('MapTest: Setting up projection...')
    
    // Set up projection
    const projection = d3.geoMercator()
      .fitSize([width - 40, height - 80], ukRegionsData)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    console.log('MapTest: Creating SVG elements...')

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')

    // Add a test rectangle to verify SVG is working
    g.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 50)
      .attr('height', 30)
      .attr('fill', 'red')
      .attr('stroke', 'black')

    // Add test text
    g.append('text')
      .attr('x', 70)
      .attr('y', 30)
      .attr('font-size', '12px')
      .attr('fill', 'black')
      .text('Test: SVG Working')

    // Try to render the map
    try {
      console.log('MapTest: Attempting to render map paths...')
      
      const paths = g.selectAll('path.region')
        .data(ukRegionsData.features)
        .enter()
        .append('path')
        .attr('class', 'region')
        .attr('d', path)
        .attr('fill', 'lightblue')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)

      console.log('MapTest: Paths created:', paths.size())

      // Add title
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', 'black')
        .text(`UK Map Test - ${ukRegionsData.features.length} regions loaded`)

    } catch (error) {
      console.error('MapTest: Error rendering map:', error)
      
      // Add error text
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', 'red')
        .text('Error: Failed to render map')
    }

  }, [])

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h3>UK Map Test Component</h3>
      <p>Testing GeoJSON data loading and D3 rendering...</p>
      <svg 
        ref={svgRef}
        style={{ 
          background: '#f8f9fa', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px' 
        }}
      />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>Check console for detailed logs</p>
        <p>You should see: Red test rectangle, test text, and UK map regions</p>
      </div>
    </div>
  )
}

export default MapTest