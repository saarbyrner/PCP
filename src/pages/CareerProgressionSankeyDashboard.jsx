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
import { useCoachData } from '../hooks/useCoachData'


function CareerProgressionSankeyDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [activeViews, setActiveViews] = useState(['primaryCoachingRole']) // Default to coaching role

  // Use coach data with filtering
  const coachData = useCoachData(filters)

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) && value.length > 0
    ).length
  }

  const handleViewModeChange = (_, newViews) => {
    if (newViews && newViews.length > 0) {
      setActiveViews(newViews)
    }
  }

  // Function to generate Sankey data based on active views and filters
  const generateSankeyData = () => {
    console.log('generateSankeyData called with:', { activeViews, filters })
    
    const baseSankeyData = coachData.sankeyData
    const demographicViews = activeViews
    
    // If no views are selected, return basic career progression
    if (demographicViews.length === 0) {
      return baseSankeyData
    }

    // Generate demographic combinations for selected views
    const demographicCombinations = generateDemographicCombinations(demographicViews)
    console.log('Generated demographic combinations:', demographicCombinations)

    // Create a proper career progression flow with demographic breakdown
    const newNodes = []
    const nodeMap = new Map()
    
    // Create career stage nodes (right side - destinations)
    const careerStages = ['academy_coach', 'assistant_coach', 'head_coach', 'technical_director', 'other_roles']
    careerStages.forEach((stage, stageIndex) => {
      const stageData = baseSankeyData.nodes.find(n => n.id === stage)
      if (stageData) {
        const nodeIndex = newNodes.length
        newNodes.push({
          id: `career_${stage}`,
          name: stageData.name,
          level: 1, // Right side
          type: 'career'
        })
        nodeMap.set(`career_${stage}`, nodeIndex)
      }
    })

    // Create demographic nodes (left side - sources)
    demographicCombinations.forEach((demoCombination, demoIndex) => {
      const nodeIndex = newNodes.length
      newNodes.push({
        id: `demo_${demoIndex}`,
        name: demoCombination.label,
        level: 0, // Left side
        type: 'demographic',
        demographic: demoCombination
      })
      nodeMap.set(`demo_${demoIndex}`, nodeIndex)
    })

    // Create links from demographic groups to career stages
    const newLinks = []
    
    demographicCombinations.forEach((demoCombination, demoIndex) => {
      const sourceIndex = nodeMap.get(`demo_${demoIndex}`)
      
      // Calculate how many coaches from this demographic are in each career stage
      const coachesInDemo = coachData.coaches.filter(coach => {
        return Object.entries(demoCombination.values).every(([key, value]) => {
          const coachProperty = getCoachProperty(coach, key)
          return coachProperty === value
        })
      })

      // Group by current career stage
      const stageGroups = {}
      coachesInDemo.forEach(coach => {
        const stage = coach.currentStage
        stageGroups[stage] = (stageGroups[stage] || 0) + 1
      })

      // Create links to each career stage that has coaches
      Object.entries(stageGroups).forEach(([stage, count]) => {
        const targetIndex = nodeMap.get(`career_${stage}`)
        if (targetIndex !== undefined && count > 0) {
          newLinks.push({
            source: sourceIndex,
            target: targetIndex,
            value: Math.max(5, count * 2), // Scale for visibility
            originalValue: count,
            demographic: demoCombination
          })
        }
      })
    })

    // Apply intelligent scaling to improve visual representation
    const filteredLinks = newLinks.filter(link => link.value > 0)
    
    if (filteredLinks.length > 0) {
      const maxValue = Math.max(...filteredLinks.map(link => link.value))
      const minValue = Math.min(...filteredLinks.map(link => link.value))
      
      // If values are too similar (all very small), apply additional scaling
      if (maxValue < 15 || (maxValue - minValue) < 8) {
        const scaleFactor = Math.max(2, 20 / maxValue)
        filteredLinks.forEach(link => {
          link.value = Math.max(8, Math.round(link.value * scaleFactor))
        })
      }
    }

    console.log('Generated Sankey data:', { nodes: newNodes.length, links: filteredLinks.length })
    
    return {
      nodes: newNodes,
      links: filteredLinks
    }
  }

  // Helper function to get coach property (moved from useCoachData for access)
  function getCoachProperty(coach, filterKey) {
    const propertyMap = {
      season: coach.season,
      region: coach.region,
      ethnicity: coach.ethnicity,
      gender: coach.gender,
      primaryCoachingRole: coach.primaryCoachingRole,
      level: coach.level,
      positionType: coach.positionType,
      division: coach.division,
      ageGroup: coach.ageGroup
    }
    return propertyMap[filterKey]
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



  const sankeyData = useMemo(() => generateSankeyData(), [activeViews, filters, coachData])


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
                Progression Flow
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                Toggle buttons select demographic dimensions to analyze • Filters narrow data within selected dimensions
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
          <Typography variant="body2" sx={{ 
            fontSize: '13px', 
            fontWeight: 600, 
            color: '#333', 
            mb: 1.5
          }}>
            Select Demographic Dimensions to Analyze
          </Typography>
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
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: '#333', 
              mb: 1,
              display: 'block'
            }}>
              Active Data Filters (narrowing selected dimensions)
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
            <Box sx={{ height: '800px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SankeyDiagram 
                key={JSON.stringify(activeViews) + JSON.stringify(filters)}
                data={sankeyData} 
                width={Math.min(1100, window.innerWidth - 320)} 
                height={780} 
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