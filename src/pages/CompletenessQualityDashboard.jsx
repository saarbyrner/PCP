import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardCard from '../components/DashboardCard'
import RAGStatusChip from '../components/RAGStatusChip'
import { completenessQualityData } from '../data/completeness-quality-data'

import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  Stack,
  IconButton
} from '@mui/material'
import {
  ArrowBackOutlined
} from '@mui/icons-material'
import LogoImage from '../components/LogoImage'
import { getOrganizationLogoDimensions } from '../utils/assetManager'

function CompletenessQualityDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedTab, setSelectedTab] = useState(0)

  // Handle URL query parameters for organization selection and scroll to top
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const orgParam = searchParams.get('org')
    
    if (orgParam) {
      const orgIndex = completenessQualityData.organizations.findIndex(org => org.id === orgParam)
      if (orgIndex !== -1) {
        setSelectedTab(orgIndex)
      }
    }
    
    // Scroll to top when component mounts or URL changes
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 100)
  }, [location.search])

  // Additional useEffect to ensure scroll to top on component mount
  useEffect(() => {
    // Multiple methods to ensure scroll to top works
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
    // Scroll to top when switching tabs
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 100)
  }

  const selectedOrganization = completenessQualityData.organizations[selectedTab]

  // Calculate summary statistics for the selected organization
  const summaryStats = {
    averageCompleteness: Math.round(
      selectedOrganization.metrics.reduce((sum, metric) => sum + metric.completeness, 0) / 
      selectedOrganization.metrics.length
    ),
    totalOutliers: selectedOrganization.metrics.reduce((sum, metric) => sum + metric.outliers, 0),
    totalRecords: selectedOrganization.metrics.reduce((sum, metric) => sum + metric.totalRecords, 0),
    // Calculate quality score based on outliers (inverse relationship - fewer outliers = better quality)
    qualityScore: Math.max(0, Math.round(100 - (selectedOrganization.metrics.reduce((sum, metric) => sum + metric.outliers, 0) / selectedOrganization.metrics.reduce((sum, metric) => sum + metric.totalRecords, 0)) * 100)),
    criticalIssues: selectedOrganization.metrics.filter(m => m.completeness < 75).length,
    needsAttention: selectedOrganization.metrics.filter(m => m.completeness >= 75 && m.completeness < 90).length,
    goodStatus: selectedOrganization.metrics.filter(m => m.completeness >= 90).length
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary' }}
        >
          <ArrowBackOutlined />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '20px' }}>
          Partner Dashboards
        </Typography>
      </Box>

      {/* Organization Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '0.875rem'
            }
          }}
        >
                     {completenessQualityData.organizations.map((org) => (
            <Tab
              key={org.id}
              label={org.name}
              sx={{ minWidth: 120 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Organization Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        {(() => {
          const logoDimensions = getOrganizationLogoDimensions(selectedOrganization.id, 64)
          return (
            <LogoImage
              type="organization"
              logoId={selectedOrganization.id}
              alt={selectedOrganization.name}
              height={logoDimensions.height}
              width={logoDimensions.width}
            />
          )
        })()}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
            {selectedOrganization.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Equity of opportunity: hiring, shortlisting, panel diversity, outcomes
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Average EDI Data Completeness"
            subtitle="Coverage across hiring/opportunity metrics"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RAGStatusChip completeness={summaryStats.averageCompleteness} size="medium" />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Data Quality Score"
            subtitle="EDI reporting consistency"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RAGStatusChip completeness={summaryStats.qualityScore} size="medium" />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Anomalies"
            subtitle="Inconsistent/missing values in EDI reporting"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-error)' }}>
                {summaryStats.totalOutliers.toLocaleString()}
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Critical Gaps"
            subtitle="EDI metrics below 75% completeness"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-error)' }}>
                {summaryStats.criticalIssues}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                metrics
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

        
      </Grid>

      {/* Completeness Table */}
      <DashboardCard
        title="EDI Hiring & Opportunity Metrics"
        subtitle={`Accountability breakdown for ${selectedOrganization.name}`}
        height="auto"
      >
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid var(--color-border-primary)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Metric
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Completeness
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Quality
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Outliers
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Progress
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrganization.metrics.map((metric, index) => {
                // Calculate quality score for this metric
                const qualityScore = Math.max(0, Math.round(100 - (metric.outliers / metric.totalRecords) * 100))
                
                return (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {metric.metric}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {metric.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metric.completeness}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600,
                      color: qualityScore >= 90 ? 'var(--color-success)' : 
                             qualityScore >= 75 ? 'var(--color-warning)' : 'var(--color-error)'
                    }}>
                      {qualityScore}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {metric.outliers.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        of {metric.totalRecords.toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={metric.completeness}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'var(--color-border-primary)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: metric.completeness >= 90 ? 'var(--color-success)' : 
                                           (metric.completeness >= 75 ? 'var(--color-warning)' : 'var(--color-error)'),
                            borderRadius: 4
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ minWidth: 35 }}>
                        {metric.completeness}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>

      {/* Legend */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'var(--color-background-secondary)', borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Status Legend
        </Typography>
        <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: 'var(--color-success)', borderRadius: '50%' }} />
            <Typography variant="caption">Good (90%+)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: 'var(--color-warning)', borderRadius: '50%' }} />
            <Typography variant="caption">Needs Attention (75-89%)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: 'var(--color-error)', borderRadius: '50%' }} />
            <Typography variant="caption">Critical (&lt;75%)</Typography>
          </Box>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Quality scores are calculated based on outlier analysis - fewer outliers indicate higher quality data.
        </Typography>
      </Box>
    </Box>
  )
}

export default CompletenessQualityDashboard
