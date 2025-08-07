import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Autocomplete,
  TextField,
  Chip,
  Stack
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import DashboardCard from '../components/DashboardCard'
import { useCoachData } from '../hooks/useCoachData'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0', '#2196f3', '#ff5722', '#607d8b']

function EDIDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [selectedCriteria, setSelectedCriteria] = useState(['gender', 'ethnicity'])

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

  // Generate combined demographic data from actual filtered coaches
  const stackedBarData = useMemo(() => {
    if (!coachData.coaches || selectedCriteria.length === 0) return []
    
    const seasons = ['19/20', '20/21', '21/22', '22/23', '23/24', '24/25']
    const filteredCoaches = coachData.coaches // This is already filtered by the useCoachData hook
    
    // Generate all combinations of selected criteria
    const generateCombinations = (criteriaList) => {
      if (criteriaList.length === 0) return [{}]
      if (criteriaList.length === 1) {
        const criteria = criteriaList[0]
        if (criteria === 'gender') return [{ gender: 'male' }, { gender: 'female' }]
        if (criteria === 'ethnicity') return [{ ethnicity: 'white' }, { ethnicity: 'black' }, { ethnicity: 'asian' }, { ethnicity: 'mixed' }, { ethnicity: 'other' }]
        if (criteria === 'ageGroup') return [{ ageGroup: '18-25' }, { ageGroup: '26-35' }, { ageGroup: '36-45' }, { ageGroup: '46-55' }, { ageGroup: '56+' }]
        return [{}]
      }
      
      // Combine multiple criteria
      let combinations = [{}]
      criteriaList.forEach(criteria => {
        const newCombinations = []
        let options = []
        if (criteria === 'gender') options = ['male', 'female']
        else if (criteria === 'ethnicity') options = ['white', 'black', 'asian', 'mixed', 'other']
        else if (criteria === 'ageGroup') options = ['18-25', '26-35', '36-45', '46-55', '56+']
        
        combinations.forEach(combo => {
          options.forEach(option => {
            newCombinations.push({ ...combo, [criteria]: option })
          })
        })
        combinations = newCombinations
      })
      return combinations.slice(0, 10) // Limit to 10 combinations for readability
    }
    
    const combinations = generateCombinations(selectedCriteria)
    
    return seasons.map(season => {
      const seasonData = { period: season }
      
      // Use all filtered coaches for current analysis (synthetic data doesn't have historical seasons)
      // In real implementation, you would filter by actual season data
      const seasonCoaches = filteredCoaches
      const totalCoaches = seasonCoaches.length
      
      if (totalCoaches === 0) {
        // If no coaches match filters, return zero data
        combinations.forEach(combo => {
          const labels = []
          if (combo.gender) labels.push(combo.gender.charAt(0).toUpperCase() + combo.gender.slice(1))
          if (combo.ethnicity) labels.push(combo.ethnicity.charAt(0).toUpperCase() + combo.ethnicity.slice(1))
          if (combo.ageGroup) labels.push(combo.ageGroup)
          const comboLabel = labels.join('/')
          seasonData[comboLabel] = 0
        })
        return seasonData
      }
      
      combinations.forEach(combo => {
        // Count actual coaches matching this combination
        const matchingCoaches = seasonCoaches.filter(coach => {
          let matches = true
          if (combo.gender && coach.gender !== combo.gender) matches = false
          if (combo.ethnicity && coach.ethnicity !== combo.ethnicity) matches = false
          if (combo.ageGroup && coach.ageGroup !== combo.ageGroup) matches = false
          return matches
        })
        
        // Generate label for combination
        const labels = []
        if (combo.gender) labels.push(combo.gender.charAt(0).toUpperCase() + combo.gender.slice(1))
        if (combo.ethnicity) labels.push(combo.ethnicity.charAt(0).toUpperCase() + combo.ethnicity.slice(1))
        if (combo.ageGroup) labels.push(combo.ageGroup)
        
        const comboLabel = labels.join('/')
        const percentage = totalCoaches > 0 ? (matchingCoaches.length / totalCoaches) * 100 : 0
        seasonData[comboLabel] = Math.round(percentage * 10) / 10
      })
      
      return seasonData
    })
  }, [selectedCriteria, coachData.coaches, filters])

  // Generate chart data for demographics using recharts format - these automatically use filtered data
  const genderData = coachData.genderDistribution || []
  const ethnicityData = coachData.ethnicityDistribution?.breakdown || []
  const ageData = useMemo(() => {
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
  }, [coachData.coaches, filters]) // Added filters dependency to ensure updates when filters change

  const criteriaOptions = [
    { value: 'gender', label: 'Gender' },
    { value: 'ethnicity', label: 'Ethnicity' },
    { value: 'ageGroup', label: 'Age Groups' }
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
                {getActiveFiltersCount() > 0 && (
                  <Typography component="span" sx={{ 
                    ml: 2, 
                    fontSize: '14px', 
                    color: '#1976d2',
                    backgroundColor: '#e3f2fd',
                    px: 1,
                    py: 0.25,
                    borderRadius: '12px',
                    fontWeight: 500
                  }}>
                    {coachData.totalCoaches} coaches (filtered)
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                Equality, Diversity & Inclusion metrics • {getActiveFiltersCount() > 0 ? 'Showing filtered data' : 'All coaches shown'}
              </Typography>
            </Box>
          </Box>
          <FilterButton 
            onClick={() => setFilterDrawerOpen(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />
        </Box>

        {/* Controls */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ 
            fontSize: '13px', 
            fontWeight: 600, 
            color: '#333', 
            mb: 1
          }}>
            Select Multiple Criteria for Combined Analysis
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
                placeholder="Select criteria to combine (e.g., Gender + Ethnicity = Male/White, Female/Black, etc.)"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px' } }}
              />
            )}
            sx={{ width: '100%', maxWidth: '800px' }}
          />
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
              title="Combined Demographics Over Time"
              subtitle={selectedCriteria.length > 1 ? `Showing intersections of ${selectedCriteria.join(' + ')} (e.g., Male/White, Female/Black, etc.)` : "Select multiple criteria to see demographic intersections"}
              height="500px"
            >
              <Box sx={{ height: '420px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCriteria.length > 0 && stackedBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stackedBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="period" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#666' }}
                        label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '11px', fill: '#666' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #ccc', 
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                        labelFormatter={(label) => `Season: ${label}`}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', color: '#333', paddingTop: '20px' }} 
                        iconType="rect"
                        iconSize={12}
                        verticalAlign="bottom"
                        height={40}
                        formatter={(value) => <span style={{ color: '#333', fontSize: '10px' }}>{value}</span>}
                      />
                      {/* Dynamically generate bars for each combination */}
                      {stackedBarData.length > 0 && Object.keys(stackedBarData[0]).filter(key => key !== 'period').map((key, index) => (
                        <Bar 
                          key={key}
                          dataKey={key} 
                          stackId="a"
                          fill={COLORS[index % COLORS.length]} 
                          name={key}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', color: '#666' }}>
                    <Typography variant="body2" sx={{ fontSize: '14px', mb: 1 }}>
                      Select criteria above to display combined demographic analysis
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                      Choose multiple criteria to see intersections (e.g., Gender + Ethnicity shows Male/White, Female/Black, etc.)
                    </Typography>
                  </Box>
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Donut Charts Row - using recharts for consistency */}
          <Grid item xs={12} md={4}>
            <DashboardCard title="Gender Distribution" height="360px">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    label={({ value }) => value > 3 ? `${value}%` : ''}
                    labelStyle={{ fontSize: '12px', fill: '#333', fontWeight: '600' }}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', color: '#333', paddingTop: '8px' }} 
                    iconType="circle"
                    iconSize={6}
                    verticalAlign="bottom"
                    height={40}
                    formatter={(value, entry) => <span style={{ color: '#333', fontSize: '11px' }}>{value} ({entry.payload.value}%)</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard title="Ethnicity Distribution" height="360px">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ethnicityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    label={({ value }) => value > 0.5 ? `${value}%` : ''}
                    labelStyle={{ fontSize: '10px', fill: '#333', fontWeight: '600' }}
                  >
                    {ethnicityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                    formatter={(value, name) => [`${value}%`, name.replace('/White British', '').replace('/Black British', '').replace('/Asian British', '')]}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px', color: '#333', paddingTop: '8px', lineHeight: '1.2' }} 
                    iconType="circle"
                    iconSize={6}
                    verticalAlign="bottom"
                    height={40}
                    formatter={(value, entry) => {
                      const cleanName = value.replace('/White British', '').replace('/Black British', '').replace('/Asian British', '')
                      return <span style={{ color: '#333', fontSize: '10px' }}>{cleanName} ({entry.payload.value}%)</span>
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard title="Age Group Distribution" height="360px">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    label={({ value }) => value > 3 ? `${value}%` : ''}
                    labelStyle={{ fontSize: '12px', fill: '#333', fontWeight: '600' }}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', color: '#333', paddingTop: '8px' }} 
                    iconType="circle"
                    iconSize={6}
                    verticalAlign="bottom"
                    height={40}
                    formatter={(value, entry) => <span style={{ color: '#333', fontSize: '11px' }}>{value} ({entry.payload.value}%)</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
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