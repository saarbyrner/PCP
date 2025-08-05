import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  IconButton,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import UKMap from '../components/UKMap'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import { useCoachData } from '../hooks/useCoachData'

function GeospatialDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [containerDimensions, setContainerDimensions] = useState({ width: 1200, height: 800 })
  const containerRef = useRef()

  // Use coach data with filtering
  const coachData = useCoachData(filters)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerDimensions({
          width: rect.width - 20, // Account for padding
          height: rect.height - 20
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) && value.length > 0
    ).length
  }

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
                UK Regional Coaching Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                Interactive geographical analysis of coaching distribution across UK regions
              </Typography>
            </Box>
          </Box>
          <FilterButton 
            onClick={() => setFilterDrawerOpen(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />
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

        {/* Full-Screen Map */}
        <Card sx={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', height: 'calc(100vh - 120px)' }}>
          <CardContent sx={{ p: 0, height: '100%', '&:last-child': { pb: 0 } }}>
            <Box 
              ref={containerRef}
              sx={{ 
                height: '100%', 
                width: '100%', 
                position: 'relative'
              }}
            >
              <UKMap 
                data={coachData.regionalDistribution} 
                width={containerDimensions.width} 
                height={containerDimensions.height} 
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

export default GeospatialDashboard