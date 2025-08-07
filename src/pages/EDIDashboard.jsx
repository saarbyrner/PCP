import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Card,
  CardContent,
  Autocomplete,
  TextField,
  Chip,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import StackedBarChart from '../components/StackedBarChart'
import DonutChart from '../components/DonutChart'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import DashboardCard from '../components/DashboardCard'
import { useCoachData } from '../hooks/useCoachData'

function EDIDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [selectedCriteria, setSelectedCriteria] = useState(['gender', 'ethnicity'])
  const [dateRange, setDateRange] = useState('all')

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

  // Generate time-based stacked bar chart data
  const stackedBarData = useMemo(() => {
    const seasons = ['19/20', '20/21', '21/22', '22/23', '23/24', '24/25']
    
    return seasons.map(season => {
      const seasonData = { period: season }
      
      selectedCriteria.forEach(criteria => {
        if (criteria === 'gender') {
          seasonData.male = Math.round(Math.random() * 20 + 70) // 70-90%
          seasonData.female = 100 - seasonData.male
        } else if (criteria === 'ethnicity') {
          seasonData.white = Math.round(Math.random() * 15 + 80) // 80-95%
          seasonData.black = Math.round(Math.random() * 8 + 2) // 2-10%
          seasonData.asian = Math.round(Math.random() * 5 + 2) // 2-7%
          seasonData.mixed = Math.round(Math.random() * 3 + 1) // 1-4%
          seasonData.other = Math.max(1, 100 - (seasonData.white + seasonData.black + seasonData.asian + seasonData.mixed))
        } else if (criteria === 'ageGroup') {
          seasonData['18-25'] = Math.round(Math.random() * 10 + 5) // 5-15%
          seasonData['26-35'] = Math.round(Math.random() * 15 + 25) // 25-40%
          seasonData['36-45'] = Math.round(Math.random() * 15 + 30) // 30-45%
          seasonData['46-55'] = Math.round(Math.random() * 10 + 15) // 15-25%
          seasonData['56+'] = Math.max(1, 100 - (seasonData['18-25'] + seasonData['26-35'] + seasonData['36-45'] + seasonData['46-55']))
        }
      })
      
      return seasonData
    })
  }, [selectedCriteria])

  // Generate donut chart data for demographics
  const genderData = useMemo(() => {
    if (!coachData.genderDistribution) return []
    return coachData.genderDistribution.map(item => ({
      name: item.name,
      value: Math.round(item.value * 10) / 10
    }))
  }, [coachData.genderDistribution])

  const ethnicityData = useMemo(() => {
    if (!coachData.ethnicityDistribution?.breakdown) return []
    return coachData.ethnicityDistribution.breakdown
      .filter(item => item.value > 0)
      .map(item => ({
        name: item.name.replace('/White British', '').replace('/Black British', '').replace('/Asian British', ''),
        value: Math.round(item.value * 10) / 10
      }))
  }, [coachData.ethnicityDistribution])

  const ageData = useMemo(() => {
    // Generate age data from coaches
    if (!coachData.coaches || coachData.coaches.length === 0) return []
    
    const ageCounts = coachData.coaches.reduce((acc, coach) => {
      const ageGroup = coach.ageGroup
      acc[ageGroup] = (acc[ageGroup] || 0) + 1
      return acc
    }, {})
    
    const total = coachData.coaches.length
    return Object.entries(ageCounts).map(([ageGroup, count]) => ({
      name: ageGroup,
      value: Math.round((count / total) * 1000) / 10
    }))
  }, [coachData.coaches])

  const criteriaOptions = [
    { value: 'gender', label: 'Gender' },
    { value: 'ethnicity', label: 'Ethnicity' },
    { value: 'ageGroup', label: 'Age Groups' },
    { value: 'region', label: 'Region' },
    { value: 'division', label: 'Division' }
  ]

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
                EDI Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                Equality, Diversity & Inclusion metrics across time periods • Interactive demographic analysis
              </Typography>
            </Box>
          </Box>
          <FilterButton 
            onClick={() => setFilterDrawerOpen(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />
        </Box>

        {/* Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#333', 
                mb: 1
              }}>
                Select Multiple Criteria for Stack Chart
              </Typography>
              <Autocomplete
                multiple
                options={criteriaOptions}
                getOptionLabel={(option) => option.label}
                value={criteriaOptions.filter(option => selectedCriteria.includes(option.value))}
                onChange={(_, newValue) => setSelectedCriteria(newValue.map(item => item.value))}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option.label}
                      {...getTagProps({ index })}
                      size="small"
                      key={option.value}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select criteria to display"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px' } }}
                  />
                )}
                sx={{ width: '100%' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#333', 
                mb: 1
              }}>
                Date Range
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{ fontSize: '13px' }}
                >
                  <MenuItem value="all">All Years</MenuItem>
                  <MenuItem value="recent">Last 3 Years</MenuItem>
                  <MenuItem value="current">Current Season</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

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
              Active Data Filters
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

        {/* Main Charts */}
        <Grid container spacing={2}>
          {/* Stacked Bar Chart */}
          <Grid item xs={12}>
            <DashboardCard
              title="Interactive Demographics Over Time"
              subtitle="Stack bar chart showing demographic trends across seasons"
              height="500px"
            >
              <Box sx={{ height: '420px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCriteria.length > 0 ? (
                  <StackedBarChart 
                    data={stackedBarData}
                    width={Math.min(900, window.innerWidth - 400)}
                    height={400}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', color: '#666' }}>
                    <Typography variant="body2" sx={{ fontSize: '14px' }}>
                      Select at least one criteria to display the stacked bar chart
                    </Typography>
                  </Box>
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Donut Charts Row */}
          <Grid item xs={12} md={4}>
            <DashboardCard
              title="Gender Split"
              subtitle="Current gender distribution"
              height="380px"
            >
              <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DonutChart 
                  data={genderData}
                  width={280}
                  height={280}
                  title="Gender"
                />
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard
              title="Ethnicity Split"
              subtitle="Current ethnic diversity breakdown"
              height="380px"
            >
              <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DonutChart 
                  data={ethnicityData}
                  width={280}
                  height={280}
                  title="Ethnicity"
                />
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard
              title="Age Split"
              subtitle="Current age group distribution"
              height="380px"
            >
              <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DonutChart 
                  data={ageData}
                  width={280}
                  height={280}
                  title="Age Groups"
                />
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
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

export default EDIDashboard