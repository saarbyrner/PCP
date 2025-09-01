import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import * as d3 from 'd3'

function TimelineVisualization({ data, width = 800, height = 400, demographics = ['ethnicity'], onDemographicsChange }) {
  const svgRef = useRef()
  const [timeScale, setTimeScale] = useState(25) // Default to 25 years per requirement
  const [selectedMilestoneTypes, setSelectedMilestoneTypes] = useState(['role']) // Default to coach roles only

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
    // Get design token colors for charts
    const getChartColors = () => {
      const root = document.documentElement
      return [
        getComputedStyle(root).getPropertyValue('--color-chart-1').trim() || '#3B4960',
        getComputedStyle(root).getPropertyValue('--color-chart-2').trim() || '#29AE61', 
        getComputedStyle(root).getPropertyValue('--color-chart-3').trim() || '#F1C410',
        getComputedStyle(root).getPropertyValue('--color-chart-4').trim() || '#C0392B',
        getComputedStyle(root).getPropertyValue('--color-chart-5').trim() || '#9b58b5'
      ]
    }
    const COLORS = getChartColors()
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

    // Radius scale based on number of coaches per milestone (visible within current time window)
    const allVisibleMilestones = Object.values(processedData)
      .flat()
      .filter(m => m.avgTime <= timeScale)

    const minCount = d3.min(allVisibleMilestones, m => m.count)
    const maxCount = d3.max(allVisibleMilestones, m => m.count)

    // Use sqrt so area ~ count, with sensible min/max radii
    const radiusScale = (maxCount && maxCount > 0)
      ? d3.scaleSqrt()
          .domain([Math.max(1, minCount || 1), maxCount])
          .range([4, 12])
      : () => 6

    // Create tooltip
    const tooltip = d3.select('body').selectAll('.timeline-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'timeline-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'var(--color-background-primary)')
      .style('color', 'var(--color-text-primary)')
      .style('padding', '8px')
      .style('border', '1px solid var(--color-border-primary)')
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
      .style('fill', 'var(--color-text-secondary)')

    // Draw Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', 'var(--color-text-secondary)')

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth/2}, ${innerHeight + 40})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'var(--color-text-primary)')
      .style('font-weight', '500')
      .text('Years in Career')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -70)
      .attr('x', -innerHeight/2)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'var(--color-text-primary)')
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
        .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--color-border-primary').trim() || '#d1d5db')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 2')

      // Sort milestones by time to help with label positioning
      const sortedMilestones = milestones
        .filter(milestone => milestone.avgTime <= timeScale)
        .sort((a, b) => a.avgTime - b.avgTime)

      // Track label positions to avoid overlaps
      const labelPositions = []

      // Draw milestone markers
      sortedMilestones.forEach((milestone) => {
        const xPos = xScale(milestone.avgTime)
        const circleRadius = radiusScale(milestone.count)
        
        // Milestone circle
        g.append('circle')
          .attr('cx', xPos)
          .attr('cy', yPos)
          .attr('r', circleRadius)
          .attr('fill', colorScale(group))
          .attr('stroke', 'var(--color-background-primary)')
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
            
            d3.select(this).attr('r', Math.min(circleRadius + 2, circleRadius * 1.4))
          })
          .on('mouseout', function() {
            tooltip.style('visibility', 'hidden')
            d3.select(this).attr('r', circleRadius)
          })

        // Smart label positioning to avoid overlaps
        const truncatedName = milestone.milestone.length > 12 
          ? milestone.milestone.substring(0, 10) + '...' 
          : milestone.milestone

        // Calculate label position, checking for collisions
        let labelY = yPos - 12

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
            .style('fill', 'var(--color-text-primary)')
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
        .style('fill', 'var(--color-text-primary)')
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
      // Add ethnicity differentials so White reaches badges earlier; others later
      'uefa-b': { 
        avgYears: 4, 
        correlations: { 
          gender: { male: 1.0, female: 1.2 },
          level: { senior: 0.9, junior: 1.3 },
          ethnicity: { white: 0.85, asian: 1.15, black: 1.25, mixed: 1.25, other: 1.20 }
        } 
      },
      'uefa-a': { 
        avgYears: 8, 
        correlations: { 
          gender: { male: 1.0, female: 1.4 },
          level: { senior: 0.8, junior: 1.6 },
          ethnicity: { white: 0.85, asian: 1.20, black: 1.30, mixed: 1.30, other: 1.25 }
        } 
      },
      'uefa-pro': { 
        avgYears: 15, 
        correlations: { 
          gender: { male: 1.0, female: 1.6 },
          level: { senior: 0.9, junior: 2.2 },
          ethnicity: { white: 0.80, asian: 1.25, black: 1.40, mixed: 1.40, other: 1.30 }
        } 
      },
      
      // All actual coaching roles from data
      // Reduced role set per issue #23 (remove 1st team, goalkeeping, cross-club)
      'academy-coach': { avgYears: 3, correlations: { level: { senior: 1.2, junior: 0.8 } } },
      // Rename label later to "Assistant 1st Team Coach" and delay black/mixed demographics 3-4y (multiplier ~1.5)
      'assistant-coach': { 
        avgYears: 6, 
        correlations: { 
          level: { senior: 0.9, junior: 1.4 },
          // Target: Black & Mixed 3-4y later than White; White earlier than others
          // White 0.6 => 3.6y, Asian/Other 1.0 => 6y, Black/Mixed 1.2 => 7.2y (≈3.6y gap from White)
          ethnicity: { white: 0.6, asian: 1.0, other: 1.0, black: 1.2, mixed: 1.2 }
        } 
      },
      // Head coach: delay black/mixed 5-6y (multiplier ~1.5 on 12y baseline)
      'head-coach': { 
        avgYears: 12, 
        correlations: { 
          level: { senior: 0.7, junior: 2.5 },
          // Target: Black & Mixed 5-6y later than White; Asian & Other similar to each other and > White
          // White 0.8 => 9.6y, Asian/Other 1.0 => 12y, Black/Mixed 1.3 => 15.6y (≈6y gap from White)
          ethnicity: { white: 0.8, asian: 1.0, other: 1.0, black: 1.3, mixed: 1.3 }
        } 
      },
      
      // Level progression - should vary based on role and demographics
      'junior': { 
        avgYears: 2, 
        correlations: {
          gender: { male: 1.0, female: 1.3 },
          primaryCoachingRole: {
            'academy-coach': 0.8,
            'assistant-coach': 1.0,
            'head-coach': 1.5
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
            'head-coach': 1.2
          }
        } 
      }
    }

    // Group coaches by demographic combination
    const demographicGroups = {}
    coaches.forEach(coach => {
      let groupKey = demographics.map(demo => {
        let value = coach[demo]
        // Normalise region codes to readable labels
        if (demo === 'region' && value) {
          value = value
            .replace(/-/g,' ')
            .replace('yorkshire humber','Yorkshire & Humber')
            .replace('east england','East of England')
            .replace(/\b([a-z])/g, c=>c.toUpperCase())
        }
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
  const roles = ['academy-coach', 'assistant-coach', 'head-coach']
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
            
            const rawLabel = role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            const label = role === 'assistant-coach' ? 'Assistant 1st Team Coach' : rawLabel
            results[group].push({
              milestone: label,
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

  // Post-process: ensure for ROLE milestones White is earliest and Black/Mixed are +4y later

    // Collect role milestone names present
    const roleMilestoneNames = new Set()
    Object.values(results).forEach(arr => arr.forEach(m => { if (m.type === 'role') roleMilestoneNames.add(m.milestone) }))

    roleMilestoneNames.forEach(roleName => {
      // Find white group's time (group containing 'White')
      let whiteEntry
      Object.entries(results).forEach(([group, arr]) => {
        if (group.includes('White')) {
          const found = arr.find(m => m.type === 'role' && m.milestone === roleName)
            if (found && (!whiteEntry || found.avgTime < whiteEntry.avgTime)) whiteEntry = found
        }
      })
      if (!whiteEntry) return
      const whiteTime = whiteEntry.avgTime
      // Adjust black & mixed groups
      Object.entries(results).forEach(([group, arr]) => {
        const entry = arr.find(m => m.type === 'role' && m.milestone === roleName)
        if (!entry) return
        if (group.includes('Black') || group.includes('Mixed')) {
          const target = whiteTime + 4
          if (entry.avgTime < target) entry.avgTime = Math.round(target * 10) / 10
        } else if (!group.includes('White')) {
          // Ensure other groups not earlier than white
            if (entry.avgTime <= whiteTime) entry.avgTime = Math.round((whiteTime + 1) * 10) / 10
        } else {
          // Ensure white remains the minimum
          if (entry.avgTime > whiteTime) whiteEntry.avgTime = whiteTime
        }
      })
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

  const toggleDemographic = (demo) => {
    if (onDemographicsChange) {
      const newDemographics = demographics.includes(demo) 
        ? demographics.filter(d => d !== demo)
        : [...demographics, demo]
      onDemographicsChange(newDemographics)
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Controls Container */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {/* Compare Demographics Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Compare Demographics:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button 
              size="small" 
              variant={demographics.includes('gender') ? 'contained' : 'outlined'}
              onClick={() => toggleDemographic('gender')}
              sx={{ 
                fontSize: '10px', 
                textTransform: 'none', 
                minWidth: 'auto', 
                px: 1.5, 
                py: 0.5,
                backgroundColor: demographics.includes('gender') ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                color: demographics.includes('gender') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                '&:hover': {
                  backgroundColor: demographics.includes('gender') ? 'var(--color-primary-dark)' : 'var(--color-background-tertiary)',
                  color: demographics.includes('gender') ? 'var(--color-white)' : 'var(--color-primary)',
                  border: '1px solid var(--color-border)'
                }
              }}
            >
              Gender
            </Button>
            <Button 
              size="small" 
              variant={demographics.includes('ethnicity') ? 'contained' : 'outlined'}
              onClick={() => toggleDemographic('ethnicity')}
              sx={{ 
                fontSize: '10px', 
                textTransform: 'none', 
                minWidth: 'auto', 
                px: 1.5, 
                py: 0.5,
                backgroundColor: demographics.includes('ethnicity') ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                color: demographics.includes('ethnicity') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                '&:hover': {
                  backgroundColor: demographics.includes('ethnicity') ? 'var(--color-primary-dark)' : 'var(--color-background-tertiary)',
                  color: demographics.includes('ethnicity') ? 'var(--color-white)' : 'var(--color-primary)',
                  border: '1px solid var(--color-border)'
                }
              }}
            >
              Ethnicity
            </Button>
            <Button 
              size="small" 
              variant={demographics.includes('region') ? 'contained' : 'outlined'}
              onClick={() => toggleDemographic('region')}
              sx={{ 
                fontSize: '10px', 
                textTransform: 'none', 
                minWidth: 'auto', 
                px: 1.5, 
                py: 0.5,
                backgroundColor: demographics.includes('region') ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                color: demographics.includes('region') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                '&:hover': {
                  backgroundColor: demographics.includes('region') ? 'var(--color-primary-dark)' : 'var(--color-background-tertiary)',
                  color: demographics.includes('region') ? 'var(--color-white)' : 'var(--color-primary)',
                  border: '1px solid var(--color-border)'
                }
              }}
            >
              Region
            </Button>
          </Box>
        </Box>

        {/* Time Scale Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Time Scale:
          </Typography>
          <ButtonGroup size="small" sx={{
            '& .MuiButton-root': {
              fontSize: '10px',
              textTransform: 'none',
              minWidth: '45px',
              px: 1,
              backgroundColor: 'var(--color-background-secondary)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              '&:hover': {
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-border)'
              },
              '&.MuiButton-contained': {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: '1px solid var(--color-primary)',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark)',
                  color: 'var(--color-white)',
                  border: '1px solid var(--color-primary-dark)'
                }
              }
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
          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Show Milestones:
          </Typography>
          <ButtonGroup size="small" sx={{
            '& .MuiButton-root': {
              fontSize: '10px',
              textTransform: 'none',
              minWidth: '70px',
              px: 1.5,
              backgroundColor: 'var(--color-background-secondary)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              '&:hover': {
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-border)'
              },
              '&.MuiButton-contained': {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: '1px solid var(--color-primary)',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark)',
                  color: 'var(--color-white)',
                  border: '1px solid var(--color-primary-dark)'
                }
              }
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
      {demographics.length > 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          width: '100%'
        }}>
          <svg ref={svgRef}></svg>
        </Box>
      ) : (
        <Box sx={{ 
          height: '400px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center', 
          color: 'var(--color-text-secondary)' 
        }}>
          <Typography variant="body2" sx={{ fontSize: '14px', mb: 1 }}>
            Select at least one demographic to compare milestone timelines
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '12px' }}>
            Choose Gender, Ethnicity, or Region to see career progression patterns
          </Typography>
        </Box>
      )}
    </Box>
  )
}

TimelineVisualization.propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  demographics: PropTypes.arrayOf(PropTypes.string),
  onDemographicsChange: PropTypes.func
}

export default TimelineVisualization