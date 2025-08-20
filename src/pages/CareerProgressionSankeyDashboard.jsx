import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import SankeyDiagram from '../components/SankeyDiagram'
import TimelineVisualization from '../components/TimelineVisualization'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import { useCoachData } from '../hooks/useCoachData'


function CareerProgressionSankeyDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [leftSideViews, setLeftSideViews] = useState(['gender']) // Default to gender on left
  const [rightSideViews, setRightSideViews] = useState(['primaryCoachingRole']) // Default to coaching role on right
  const [activeTab, setActiveTab] = useState(0) // 0: Sankey, 1: Timeline
  const [timelineDemographics, setTimelineDemographics] = useState(['gender']) // Demographics for timeline view
  const [timeScale] = useState('yearly') // yearly, monthly, quarterly
  const [showMilestones] = useState(true) // Show milestone markers

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

  const handleLeftSideChange = (_, newViews) => {
    if (newViews !== null) {
      setLeftSideViews(newViews)
    }
  }

  const handleRightSideChange = (_, newViews) => {
    if (newViews !== null) {
      setRightSideViews(newViews)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Function to generate Sankey data based on left/right side views and filters
  const generateSankeyData = () => {
    
    // If no views are selected on either side, return empty
    if (leftSideViews.length === 0 || rightSideViews.length === 0) {
      return { nodes: [], links: [] }
    }

    // Generate combinations for both sides
    const leftCombinations = generateDemographicCombinations(leftSideViews, 'left')
    const rightCombinations = generateDemographicCombinations(rightSideViews, 'right')

    // Create nodes and links based on left/right selections
    const newNodes = []
    const nodeMap = new Map()
    
    // Create left side nodes (sources)
    leftCombinations.forEach((leftCombo, leftIndex) => {
      const nodeIndex = newNodes.length
      newNodes.push({
        id: `left_${leftIndex}`,
        name: leftCombo.label,
        level: 0, // Left side
        type: 'left',
        combination: leftCombo
      })
      nodeMap.set(`left_${leftIndex}`, nodeIndex)
    })
    
    // Create right side nodes (targets)
    rightCombinations.forEach((rightCombo, rightIndex) => {
      const nodeIndex = newNodes.length
      newNodes.push({
        id: `right_${rightIndex}`,
        name: rightCombo.label,
        level: 1, // Right side
        type: 'right',
        combination: rightCombo
      })
      nodeMap.set(`right_${rightIndex}`, nodeIndex)
    })

    // Create links from left side to right side
    const newLinks = []
    
    leftCombinations.forEach((leftCombo, leftIndex) => {
      const sourceIndex = nodeMap.get(`left_${leftIndex}`)
      
      rightCombinations.forEach((rightCombo, rightIndex) => {
        const targetIndex = nodeMap.get(`right_${rightIndex}`)
        
        // Calculate how many coaches match both left and right criteria
        const matchingCoaches = coachData.coaches.filter(coach => {
          // Check if coach matches left side criteria
          const leftMatch = Object.entries(leftCombo.values).every(([key, value]) => {
            const coachProperty = getCoachProperty(coach, key)
            return coachProperty === value
          })
          
          // Check if coach matches right side criteria
          const rightMatch = Object.entries(rightCombo.values).every(([key, value]) => {
            const coachProperty = getCoachProperty(coach, key)
            return coachProperty === value
          })
          
          return leftMatch && rightMatch
        })
        
        const count = matchingCoaches.length
        if (count > 0) {
          newLinks.push({
            source: sourceIndex,
            target: targetIndex,
            value: Math.max(3, count), // Scale for visibility
            originalValue: count,
            leftCombination: leftCombo,
            rightCombination: rightCombo
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

    // Validate data before returning
    if (newNodes.length === 0 || filteredLinks.length === 0) {
      return { nodes: [], links: [] }
    }
    
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
      ageGroup: coach.ageGroup,
      employmentStatus: coach.employmentStatus,
      uefaBadges: coach.uefaBadges
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
          const newLabel = combo.label ? `${combo.label}/${option.label}` : option.label
          newCombinations.push({
            label: newLabel,
            values: { ...combo.values, [view]: option.value }
          })
        })
      })
      
      combinations = newCombinations
    })
    
    // Limit combinations to prevent performance issues and invalid array lengths
    // Cap at 12 combinations per side to show more meaningful combinations
    return combinations.length > 12 ? combinations.slice(0, 12) : combinations
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
      ],
      employmentStatus: [
        { value: 'employed', label: 'Employed' },
        { value: 'unemployed', label: 'Unemployed' }
      ],
      uefaBadges: [
        { value: 'none', label: 'No UEFA Badge' },
        { value: 'uefa-b', label: 'UEFA B License' },
        { value: 'uefa-a', label: 'UEFA A License' },
        { value: 'uefa-pro', label: 'UEFA Pro License' }
      ]
    }
    
    if (activeFilters.length > 0) {
      return allOptions[view]?.filter(option => activeFilters.includes(option.value)) || []
    }
    
    return allOptions[view] || [] // Return all options instead of limiting to 2
  }



    const sankeyData = useMemo(generateSankeyData, [leftSideViews, rightSideViews, coachData, generateSankeyData]);


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
                Coaches Pathway
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                Analyze career progression patterns through Sankey flows and milestone timelines • Filters narrow data within selections
              </Typography>
            </Box>
          </Box>
          <FilterButton 
            onClick={() => setFilterDrawerOpen(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-primary)'
              },
              '& .MuiTab-root': {
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'none',
                minHeight: 'auto',
                py: 1,
                px: 2,
                color: 'var(--color-text-secondary)',
                '&.Mui-selected': {
                  color: 'var(--color-primary)'
                },
                '&:hover': {
                  color: 'var(--color-primary)'
                }
              }
            }}
          >
            <Tab label="Sankey Diagram" />
            <Tab label="Timeline View" />
          </Tabs>
        </Box>

        {/* Controls - Different for each tab */}
        {activeTab === 0 ? (
          // Sankey Controls
        <Grid container spacing={2} sx={{ mb: 1 }}>
          {/* Left Side Selection */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" sx={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: 'var(--color-text-primary)', 
                mb: 0.5
              }}>
                Left Side (Demographics)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleLeftSideChange(null, leftSideViews.includes('gender') ? leftSideViews.filter(v => v !== 'gender') : [...leftSideViews, 'gender'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: leftSideViews.includes('gender') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: leftSideViews.includes('gender') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: leftSideViews.includes('gender') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: leftSideViews.includes('gender') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: leftSideViews.includes('gender') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Gender
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleLeftSideChange(null, leftSideViews.includes('ethnicity') ? leftSideViews.filter(v => v !== 'ethnicity') : [...leftSideViews, 'ethnicity'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: leftSideViews.includes('ethnicity') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: leftSideViews.includes('ethnicity') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: leftSideViews.includes('ethnicity') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: leftSideViews.includes('ethnicity') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: leftSideViews.includes('ethnicity') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Ethnicity
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleLeftSideChange(null, leftSideViews.includes('region') ? leftSideViews.filter(v => v !== 'region') : [...leftSideViews, 'region'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: leftSideViews.includes('region') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: leftSideViews.includes('region') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: leftSideViews.includes('region') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: leftSideViews.includes('region') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: leftSideViews.includes('region') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Region
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleLeftSideChange(null, leftSideViews.includes('ageGroup') ? leftSideViews.filter(v => v !== 'ageGroup') : [...leftSideViews, 'ageGroup'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: leftSideViews.includes('ageGroup') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: leftSideViews.includes('ageGroup') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: leftSideViews.includes('ageGroup') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: leftSideViews.includes('ageGroup') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: leftSideViews.includes('ageGroup') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Age Group
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* Right Side Selection */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" sx={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: 'var(--color-text-primary)', 
                mb: 0.5
              }}>
                Right Side (Professional Attributes)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleRightSideChange(null, rightSideViews.includes('primaryCoachingRole') ? rightSideViews.filter(v => v !== 'primaryCoachingRole') : [...rightSideViews, 'primaryCoachingRole'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: rightSideViews.includes('primaryCoachingRole') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: rightSideViews.includes('primaryCoachingRole') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: rightSideViews.includes('primaryCoachingRole') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: rightSideViews.includes('primaryCoachingRole') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: rightSideViews.includes('primaryCoachingRole') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Coaching Role
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleRightSideChange(null, rightSideViews.includes('level') ? rightSideViews.filter(v => v !== 'level') : [...rightSideViews, 'level'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: rightSideViews.includes('level') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: rightSideViews.includes('level') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: rightSideViews.includes('level') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: rightSideViews.includes('level') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: rightSideViews.includes('level') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Level
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleRightSideChange(null, rightSideViews.includes('positionType') ? rightSideViews.filter(v => v !== 'positionType') : [...rightSideViews, 'positionType'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: rightSideViews.includes('positionType') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: rightSideViews.includes('positionType') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: rightSideViews.includes('positionType') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: rightSideViews.includes('positionType') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: rightSideViews.includes('positionType') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Position Type
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleRightSideChange(null, rightSideViews.includes('division') ? rightSideViews.filter(v => v !== 'division') : [...rightSideViews, 'division'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: rightSideViews.includes('division') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: rightSideViews.includes('division') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: rightSideViews.includes('division') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: rightSideViews.includes('division') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: rightSideViews.includes('division') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Division
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleRightSideChange(null, rightSideViews.includes('employmentStatus') ? rightSideViews.filter(v => v !== 'employmentStatus') : [...rightSideViews, 'employmentStatus'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: rightSideViews.includes('employmentStatus') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: rightSideViews.includes('employmentStatus') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: rightSideViews.includes('employmentStatus') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: rightSideViews.includes('employmentStatus') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: rightSideViews.includes('employmentStatus') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  Employment Status
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleRightSideChange(null, rightSideViews.includes('uefaBadges') ? rightSideViews.filter(v => v !== 'uefaBadges') : [...rightSideViews, 'uefaBadges'])}
                  sx={{ 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    backgroundColor: rightSideViews.includes('uefaBadges') ? 'var(--color-primary)' : 'var(--color-background-primary)',
                    color: rightSideViews.includes('uefaBadges') ? 'var(--color-white)' : 'var(--color-text-secondary)',
                    border: rightSideViews.includes('uefaBadges') ? 'none' : '1px solid var(--color-border)',
                    '&:hover': {
                      backgroundColor: rightSideViews.includes('uefaBadges') ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
                      color: rightSideViews.includes('uefaBadges') ? 'var(--color-white)' : 'var(--color-primary)'
                    }
                  }}
                >
                  UEFA Badges
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        ) : null}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 1, p: 2, backgroundColor: 'var(--color-background-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
            <Typography variant="body2" sx={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: 'var(--color-text-primary)', 
              mb: 1,
              display: 'block'
            }}>
              Active Data Filters (narrowing selected left/right attributes)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(filters).map(([key, values]) => 
                Array.isArray(values) && values.length > 0 ? values.map(value => (
                  <Chip
                    key={`${key}-${value}`}
                    label={`${key}: ${value}`}
                    size="small"
                    variant="filled"
                    sx={{ 
                      fontSize: '10px', 
                      height: '24px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)'
                    }}
                  />
                )) : null
              ).flat().filter(Boolean)}
            </Stack>
          </Box>
        )}

        {/* Main Visualization Area */}
        <Card sx={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', mt: 1 }}>
          <CardContent sx={{ p: 3 }}>
            {activeTab === 0 ? (
              // Sankey Diagram Tab
              <Box sx={{ height: '800px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sankeyData && sankeyData.nodes && sankeyData.nodes.length > 0 ? (
                  <SankeyDiagram 
                    key={JSON.stringify(leftSideViews) + JSON.stringify(rightSideViews) + JSON.stringify(filters)}
                    data={sankeyData} 
                    width={Math.min(1100, window.innerWidth - 320)} 
                    height={780} 
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <Typography variant="body2" sx={{ fontSize: '14px', mb: 1 }}>
                      Select attributes for both left and right sides to view progression flows
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                      Choose at least one demographic (left) and one professional attribute (right)
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              // Timeline View Tab
              <Box sx={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <TimelineVisualization
                  key={JSON.stringify(timelineDemographics) + JSON.stringify(filters) + timeScale + showMilestones}
                  data={coachData}
                  width={Math.min(1000, window.innerWidth - 360)}
                  height={520}
                  demographics={timelineDemographics}
                  onDemographicsChange={setTimelineDemographics}
                />
              </Box>
            )}
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