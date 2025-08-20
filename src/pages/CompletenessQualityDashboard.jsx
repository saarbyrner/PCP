import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const selectedOrganization = completenessQualityData.organizations[selectedTab]

  // Calculate summary statistics for the selected organization
  const summaryStats = {
    averageCompleteness: Math.round(
      selectedOrganization.metrics.reduce((sum, metric) => sum + metric.completeness, 0) / 
      selectedOrganization.metrics.length
    ),
    totalOutliers: selectedOrganization.metrics.reduce((sum, metric) => sum + metric.outliers, 0),
    totalRecords: selectedOrganization.metrics[0]?.totalRecords || 0,
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
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Data Completeness & Quality Dashboard
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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {selectedOrganization.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data Quality & Completeness Overview
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Average Completeness"
            subtitle="Overall data quality score"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RAGStatusChip completeness={summaryStats.averageCompleteness} size="medium" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {summaryStats.averageCompleteness}%
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Outliers"
            subtitle="Data quality issues detected"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-error)' }}>
                {summaryStats.totalOutliers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of {summaryStats.totalRecords.toLocaleString()}
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Critical Issues"
            subtitle="Metrics below 75% completeness"
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

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Good Status"
            subtitle="Metrics above 90% completeness"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-success)' }}>
                {summaryStats.goodStatus}
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
        title="Data Completeness & Quality Metrics"
        subtitle={`Detailed breakdown for ${selectedOrganization.name}`}
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
                  Completeness
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
              {selectedOrganization.metrics.map((metric, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {metric.metric}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metric.completeness}%
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
              ))}
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
      </Box>
    </Box>
  )
}

export default CompletenessQualityDashboard
