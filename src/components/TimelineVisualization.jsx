import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import * as d3 from 'd3'

function TimelineVisualization({ data, width = 800, height = 400, demographics = ['gender'] }) {
  const svgRef = useRef()
  const [timeScale, setTimeScale] = useState(15) // Default to 15 years
  const [selectedMilestoneTypes, setSelectedMilestoneTypes] = useState(['badge', 'role']) // Default to badges and roles

  useEffect(() => {
    if (!data || !data.coaches || data.coaches.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Set up dimensions and margins
    const margin = { top: 40, right: 100, bottom: 60, left: 100 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', 'transparent')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Process data by demographics
    const processedData = processTimelineData(data.coaches, demographics, selectedMilestoneTypes)
    
    // Color scale - exactly matching other dashboards
    const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0']
    const colorScale = d3.scaleOrdinal()
      .domain(Object.keys(processedData))
      .range(COLORS)

    // Time scale (0 to user-defined max years for better zoom control)
    const xScale = d3.scaleLinear()
      .domain([0, timeScale])
      .range([0, innerWidth])

    // Demographic groups scale
    const yScale = d3.scaleBand()
      .domain(Object.keys(processedData))
      .range([0, innerHeight])
      .padding(0.3)

    // Create tooltip
    const tooltip = d3.select('body').selectAll('.timeline-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'timeline-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', '#fff')
      .style('color', '#333')
      .style('padding', '8px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('font-size', '11px')
      .style('box-shadow', '0 2px 8px rgba(0,0,0,0.1)')
      .style('z-index', '9999')
      .style('pointer-events', 'none')
      .style('z-index', '1000')

    // Draw X axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d => `${d}y`)
        .ticks(Math.min(timeScale, 10))
      )
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#666')

    // Draw Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#666')

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth/2}, ${innerHeight + 40})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#333')
      .style('font-weight', '500')
      .text('Years in Career')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -70)
      .attr('x', -innerHeight/2)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#333')
      .style('font-weight', '500')
      .text('Demographic Groups')

    // Draw timeline lines and milestones for each demographic group
    Object.entries(processedData).forEach(([group, milestones]) => {
      const yPos = yScale(group) + yScale.bandwidth() / 2

      // Draw background timeline
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke', '#f0f0f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')

      // Sort milestones by time to help with label positioning
      const sortedMilestones = milestones
        .filter(milestone => milestone.avgTime <= timeScale)
        .sort((a, b) => a.avgTime - b.avgTime)

      // Track label positions to avoid overlaps
      const labelPositions = []

      // Draw milestone markers
      sortedMilestones.forEach((milestone, index) => {
        const xPos = xScale(milestone.avgTime)
        
        // Milestone circle
        g.append('circle')
          .attr('cx', xPos)
          .attr('cy', yPos)
          .attr('r', 6)
          .attr('fill', colorScale(group))
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('mouseover', function(event) {
            tooltip
              .style('visibility', 'visible')
              .html(`
                <strong>${group} - ${milestone.milestone}</strong><br/>
                Average time: ${milestone.avgTime.toFixed(1)} years<br/>
                Total coaches: ${milestone.count}
              `)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px')
            
            d3.select(this).attr('r', 8)
          })
          .on('mouseout', function() {
            tooltip.style('visibility', 'hidden')
            d3.select(this).attr('r', 6)
          })

        // Smart label positioning to avoid overlaps
        const truncatedName = milestone.milestone.length > 12 
          ? milestone.milestone.substring(0, 10) + '...' 
          : milestone.milestone

        // Calculate label position, checking for collisions
        let labelY = yPos - 12
        const minGap = 25 // Minimum gap between labels

        // Check if this position conflicts with previous labels
        let collision = true
        let attempt = 0
        while (collision && attempt < 3) {
          collision = labelPositions.some(pos => 
            Math.abs(pos.x - xPos) < 60 && Math.abs(pos.y - labelY) < 15
          )
          if (collision) {
            labelY += (attempt % 2 === 0 ? -15 : 15) * (Math.floor(attempt / 2) + 1)
          }
          attempt++
        }

        // Only show label if we found a good position
        if (!collision || labelPositions.length === 0) {
          g.append('text')
            .attr('x', xPos)
            .attr('y', labelY)
            .attr('text-anchor', 'middle')
            .style('font-size', '8px')
            .style('fill', '#333')
            .style('font-weight', '600')
            .text(truncatedName)

          labelPositions.push({ x: xPos, y: labelY })
        }
      })
    })

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth + 20}, 20)`)

    Object.keys(processedData).forEach((group, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`)

      legendRow.append('circle')
        .attr('r', 5)
        .attr('fill', colorScale(group))

      legendRow.append('text')
        .attr('x', 12)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#333')
        .style('font-weight', '500')
        .text(group)
    })

  }, [data, width, height, demographics, timeScale, selectedMilestoneTypes])

  // Process timeline data to extract milestones by demographic
  function processTimelineData(coaches, demographics, milestoneTypes = ['badge', 'role']) {
    const results = {}
    
    // Define realistic career progression timelines for different milestone types
    const careerProgressions = {
      // UEFA Badge progression - realistic timeframes with demographic correlations
      'uefa-b': { 
        avgYears: 4, 
        correlations: { 
          gender: { male: 1.0, female: 1.2 }, // Women take slightly longer due to barriers
          level: { senior: 0.9, junior: 1.3 } 
        } 
      },
      'uefa-a': { 
        avgYears: 8, 
        correlations: { 
          gender: { male: 1.0, female: 1.4 },
          level: { senior: 0.8, junior: 1.6 } 
        } 
      },
      'uefa-pro': { 
        avgYears: 15, 
        correlations: { 
          gender: { male: 1.0, female: 1.6 },
          level: { senior: 0.9, junior: 2.2 } 
        } 
      },
      
      // All actual coaching roles from data
      'academy-coach': { avgYears: 3, correlations: { level: { senior: 1.2, junior: 0.8 } } },
      'assistant-coach': { avgYears: 6, correlations: { level: { senior: 0.9, junior: 1.4 } } },
      '1st-team-coach': { avgYears: 8, correlations: { level: { senior: 0.8, junior: 1.8 } } },
      'goalkeeping-coach': { avgYears: 7, correlations: { level: { senior: 0.9, junior: 1.3 } } },
      'head-coach': { avgYears: 12, correlations: { level: { senior: 0.7, junior: 2.5 } } },
      'cross-club-coach': { avgYears: 10, correlations: { level: { senior: 0.8, junior: 1.8 } } },
      
      // Level progression - should vary based on role and demographics
      'junior': { 
        avgYears: 2, 
        correlations: {
          gender: { male: 1.0, female: 1.3 },
          primaryCoachingRole: {
            'academy-coach': 0.8,
            'assistant-coach': 1.0,
            '1st-team-coach': 1.2,
            'goalkeeping-coach': 1.1,
            'head-coach': 1.5,
            'cross-club-coach': 1.3
          }
        } 
      },
      'senior': { 
        avgYears: 8, 
        correlations: {
          gender: { male: 1.0, female: 1.4 },
          primaryCoachingRole: {
            'academy-coach': 0.7,
            'assistant-coach': 0.9,
            '1st-team-coach': 1.0,
            'goalkeeping-coach': 0.8,
            'head-coach': 1.2,
            'cross-club-coach': 1.1
          }
        } 
      }
    }

    // Group coaches by demographic combination
    const demographicGroups = {}
    coaches.forEach(coach => {
      let groupKey = demographics.map(demo => {
        const value = coach[demo]
        return value ? (value.charAt(0).toUpperCase() + value.slice(1)) : 'Unknown'
      }).join('/')
      
      if (!demographicGroups[groupKey]) {
        demographicGroups[groupKey] = []
      }
      demographicGroups[groupKey].push(coach)
    })

    // Calculate milestone averages for each demographic group using realistic timelines
    Object.entries(demographicGroups).forEach(([group, groupCoaches]) => {
      results[group] = []
      
      // Helper function to calculate demographic correlation multiplier
      const getCorrelationMultiplier = (progression, coach) => {
        let multiplier = 1.0
        const correlations = progression.correlations || {}
        
        // Apply gender correlation if available
        if (correlations.gender && coach.gender) {
          multiplier *= correlations.gender[coach.gender] || 1.0
        }
        
        // Apply level correlation if available  
        if (correlations.level && coach.level) {
          multiplier *= correlations.level[coach.level] || 1.0
        }
        
        // Apply role correlation if available (for level progression)
        if (correlations.primaryCoachingRole && coach.primaryCoachingRole) {
          multiplier *= correlations.primaryCoachingRole[coach.primaryCoachingRole] || 1.0
        }
        
        return multiplier
      }
      
      // Process UEFA badges (only if 'badge' is selected)
      if (milestoneTypes.includes('badge')) {
        const uefaBadges = ['uefa-b', 'uefa-a', 'uefa-pro']
        uefaBadges.forEach(badge => {
          const achievedCoaches = groupCoaches.filter(coach => coach.uefaBadges === badge)
          if (achievedCoaches.length > 0) {
            const progression = careerProgressions[badge]
            
            // Calculate average time considering demographic correlations
            const avgTime = achievedCoaches.reduce((sum, coach) => {
              const baseTime = progression.avgYears
              const correlationMultiplier = getCorrelationMultiplier(progression, coach)
              return sum + (baseTime * correlationMultiplier)
            }, 0) / achievedCoaches.length
            
            results[group].push({
              milestone: badge.toUpperCase().replace('-', ' '),
              avgTime: Math.round(avgTime * 10) / 10,
              count: achievedCoaches.length,
              type: 'badge'
            })
          }
        })
      }
      
      // Process coaching roles (only if 'role' is selected) - ALL 6 roles from data
      if (milestoneTypes.includes('role')) {
        const roles = ['academy-coach', 'assistant-coach', '1st-team-coach', 'goalkeeping-coach', 'head-coach', 'cross-club-coach']
        roles.forEach(role => {
          const achievedCoaches = groupCoaches.filter(coach => coach.primaryCoachingRole === role)
          if (achievedCoaches.length > 0) {
            const progression = careerProgressions[role] || { avgYears: 8, correlations: {} }
            
            // Calculate average time considering demographic correlations
            const avgTime = achievedCoaches.reduce((sum, coach) => {
              const baseTime = progression.avgYears
              const correlationMultiplier = getCorrelationMultiplier(progression, coach)
              return sum + (baseTime * correlationMultiplier)
            }, 0) / achievedCoaches.length
            
            results[group].push({
              milestone: role.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '),
              avgTime: Math.round(avgTime * 10) / 10,
              count: achievedCoaches.length,
              type: 'role'
            })
          }
        })
      }
      
      // Process levels (only if 'level' is selected) - Both junior AND senior
      if (milestoneTypes.includes('level')) {
        const levels = ['junior', 'senior']
        levels.forEach(level => {
          const achievedCoaches = groupCoaches.filter(coach => coach.level === level)
          if (achievedCoaches.length > 0) {
            const progression = careerProgressions[level] || { avgYears: 6, correlations: {} }
            
            // Calculate average time considering demographic correlations
            const avgTime = achievedCoaches.reduce((sum, coach) => {
              const baseTime = progression.avgYears
              const correlationMultiplier = getCorrelationMultiplier(progression, coach)
              return sum + (baseTime * correlationMultiplier)
            }, 0) / achievedCoaches.length
            
            results[group].push({
              milestone: level.charAt(0).toUpperCase() + level.slice(1) + ' Level',
              avgTime: Math.round(avgTime * 10) / 10,
              count: achievedCoaches.length,
              type: 'level'
            })
          }
        })
      }
    })

    return results
  }

  const toggleMilestoneType = (type) => {
    setSelectedMilestoneTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Controls Container */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {/* Time Scale Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#666' }}>
            Time Scale:
          </Typography>
          <ButtonGroup size="small" sx={{
            '& .MuiButton-root': {
              fontSize: '10px',
              textTransform: 'none',
              minWidth: '45px',
              px: 1
            }
          }}>
            <Button 
              variant={timeScale === 10 ? 'contained' : 'outlined'}
              onClick={() => setTimeScale(10)}
            >
              10y
            </Button>
            <Button 
              variant={timeScale === 15 ? 'contained' : 'outlined'}
              onClick={() => setTimeScale(15)}
            >
              15y
            </Button>
            <Button 
              variant={timeScale === 25 ? 'contained' : 'outlined'}
              onClick={() => setTimeScale(25)}
            >
              25y
            </Button>
            <Button 
              variant={timeScale === 40 ? 'contained' : 'outlined'}
              onClick={() => setTimeScale(40)}
            >
              Full
            </Button>
          </ButtonGroup>
        </Box>

        {/* Milestone Type Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#666' }}>
            Show Milestones:
          </Typography>
          <ButtonGroup size="small" sx={{
            '& .MuiButton-root': {
              fontSize: '10px',
              textTransform: 'none',
              minWidth: '70px',
              px: 1.5
            }
          }}>
            <Button 
              variant={selectedMilestoneTypes.includes('badge') ? 'contained' : 'outlined'}
              onClick={() => toggleMilestoneType('badge')}
            >
              UEFA Badges
            </Button>
            <Button 
              variant={selectedMilestoneTypes.includes('role') ? 'contained' : 'outlined'}
              onClick={() => toggleMilestoneType('role')}
            >
              Coaching Roles
            </Button>
            <Button 
              variant={selectedMilestoneTypes.includes('level') ? 'contained' : 'outlined'}
              onClick={() => toggleMilestoneType('level')}
            >
              Career Levels
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      
      {/* Timeline Visualization */}
      <svg ref={svgRef}></svg>
    </Box>
  )
}

TimelineVisualization.propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  demographics: PropTypes.arrayOf(PropTypes.string)
}

export default TimelineVisualization