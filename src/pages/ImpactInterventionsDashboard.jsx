import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import DashboardCard from '../components/DashboardCard'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import UKMap from '../components/UKMap'
import { useFilteredData } from '../hooks/useFilteredData'
import pcpData from '../data/pcp.json'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0']

function ImpactInterventionsDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Use filtered data based on current filter selections
  const filteredData = useFilteredData(pcpData.leagueData, filters)

  const interventionData = filteredData.interventionImpact || pcpData.leagueData.interventionImpact
  const regionalData = filteredData.regionalDistribution || pcpData.leagueData.regionalDistribution
  const ethnicityData = pcpData.leagueData.ethnicityDistribution

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) && value.length > 0
    ).length
  }

  // Mock comparison data
  const comparisonData = [
    { group: 'Coaching Programme Cohort', progressionRate: '85%', qualificationRate: '78%', retentionRate: '92%' },
    { group: 'Control Group', progressionRate: '62%', qualificationRate: '54%', retentionRate: '76%' }
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
            Impact, Interventions & Geospatial
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
            Intervention effectiveness tracking with geographical distribution analysis
          </Typography>
        </Box>
        </Box>
        <FilterButton 
          onClick={() => setFilterDrawerOpen(true)}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </Box>

      <Grid container spacing={2}>
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
                      fontSize: '11px'
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

        {/* UK Regional Map - Large Feature */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="UK Regional Distribution" height="280px">
            <Box sx={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UKMap 
                data={regionalData} 
                width={450} 
                height={200} 
              />
            </Box>
          </DashboardCard>
        </Grid>

        {/* Large UK Regional Map - Full Width Impact Visualization */}
        <Grid item xs={12}>
          <DashboardCard title="UK Regional Coaching Distribution - Geographic Impact Analysis" height="400px">
            <Box sx={{ height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UKMap 
                data={regionalData} 
                width={800} 
                height={320} 
              />
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
                      {ethnicityData.missingData.lca}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>LMA</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>23%</TableCell>
                    <TableCell sx={{ fontSize: '10px', color: '#f44336', py: 0.5 }}>
                      {ethnicityData.missingData.lma}
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

export default ImpactInterventionsDashboard