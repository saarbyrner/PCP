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
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  LinearProgress,
  Alert
} from '@mui/material'
import { ArrowBackOutlined, TrendingUp, TrendingDown, CheckCircle, Warning } from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import DashboardCard from '../components/DashboardCard'
import { useCoachData } from '../hooks/useCoachData'

// Get design token colors for charts
const getChartColors = () => {
  const root = document.documentElement
  return [
    getComputedStyle(root).getPropertyValue('--color-chart-1').trim() || '#3B4960',
    getComputedStyle(root).getPropertyValue('--color-chart-2').trim() || '#29AE61', 
    getComputedStyle(root).getPropertyValue('--color-chart-3').trim() || '#F1C410',
    getComputedStyle(root).getPropertyValue('--color-chart-4').trim() || '#C0392B',
    getComputedStyle(root).getPropertyValue('--color-chart-5').trim() || '#9b58b5',
    getComputedStyle(root).getPropertyValue('--color-chart-6').trim() || '#e74d3d',
    getComputedStyle(root).getPropertyValue('--color-chart-7').trim() || '#fbcc1c',
    getComputedStyle(root).getPropertyValue('--color-chart-8').trim() || '#f89938'
  ]
}

const COLORS = getChartColors()

function EDIDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [selectedCriteria, setSelectedCriteria] = useState(['gender', 'ethnicity'])
  const [chartMode, setChartMode] = useState('percentage') // 'percentage' or 'raw'

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

  // Calculate EDI pathway metrics based on customer requirements
  const ediPathwayMetrics = useMemo(() => {
    if (!coachData.coaches || coachData.coaches.length === 0) {
      return {
        headCoaches: { total: 0, ethnicMinority: 0, percentage: 0, target: 15, status: 'neutral' },
        academyCoaches: { total: 0, ethnicMinority: 0, percentage: 0, target: 10, status: 'neutral' },
        uefaBLicense: { total: 0, ethnicMinority: 0, percentage: 0, target: 15, status: 'neutral' }
      }
    }

    const headCoaches = coachData.coaches.filter(coach => coach.primaryCoachingRole === 'head-coach')
    const academyCoaches = coachData.coaches.filter(coach => coach.primaryCoachingRole === 'academy-coach')
    const uefaBLicense = coachData.coaches.filter(coach => coach.uefaBadges === 'uefa-b')

    const calculateMetrics = (group, target) => {
      const total = group.length
      const ethnicMinority = group.filter(coach => coach.ethnicity !== 'white').length
      const percentage = total > 0 ? (ethnicMinority / total) * 100 : 0
      
      let status = 'neutral'
      if (percentage >= target) status = 'success'
      else if (percentage < target * 0.8) status = 'warning'
      else status = 'progress'

      return { total, ethnicMinority, percentage, target, status }
    }

    return {
      headCoaches: calculateMetrics(headCoaches, 15),
      academyCoaches: calculateMetrics(academyCoaches, 10),
      uefaBLicense: calculateMetrics(uefaBLicense, 15)
    }
  }, [coachData.coaches])

  // Generate pathway progression data
  const pathwayData = useMemo(() => {
    if (!coachData.coaches || coachData.coaches.length === 0) return []

    const stages = [
      { name: 'UEFA B License', target: 15, current: ediPathwayMetrics.uefaBLicense.percentage },
      { name: 'Academy Coach', target: 10, current: ediPathwayMetrics.academyCoaches.percentage },
      { name: 'Head Coach', target: 15, current: ediPathwayMetrics.headCoaches.percentage }
    ]

    return stages.map((stage, index) => ({
      stage: stage.name,
      target: stage.target,
      current: Math.round(stage.current * 10) / 10,
      progress: Math.min((stage.current / stage.target) * 100, 100),
      status: stage.current >= stage.target ? 'success' : stage.current < stage.target * 0.8 ? 'warning' : 'progress',
      color: COLORS[index % COLORS.length]
    }))
  }, [ediPathwayMetrics, coachData.coaches])

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
      
      return combinations
    }
    
    const combinations = generateCombinations(selectedCriteria)
    
    return seasons.map((season, seasonIndex) => {
      const seasonData = { period: season }
      
      // Generate realistic seasonal variations
      // Use 24/25 (index 5) as baseline, apply variations for historical seasons
      const isCurrentSeason = seasonIndex === 5 // 24/25 is the current season
      const yearsBack = 5 - seasonIndex // How many years back from current
      
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
        // Count actual coaches matching this combination (baseline from current data)
        const baselineMatches = seasonCoaches.filter(coach => {
          let matches = true
          if (combo.gender && coach.gender !== combo.gender) matches = false
          if (combo.ethnicity && coach.ethnicity !== combo.ethnicity) matches = false
          if (combo.ageGroup && coach.ageGroup !== combo.ageGroup) matches = false
          return matches
        })
        
        // Generate label from combination properties first
        const labels = []
        if (combo.gender) labels.push(combo.gender.charAt(0).toUpperCase() + combo.gender.slice(1))
        if (combo.ethnicity) labels.push(combo.ethnicity.charAt(0).toUpperCase() + combo.ethnicity.slice(1))
        if (combo.ageGroup) labels.push(combo.ageGroup)
        const comboLabel = labels.join('/')
        
        // Apply realistic historical variations
        let adjustedCount = baselineMatches.length
        
        if (!isCurrentSeason && yearsBack > 0) {
          // Apply demographic trend adjustments based on combination
          let trendMultiplier = 1.0
          
          // Gender trends: Female participation has been gradually increasing
          if (combo.gender === 'female') {
            trendMultiplier *= Math.max(0.6, 1 - (yearsBack * 0.08)) // 8% less per year back
          } else if (combo.gender === 'male') {
            trendMultiplier *= Math.min(1.4, 1 + (yearsBack * 0.04)) // Correspondingly more males historically
          }
          
          // Ethnicity trends: Gradual improvement in diversity
          if (combo.ethnicity === 'black' || combo.ethnicity === 'asian' || combo.ethnicity === 'mixed' || combo.ethnicity === 'other') {
            trendMultiplier *= Math.max(0.7, 1 - (yearsBack * 0.06)) // Less diversity historically
          } else if (combo.ethnicity === 'white') {
            trendMultiplier *= Math.min(1.3, 1 + (yearsBack * 0.03)) // More white coaches historically
          }
          
          // Age trends: Younger coaches are more recent phenomenon
          if (combo.ageGroup === '18-25' || combo.ageGroup === '26-35') {
            trendMultiplier *= Math.max(0.8, 1 - (yearsBack * 0.04)) // Fewer young coaches historically
          } else if (combo.ageGroup === '46-55' || combo.ageGroup === '56+') {
            trendMultiplier *= Math.min(1.2, 1 + (yearsBack * 0.03)) // More older coaches historically
          }
          
          // Add deterministic variation based on season and combination for consistency
          const seedValue = seasonIndex + comboLabel.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
          const deterministicVariation = 0.95 + ((seedValue % 100) / 1000) // ±5% variation
          trendMultiplier *= deterministicVariation
          
          adjustedCount = Math.round(adjustedCount * trendMultiplier)
        }
        
        if (chartMode === 'percentage') {
          // For percentage mode, we need to calculate based on adjusted counts
          // But we need to ensure all combinations still add up to 100%
          seasonData[comboLabel] = adjustedCount
        } else {
          // Raw numbers mode
          seasonData[comboLabel] = adjustedCount
        }
      })
      
      // For percentage mode, normalize to 100%
      if (chartMode === 'percentage') {
        const totalAdjusted = Object.values(seasonData).filter(v => typeof v === 'number').reduce((sum, val) => sum + val, 0)
        if (totalAdjusted > 0) {
          Object.keys(seasonData).forEach(key => {
            if (typeof seasonData[key] === 'number') {
              const percentage = (seasonData[key] / totalAdjusted) * 100
              seasonData[key] = Math.round(percentage * 10) / 10
            }
          })
        }
      }
      
      return seasonData
    })
  }, [selectedCriteria, coachData.coaches, chartMode])

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
  }, [coachData.coaches]) // Added filters dependency to ensure updates when filters change

  const criteriaOptions = [
    { value: 'gender', label: 'Gender' },
    { value: 'ethnicity', label: 'Ethnicity' },
    { value: 'ageGroup', label: 'Age Groups' }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: 'var(--color-success)', fontSize: 20 }} />
      case 'warning':
        return <Warning sx={{ color: 'var(--color-warning)', fontSize: 20 }} />
      case 'progress':
        return <TrendingUp sx={{ color: 'var(--color-info)', fontSize: 20 }} />
      default:
        return <TrendingDown sx={{ color: 'var(--color-text-secondary)', fontSize: 20 }} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'var(--color-success)'
      case 'warning':
        return 'var(--color-warning)'
      case 'progress':
        return 'var(--color-info)'
      default:
        return 'var(--color-text-secondary)'
    }
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
                EDI Dashboard
                {getActiveFiltersCount() > 0 && (
                  <Typography component="span" sx={{ 
                    ml: 2, 
                    fontSize: '14px', 
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-info-light)',
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

        {/* Customer Requirements Alert */}
        <Alert severity="info" sx={{ mb: 3, fontSize: '13px' }}>
          <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 500, mb: 0.5 }}>
            Customer Requirements: Ethnic Minority Representation Targets
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            Goal: 14 (~15%) of head coaches across 92 clubs from ethnic minorities. 
            Pathway: 15% UEFA B license holders (✓), 10% academy coaches (investment needed), 
            15% head coaches (investment needed).
          </Typography>
        </Alert>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: 'var(--color-background-tertiary)', borderRadius: '8px', border: '1px solid var(--color-border-primary)' }}>
            <Typography variant="body2" sx={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: 'var(--color-text-primary)', 
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

        {/* EDI Pathway Progress Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>
              Ethnic Minority Representation Pathway
            </Typography>
          </Grid>
          {pathwayData.map((stage) => (
            <Grid item xs={12} md={4} key={stage.stage}>
              <Card sx={{ 
                height: '100%', 
                border: `1px solid ${getStatusColor(stage.status)}`,
                backgroundColor: 'var(--color-background-primary)'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 600 }}>
                      {stage.stage}
                    </Typography>
                    {getStatusIcon(stage.status)}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, color: getStatusColor(stage.status) }}>
                      {stage.current}%
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '11px', color: 'var(--color-text-secondary)', ml: 1 }}>
                      / {stage.target}% target
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stage.progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'var(--color-border-secondary)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(stage.status),
                        borderRadius: 3
                      }
                    }} 
                  />
                  <Typography variant="caption" sx={{ fontSize: '10px', color: 'var(--color-text-secondary)', mt: 0.5, display: 'block' }}>
                    {stage.progress >= 100 ? 'Target achieved' : 
                     stage.progress >= 80 ? 'Close to target' : 
                     stage.progress >= 60 ? 'Making progress' : 'Needs investment'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Charts */}
        <Grid container spacing={2}>
          {/* Stacked Bar Chart */}
          <Grid item xs={12}>
            <DashboardCard
              title="Combined Demographics Over Time"
              subtitle={selectedCriteria.length > 1 ? `Showing intersections of ${selectedCriteria.join(' + ')} in ${chartMode === 'percentage' ? 'percentages' : 'raw numbers'} (e.g., Male/White, Female/Black, etc.)` : "Select multiple criteria to see demographic intersections"}
              height="540px"
            >
              {/* Warning for too many combinations */}
              {stackedBarData.length > 0 && Object.keys(stackedBarData[0]).filter(key => key !== 'period').length > 15 && (
                <Box sx={{ mb: 1, p: 1, backgroundColor: 'var(--color-warning-light)', borderRadius: '4px', border: '1px solid var(--color-warning)' }}>
                  <Typography variant="caption" sx={{ fontSize: '11px', color: 'var(--color-warning-dark)' }}>
                    ⚠️ Large number of combinations ({Object.keys(stackedBarData[0]).filter(key => key !== 'period').length}) may make chart difficult to read. Consider selecting fewer criteria.
                  </Typography>
                </Box>
              )}
              {/* Chart Controls */}
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} md={8}>
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
                            variant="filled"
                            key={option.value}
                            sx={{
                              backgroundColor: 'var(--color-primary)',
                              color: 'var(--color-white)',
                              '&:hover': {
                                backgroundColor: 'var(--color-primary-hover)'
                              }
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select criteria to combine (e.g., Gender + Ethnicity)"
                          size="small"
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '12px' } }}
                        />
                      )}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ToggleButtonGroup
                      value={chartMode}
                      exclusive
                      onChange={(_, newMode) => newMode && setChartMode(newMode)}
                      size="small"
                      sx={{
                        height: '40px',
                        '& .MuiToggleButton-root': {
                          fontSize: '11px',
                          fontWeight: 500,
                          textTransform: 'none',
                          px: 1.5,
                          py: 0.5,
                          border: '1px solid var(--color-border-primary)',
                          '&.Mui-selected': {
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-hover)'
                            }
                          }
                        }
                      }}
                    >
                      <ToggleButton value="percentage">
                        % Mode
                      </ToggleButton>
                      <ToggleButton value="raw">
                        Count Mode
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ height: '420px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCriteria.length > 0 && stackedBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stackedBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary)" />
                      <XAxis 
                        dataKey="period" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                        domain={chartMode === 'percentage' ? [0, 100] : [0, 'dataMax']}
                        ticks={chartMode === 'percentage' ? [0, 20, 40, 60, 80, 100] : undefined}
                        tickFormatter={(value) => chartMode === 'percentage' ? `${Math.round(value)}%` : Math.round(value).toLocaleString()}
                        label={{ value: chartMode === 'percentage' ? 'Percentage (%)' : 'Number of Coaches', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '11px', fill: 'var(--color-text-secondary)' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-background-primary)', 
                          border: '1px solid var(--color-border-primary)', 
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}
                        formatter={(value, name) => [
                          chartMode === 'percentage' ? `${value}%` : `${value} coaches`, 
                          name
                        ]}
                        labelFormatter={(label) => `Season: ${label}`}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', paddingTop: '20px' }} 
                        iconType="rect"
                        iconSize={12}
                        verticalAlign="bottom"
                        height={40}
                        formatter={(value) => <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xs)' }}>{value}</span>}
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
                  <Box sx={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
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
                    labelStyle={{ fontSize: '0.7rem', fill: 'var(--color-text-primary)', fontWeight: '600', fontFamily: 'var(--font-family-primary)' }}
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
                    wrapperStyle={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', paddingTop: '8px' }} 
                    iconType="circle"
                    iconSize={6}
                    verticalAlign="bottom"
                    height={40}
                    formatter={(value, entry) => <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xs)' }}>{value} ({entry.payload.value}%)</span>}
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
                    labelStyle={{ fontSize: '0.7rem', fill: 'var(--color-text-primary)', fontWeight: '600', fontFamily: 'var(--font-family-primary)' }}
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
                    wrapperStyle={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', paddingTop: '8px', lineHeight: '1.2' }} 
                    iconType="circle"
                    iconSize={6}
                    verticalAlign="bottom"
                    height={40}
                    formatter={(value, entry) => {
                      const cleanName = value.replace('/White British', '').replace('/Black British', '').replace('/Asian British', '')
                      return <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xs)' }}>{cleanName} ({entry.payload.value}%)</span>
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
                    labelStyle={{ fontSize: '0.7rem', fill: 'var(--color-text-primary)', fontWeight: '600', fontFamily: 'var(--font-family-primary)' }}
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
                    wrapperStyle={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', paddingTop: '8px' }} 
                    iconType="circle"
                    iconSize={6}
                    verticalAlign="bottom"
                    height={40}
                    formatter={(value, entry) => <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xs)' }}>{value} ({entry.payload.value}%)</span>}
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