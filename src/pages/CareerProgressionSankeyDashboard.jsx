import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Stack,
  Divider
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import SankeyDiagram from '../components/SankeyDiagram'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import { useFilteredData } from '../hooks/useFilteredData'
import pcpData from '../data/pcp.json'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0', '#e91e63', '#00bcd4', '#8bc34a', '#ffc107']

function CareerProgressionSankeyDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [activeViews, setActiveViews] = useState(['overall']) // Multi-select array

  // Use filtered data based on current filter selections
  const filteredData = useFilteredData(pcpData.leagueData, filters)
  const advancedData = pcpData.leagueData.advancedProgressionData

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) && value.length > 0
    ).length
  }

  const handleViewModeChange = (event, newViews) => {
    if (newViews && newViews.length > 0) {
      setActiveViews(newViews)
    }
  }

  // Function to generate Sankey data based on active views and filters
  const generateSankeyData = () => {
    console.log('generateSankeyData called with:', { activeViews, filters })
    
    const baseData = advancedData.careerProgression
    const filterMultiplier = filteredData._filterMultiplier || 1.0
    const demographicViews = activeViews.filter(view => view !== 'overall')
    
    // If only overall view is selected, return simple flow
    if (demographicViews.length === 0) {
      return {
        nodes: baseData.nodes.map(node => ({ ...node })),
        links: baseData.links.map(link => ({
          source: baseData.nodes.findIndex(n => n.id === link.source),
          target: baseData.nodes.findIndex(n => n.id === link.target),
          value: Math.max(1, Math.round(link.value * filterMultiplier)),
          originalValue: link.value,
          demographics: link.demographics
        })).filter(link => link.value > 0)
      }
    }

    // Generate demographic combinations for selected views
    const demographicCombinations = generateDemographicCombinations(demographicViews)
    console.log('Generated demographic combinations:', demographicCombinations)

    // Create nodes for each demographic + career stage combination
    const newNodes = []
    const nodeMap = new Map()
    
    baseData.nodes.forEach(stageNode => {
      demographicCombinations.forEach((demoCombination, demoIndex) => {
        const nodeId = `${stageNode.id}_${demoIndex}`
        const nodeName = `${demoCombination.label}\n${stageNode.name}`
        
        newNodes.push({
          id: nodeId,
          name: nodeName,
          level: stageNode.level,
          demographic: demoCombination
        })
        
        nodeMap.set(`${stageNode.id}_${demoIndex}`, newNodes.length - 1)
      })
    })

    // Create links between demographic-specific nodes
    const newLinks = []
    
    baseData.links.forEach(link => {
      demographicCombinations.forEach((demoCombination, demoIndex) => {
        // Calculate the value for this specific demographic combination
        const demographicValue = calculateDemographicValue(link, demoCombination)
        
        if (demographicValue > 0) {
          const sourceNodeIndex = nodeMap.get(`${link.source}_${demoIndex}`)
          const targetNodeIndex = nodeMap.get(`${link.target}_${demoIndex}`)
          
          if (sourceNodeIndex !== undefined && targetNodeIndex !== undefined) {
            newLinks.push({
              source: sourceNodeIndex,
              target: targetNodeIndex,
              value: Math.max(1, Math.round(demographicValue * filterMultiplier)),
              originalValue: link.value,
              demographics: link.demographics,
              demographicCombo: demoCombination
            })
          }
        }
      })
    })

    console.log('Generated Sankey data:', { nodes: newNodes.length, links: newLinks.length })
    
    return {
      nodes: newNodes,
      links: newLinks.filter(link => link.value > 0)
    }
  }

  // Generate all combinations of selected demographics
  const generateDemographicCombinations = (views) => {
    if (views.length === 0) return [{ label: 'All', values: {} }]
    
    let combinations = [{ label: '', values: {} }]
    
    views.forEach(view => {
      const newCombinations = []
      const activeFilters = filters[view] || []
      
      // Use filtered options if filters are applied, otherwise use all options
      const options = getDemographicOptions(view, activeFilters)
      
      combinations.forEach(combo => {
        options.forEach(option => {
          newCombinations.push({
            label: combo.label ? `${combo.label} + ${option.label}` : option.label,
            values: { ...combo.values, [view]: option.value }
          })
        })
      })
      
      combinations = newCombinations
    })
    
    // Only limit combinations if there are too many (more than 20)
    // This ensures all data is shown unless it becomes unwieldy
    return combinations.length > 20 ? combinations.slice(0, 20) : combinations
  }

  // Get demographic options for a view
  const getDemographicOptions = (view, activeFilters) => {
    const allOptions = {
      gender: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ],
      ethnicity: [
        { value: 'white', label: 'White' },
        { value: 'black', label: 'Black' },
        { value: 'asian', label: 'Asian' },
        { value: 'mixed', label: 'Mixed' },
        { value: 'other', label: 'Other' }
      ],
      region: [
        { value: 'london', label: 'London' },
        { value: 'south-east', label: 'South East' },
        { value: 'south-west', label: 'South West' },
        { value: 'west-midlands', label: 'West Midlands' },
        { value: 'east-midlands', label: 'East Midlands' },
        { value: 'east-england', label: 'East of England' },
        { value: 'yorkshire-humber', label: 'Yorkshire & The Humber' },
        { value: 'north-west', label: 'North West' },
        { value: 'north-east', label: 'North East' },
        { value: 'scotland', label: 'Scotland' },
        { value: 'wales', label: 'Wales' },
        { value: 'northern-ireland', label: 'Northern Ireland' }
      ],
      ageGroup: [
        { value: '18-25', label: '18-25' },
        { value: '26-35', label: '26-35' },
        { value: '36-45', label: '36-45' },
        { value: '46-55', label: '46-55' },
        { value: '56+', label: '56+' }
      ],
      primaryCoachingRole: [
        { value: 'head-coach', label: 'Head Coach' },
        { value: 'assistant-coach', label: 'Assistant Coach' },
        { value: '1st-team-coach', label: '1st Team Coach' },
        { value: 'academy-coach', label: 'Academy Coach' },
        { value: 'goalkeeping-coach', label: 'Goalkeeping Coach' },
        { value: 'cross-club-coach', label: 'Cross-Club Coach' }
      ],
      level: [
        { value: 'senior', label: 'Senior' },
        { value: 'junior', label: 'Junior' }
      ],
      positionType: [
        { value: 'full-time', label: 'Full-Time' },
        { value: 'part-time', label: 'Part-Time' }
      ],
      division: [
        { value: 'premier-league', label: 'Premier League' },
        { value: 'efl', label: 'EFL' },
        { value: 'womens-super-league', label: "Women's Super League" },
        { value: 'womens-championship', label: "Women's Championship" },
        { value: 'academy', label: 'Academy' }
      ]
    }
    
    if (activeFilters.length > 0) {
      return allOptions[view]?.filter(option => activeFilters.includes(option.value)) || []
    }
    
    return allOptions[view] || [] // Return all options instead of limiting to 2
  }

  // Calculate the value for a specific demographic combination
  const calculateDemographicValue = (link, demoCombination) => {
    if (!link.demographics) return link.value
    
    let value = link.value
    
    Object.entries(demoCombination.values).forEach(([view, demoValue]) => {
      const demographicData = link.demographics[view]
      if (demographicData) {
        const totalForView = Object.values(demographicData).reduce((sum, val) => sum + val, 0)
        const specificValue = demographicData[demoValue] || 0
        const proportion = totalForView > 0 ? specificValue / totalForView : 0
        value *= proportion
      }
    })
    
    return Math.round(value)
  }


  const sankeyData = useMemo(() => generateSankeyData(), [activeViews, filters, filteredData, advancedData])

  // Calculate key metrics for the current view
  const calculateMetrics = () => {
    const progressionData = advancedData.progressionByDemographics
    let metrics = {
      entryToAcademy: 0.55,
      academyToAssistant: 0.29,
      assistantToHead: 0.08,
      headToTechnical: 0.27,
      retentionRate: 0.68
    }

    if (activeViews.includes('overall')) {
      return metrics
    }

    // Calculate weighted average across all active demographic views
    let weightedMetrics = {
      entryToAcademy: 0,
      academyToAssistant: 0,
      assistantToHead: 0,
      headToTechnical: 0,
      retentionRate: 0
    }
    let totalWeight = 0

    activeViews.forEach(view => {
      if (view === 'overall') return

      const viewFilters = filters[view] || []
      const demographicData = progressionData[view]
      
      if (demographicData) {
        if (viewFilters.length > 0) {
          // Average selected demographic values
          viewFilters.forEach(filterValue => {
            const metricData = demographicData[filterValue]
            if (metricData) {
              Object.keys(weightedMetrics).forEach(key => {
                weightedMetrics[key] += metricData[key] || 0
              })
              totalWeight++
            }
          })
        } else {
          // Average all demographic values for this view
          Object.values(demographicData).forEach(metricData => {
            Object.keys(weightedMetrics).forEach(key => {
              weightedMetrics[key] += metricData[key] || 0
            })
            totalWeight++
          })
        }
      }
    })

    if (totalWeight > 0) {
      Object.keys(weightedMetrics).forEach(key => {
        metrics[key] = weightedMetrics[key] / totalWeight
      })
    }

    return metrics
  }

  const currentMetrics = useMemo(() => calculateMetrics(), [activeViews, filters, advancedData])

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ 
        flexGrow: 1, 
        p: 2,
        transition: 'margin 0.225s cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        marginRight: filterDrawerOpen ? '16px' : 0
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/analysis')} sx={{ mr: 1, p: 1 }}>
              <ArrowBackOutlined fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
                Career Progression Flow Analysis
              </Typography>
            </Box>
          </Box>
          <FilterButton 
            onClick={() => setFilterDrawerOpen(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />
        </Box>

        {/* View Mode Selection - Multi-select */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={activeViews}
            onChange={handleViewModeChange}
            size="small"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'none',
                px: 2,
                py: 1,
                border: '1px solid #e0e0e0',
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }
              }
            }}
          >
            <ToggleButton value="overall">Overall Progression</ToggleButton>
            <ToggleButton value="gender">Gender</ToggleButton>
            <ToggleButton value="ethnicity">Ethnicity</ToggleButton>
            <ToggleButton value="region">Region</ToggleButton>
            <ToggleButton value="ageGroup">Age Group</ToggleButton>
            <ToggleButton value="primaryCoachingRole">Coaching Role</ToggleButton>
            <ToggleButton value="level">Level</ToggleButton>
            <ToggleButton value="positionType">Position Type</ToggleButton>
            <ToggleButton value="division">Division</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              color: '#666', 
              mb: 1,
              display: 'block'
            }}>
              Active Filters
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(filters).map(([key, values]) => 
                Array.isArray(values) && values.length > 0 ? values.map(value => (
                  <Chip
                    key={`${key}-${value}`}
                    label={`${key}: ${value}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '10px', height: '24px' }}
                  />
                )) : null
              ).flat().filter(Boolean)}
            </Stack>
          </Box>
        )}

        {/* Main Sankey Diagram - Full Width */}
        <Card sx={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ height: '700px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SankeyDiagram 
                key={JSON.stringify(activeViews) + JSON.stringify(filters)}
                data={sankeyData} 
                width={Math.min(1100, window.innerWidth - 120)} 
                height={680} 
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onFiltersChange={handleFiltersChange}
        filters={filters}
      />
    </Box>
  )
}

export default CareerProgressionSankeyDashboard