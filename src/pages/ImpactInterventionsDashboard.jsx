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
import DashboardCard from '../components/DashboardCard'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import { useCoachData } from '../hooks/useCoachData'

function ImpactInterventionsDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Use coach data with filtering
  const coachData = useCoachData(filters)

  const ethnicityData = coachData.ethnicityDistribution

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
                            color: groupIndex === 0 ? 'var(--color-chart-2)' : 'var(--color-chart-3)',
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
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', py: 1 }}>Source</TableCell>
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', py: 1 }}>Coverage</TableCell>
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', py: 1 }}>Missing Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>LCA</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>88%</TableCell>
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-chart-3)', py: 0.5 }}>
                      {ethnicityData.missingData.lca}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>LMA</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>23%</TableCell>
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', py: 0.5 }}>
                      {ethnicityData.missingData.lma}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>FA Regional</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>95%</TableCell>
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-chart-2)', py: 0.5 }}>5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>PCP Unified</TableCell>
                    <TableCell sx={{ fontSize: '10px', py: 0.5 }}>100%</TableCell>
                    <TableCell sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-chart-2)', py: 0.5 }}>0%</TableCell>
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