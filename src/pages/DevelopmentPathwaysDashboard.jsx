import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts'
import DashboardCard from '../components/DashboardCard'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import SankeyDiagram from '../components/SankeyDiagram'
import { useCoachData } from '../hooks/useCoachData'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0']

function DevelopmentPathwaysDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Use coach data with filtering
  const coachData = useCoachData(filters)

  // Generate qualification trend data based on coach data
  const qualificationsTrend = coachData.seasonDistribution.map(season => ({
    ...season,
    level1: Math.floor(season.coaches * 0.6),
    level2: Math.floor(season.coaches * 0.3),
    level3: Math.floor(season.coaches * 0.1)
  }))
  
  const careerFlowData = coachData.sankeyData
  const positionData = coachData.positionTypeDistribution

  // Intervention impact data for female coach representation  
  const interventionData = [
    { season: '18/19', percentage: 22 },
    { season: '19/20', percentage: 24 },
    { season: '20/21', percentage: 26 },
    { season: '21/22', percentage: 28 },
    { season: '22/23', percentage: 35 },
    { season: '23/24', percentage: 38 },
    { season: '24/25', percentage: 42 }
  ]

  // Mock comparison data
  const comparisonData = [
    { group: 'Coaching Programme Cohort', progressionRate: '85%', qualificationRate: '78%', retentionRate: '92%' },
    { group: 'Control Group', progressionRate: '62%', qualificationRate: '54%', retentionRate: '76%' }
  ]

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) && value.length > 0
    ).length
  }

  // Transform career flow data for D3 Sankey
  const sankeyData = {
    nodes: [
      { id: 0, name: 'Academy Coach' },
      { id: 1, name: 'First Team Assistant' },
      { id: 2, name: 'Head Coach' },
      { id: 3, name: 'Other Roles' },
      { id: 4, name: 'Other' }
    ],
    links: [
      { source: 0, target: 1, value: Math.max(1, Math.round(coachData.totalCoaches * 0.15)) },
      { source: 0, target: 3, value: Math.max(1, Math.round(coachData.totalCoaches * 0.35)) },
      { source: 1, target: 2, value: Math.max(1, Math.round(coachData.totalCoaches * 0.02)) },
      { source: 1, target: 4, value: Math.max(1, Math.round(coachData.totalCoaches * 0.13)) },
      { source: 3, target: 4, value: Math.max(1, Math.round(coachData.totalCoaches * 0.35)) }
    ]
  }

  // Dynamic cohort data based on coach data
  const cohortMetrics = [
    { label: 'Total Coaches', value: coachData.totalCoaches.toString(), numericValue: coachData.totalCoaches, cohort: 'All Coaches' },
    { label: 'Senior Level', value: `${Math.round((coachData.coaches.filter(c => c.level === 'senior').length / coachData.totalCoaches) * 100)}%`, numericValue: Math.round((coachData.coaches.filter(c => c.level === 'senior').length / coachData.totalCoaches) * 100), cohort: 'Level Distribution' },
    { label: 'Female Coaches', value: `${Math.round((coachData.coaches.filter(c => c.gender === 'female').length / coachData.totalCoaches) * 100)}%`, numericValue: Math.round((coachData.coaches.filter(c => c.gender === 'female').length / coachData.totalCoaches) * 100), cohort: 'Gender Distribution' }
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
            Development Paths
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
            Career progression analysis and development journey mapping across the workforce
          </Typography>
        </Box>
        </Box>
        <FilterButton 
          onClick={() => setFilterDrawerOpen(true)}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </Box>

      <Grid container spacing={2}>
        {/* Career Flow Sankey Diagram */}
        <Grid item xs={12} md={8}>
          <DashboardCard title="Career Progression Flow (Sankey Diagram)" height="360px">
            <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SankeyDiagram 
                data={sankeyData} 
                width={560} 
                height={280} 
              />
            </Box>
          </DashboardCard>
        </Grid>

        {/* Cohort Impact Metrics */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Cohort Impact Metrics" height="360px">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortMetrics} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#666' }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [value, 'Value']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="numericValue" fill="#1976d2" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        {/* Career Timeline Visualization */}
        <Grid item xs={12} md={8}>
          <DashboardCard title={`Career Progression Timeline${getActiveFiltersCount() > 0 ? ' (Filtered)' : ''}`} height="240px">
            <Box sx={{ height: '180px', position: 'relative', mt: 2 }}>
              {/* Timeline */}
              <Box sx={{ position: 'relative', height: '80px' }}>
                {/* Timeline line */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: '40px', 
                  left: '40px', 
                  right: '40px', 
                  height: '3px', 
                  backgroundColor: '#e0e0e0',
                  borderRadius: '2px'
                }} />
                
                {/* Timeline points */}
                {[
                  { label: 'Start Coaching', year: 'Year 0', position: '8%' },
                  { label: 'UEFA B', year: 'Year 2-3', position: '28%' },
                  { label: 'UEFA A', year: 'Year 5-7', position: '58%' },
                  { label: 'UEFA Pro', year: 'Year 8-12', position: '88%' }
                ].map((point, index) => (
                  <Box key={index} sx={{ position: 'absolute', left: point.position, top: '32px' }}>
                    <Box sx={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: '25px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      textAlign: 'center',
                      minWidth: '70px'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '10px' }}>
                        {point.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>
                        {point.year}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Qualification Matrix */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Qualification Heatmap" height="240px">
            <Box sx={{ height: '180px' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
                {['UEFA B', 'UEFA A', 'UEFA Pro'].map((qual, index) => (
                  <Typography key={index} variant="caption" sx={{ textAlign: 'center', fontWeight: 600, fontSize: '10px', color: '#666' }}>
                    {qual}
                  </Typography>
                ))}
              </Box>
              {['Male', 'Female'].map((gender, genderIndex) => (
                <Box key={gender} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="caption" sx={{ minWidth: '45px', fontSize: '10px', color: '#666' }}>
                    {gender}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, flex: 1 }}>
                    {[584, 232, 22].map((value, index) => {
                      const adjustedValue = genderIndex === 1 ? Math.round(value * 0.085) : value
                      const intensity = Math.min(adjustedValue / 100, 1)
                      return (
                        <Box 
                          key={index}
                          sx={{ 
                            height: '28px',
                            backgroundColor: `rgba(25, 118, 210, ${intensity})`,
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: intensity > 0.5 ? 'white' : 'black'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontSize: '9px' }}>
                            {adjustedValue}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        {/* Intervention Impact Chart */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Intervention Impact: Female Coach Representation" height="280px">
            <Box sx={{ height: '220px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={interventionData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      fontSize: '11px',
                      zIndex: 9999
                    }}
                    formatter={(value) => [`${value}%`, 'Female Coaches']}
                    labelFormatter={(label) => `Season: ${label}`}
                  />
                  <Bar dataKey="percentage" radius={[2, 2, 0, 0]}>
                    {interventionData.map((entry, index) => {
                      const isPostIntervention = index >= 4
                      return (
                        <Cell key={`cell-${index}`} fill={isPostIntervention ? '#4caf50' : '#1976d2'} />
                      )
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              {/* Intervention marker */}
              <Box sx={{ 
                position: 'absolute', 
                top: '10px',
                left: '66%', 
                transform: 'translateX(-50%)',
                zIndex: 2
              }}>
                <Box sx={{ 
                  width: '2px', 
                  height: '160px', 
                  backgroundColor: '#ff6b35'
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      top: '-15px', 
                      left: '5px',
                      backgroundColor: '#ff6b35',
                      color: 'white',
                      px: 1,
                      borderRadius: '3px',
                      fontSize: '9px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Intervention
                  </Typography>
                </Box>
              </Box>
              
              {/* Legend */}
              <Box sx={{ position: 'absolute', bottom: '5px', left: '20px', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: '8px', height: '8px', backgroundColor: '#1976d2', borderRadius: '50%' }} />
                  <Typography variant="caption" sx={{ fontSize: '10px', color: '#333' }}>Pre-Intervention</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%' }} />
                  <Typography variant="caption" sx={{ fontSize: '10px', color: '#333' }}>Post-Intervention</Typography>
                </Box>
              </Box>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Comparison Analysis */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Programme vs Control Group Comparison" height="240px">
            <Box sx={{ height: '180px' }}>
              {comparisonData.map((group, groupIndex) => (
                <Box key={groupIndex} sx={{ mb: 2.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '11px' }}>
                    {group.group}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {[
                      { label: 'Progression', value: group.progressionRate },
                      { label: 'Qualification', value: group.qualificationRate },
                      { label: 'Retention', value: group.retentionRate }
                    ].map((metric, index) => (
                      <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 600, 
                            color: groupIndex === 0 ? '#4caf50' : '#ff6b35',
                            mb: 0.5,
                            fontSize: '18px'
                          }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>
                          {metric.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        {/* Data Requirements Table */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Data Quality Metrics" height="240px">
            <TableContainer sx={{ height: '180px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 600, color: '#666', py: 1 }}>Source</TableCell>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 600, color: '#666', py: 1 }}>Coverage</TableCell>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 600, color: '#666', py: 1 }}>Missing Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>LCA</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>88%</TableCell>
                    <TableCell sx={{ fontSize: '10px', color: '#ff6b35', py: 0.5 }}>
                      {coachData.ethnicityDistribution.missingData.lca}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>LMA</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>23%</TableCell>
                    <TableCell sx={{ fontSize: '10px', color: '#f44336', py: 0.5 }}>
                      {coachData.ethnicityDistribution.missingData.lma}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>FA Regional</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>95%</TableCell>
                    <TableCell sx={{ fontSize: '10px', color: '#4caf50', py: 0.5 }}>5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>PCP Unified</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>100%</TableCell>
                    <TableCell sx={{ fontSize: '10px', color: '#4caf50', py: 0.5 }}>0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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

export default DevelopmentPathwaysDashboard