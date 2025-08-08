import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, LineChart, Line } from 'recharts'
import DashboardCard from '../components/DashboardCard'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
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

function WorkforceOverviewDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Use coach data with filtering
  const coachData = useCoachData(filters)

  const kpis = coachData.kpis || []
  const genderData = coachData.genderDistribution || []
  const ethnicityData = coachData.ethnicityDistribution?.breakdown || []
  const qualificationsTrend = (coachData.seasonDistribution || []).map(season => ({
    ...season,
    uefaB: Math.floor((season.coaches || 0) * 0.6),
    uefaA: Math.floor((season.coaches || 0) * 0.3),
    uefaPro: Math.floor((season.coaches || 0) * 0.1)
  }))
  const positionData = coachData.positionTypeDistribution || []
  const employmentData = coachData.employmentStatusDistribution || []

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) && value.length > 0
    ).length
  }

  // Transform ethnicity data for multi-bar chart
  const ethnicityChartData = [{
    "White/White British": ethnicityData[0].value,
    "Black/Black British": ethnicityData[1].value,
    "Asian/Asian British": ethnicityData[2].value,
    "Mixed": ethnicityData[3].value,
    "Other": ethnicityData[4].value
  }]

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
          <IconButton 
            onClick={() => navigate('/analysis')} 
            aria-label="Go back to analysis page"
            sx={{ mr: 1, p: 1 }}
          >
            <ArrowBackOutlined fontSize="small" />
          </IconButton>
          <Box>
            <Typography id="dashboard-title" variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
              Workforce Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
              High-level statistics and demographic analysis of the entire coaching workforce
            </Typography>
          </Box>
        </Box>
        <FilterButton 
          onClick={() => setFilterDrawerOpen(true)}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </Box>

      {/* KPI Cards */}
      <section aria-labelledby="kpi-section-title">
        <Typography id="kpi-section-title" variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Key Performance Indicators
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard height="90px">
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '28px', lineHeight: 1 }}>
                  {typeof kpi.value === 'number' && kpi.value > 100 ? kpi.value.toLocaleString() : kpi.value}
                  {kpi.title.includes('%') || kpi.title.includes('Female') || kpi.title.includes('Ethnicity') ? '%' : ''}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                  {kpi.title}
                </Typography>
              </Box>
            </DashboardCard>
          </Grid>
        ))}
      </Grid>
      </section>

      <section aria-labelledby="charts-section-title">
        <Typography id="charts-section-title" variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Demographic Analysis
        </Typography>
        <Grid container spacing={2}>
        {/* Gender Distribution, Position Type Distribution, Employment Status Distribution */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Gender Distribution" height="240px">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  fill="var(--color-chart-1)"
                  dataKey="value"
                  label={({ value }) => value > 3 ? `${value}%` : ''}
                  labelStyle={{ fontSize: '0.6rem', fill: 'var(--color-text-primary)', fontWeight: '600', fontFamily: 'var(--font-family-primary)' }}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-background-primary)', 
                    border: '1px solid var(--color-border-primary)', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title="Position Types" height="240px">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  fill="var(--color-chart-1)"
                  dataKey="value"
                  label={({ value }) => value > 3 ? `${value}%` : ''}
                  labelStyle={{ fontSize: '0.6rem', fill: 'var(--color-text-primary)', fontWeight: '600', fontFamily: 'var(--font-family-primary)' }}
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-background-primary)', 
                    border: '1px solid var(--color-border-primary)', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title="Employment Status" height="240px">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={employmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  fill="var(--color-chart-1)"
                  dataKey="value"
                  label={({ value }) => value > 3 ? `${value}%` : ''}
                  labelStyle={{ fontSize: '0.6rem', fill: 'var(--color-text-primary)', fontWeight: '600', fontFamily: 'var(--font-family-primary)' }}
                >
                  {employmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-chart-2)' : 'var(--color-chart-3)'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-background-primary)', 
                    border: '1px solid var(--color-border-primary)', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        {/* Qualifications Trend and Ethnicity Breakdown */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Qualifications Trend (5 Years)" height="280px">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={qualificationsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary)" />
                <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-background-primary)', 
                    border: '1px solid var(--color-border-primary)', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Season: ${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)' }} 
                  iconType="circle"
                  iconSize={6}
                  formatter={(value) => <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>}
                />
                <Line type="monotone" dataKey="uefaB" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 3 }} name="UEFA B" />
                <Line type="monotone" dataKey="uefaA" stroke="var(--color-chart-3)" strokeWidth={2} dot={{ r: 3 }} name="UEFA A" />
                <Line type="monotone" dataKey="uefaPro" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} name="UEFA Pro" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard title="Ethnicity Breakdown" height="280px">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ethnicityChartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary)" />
                <XAxis hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-background-primary)', 
                    border: '1px solid var(--color-border-primary)', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    zIndex: 9999
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', color: '#333', paddingTop: '12px' }} 
                  iconType="circle"
                  iconSize={6}
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>}
                />
                <Bar dataKey="White/White British" fill={COLORS[0]} name="White/White British" />
                <Bar dataKey="Black/Black British" fill={COLORS[1]} name="Black/Black British" />
                <Bar dataKey="Asian/Asian British" fill={COLORS[2]} name="Asian/Asian British" />
                <Bar dataKey="Mixed" fill={COLORS[3]} name="Mixed" />
                <Bar dataKey="Other" fill={COLORS[4]} name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        {/* Regional Distribution Bar Chart */}
        <Grid item xs={12}>
          <DashboardCard title="Regional Distribution" height="420px">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart 
                data={coachData.regionalDistribution} 
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary)" />
                <XAxis 
                  dataKey="region" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#666' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-background-primary)', 
                    border: '1px solid var(--color-border-primary)', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`${value} coaches`, 'Coach Count']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="coachCount" 
                  fill="var(--color-chart-1)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
      </Grid>
      </section>
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

export default WorkforceOverviewDashboard