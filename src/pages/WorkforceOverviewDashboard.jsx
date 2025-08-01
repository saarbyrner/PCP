import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, Tooltip } from 'recharts'
import DashboardCard from '../components/DashboardCard'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import { useFilteredData } from '../hooks/useFilteredData'
import pcpData from '../data/pcp.json'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0']

function WorkforceOverviewDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Use filtered data based on current filter selections
  const filteredData = useFilteredData(pcpData.leagueData, filters)

  const kpis = filteredData.kpis || pcpData.leagueData.kpis
  const genderData = filteredData.genderDistribution || pcpData.leagueData.genderDistribution
  const ethnicityData = filteredData.ethnicityDistribution?.breakdown || pcpData.leagueData.ethnicityDistribution.breakdown
  const qualificationsTrend = filteredData.qualificationsTrend || pcpData.leagueData.qualificationsTrend
  const positionData = filteredData.positionTypeDistribution || pcpData.leagueData.positionTypeDistribution

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
          <IconButton onClick={() => navigate('/analysis')} sx={{ mr: 1, p: 1 }}>
            <ArrowBackOutlined fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard height="90px">
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', fontSize: '28px', lineHeight: 1 }}>
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

      <Grid container spacing={2}>
        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Gender Distribution" height="240px">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelStyle={{ fontSize: '10px', fill: '#333' }}
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
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        {/* Ethnicity Breakdown */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Ethnicity Breakdown" height="240px">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ethnicityChartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '11px'
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
                  formatter={(value) => <span style={{ color: '#333' }}>{value}</span>}
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

        {/* Qualifications Trend */}
        <Grid item xs={12} md={8}>
          <DashboardCard title="Qualifications Trend (5 Years)" height="280px">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={qualificationsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Season: ${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', color: '#333' }} 
                  iconType="circle"
                  iconSize={6}
                  formatter={(value) => <span style={{ color: '#333' }}>{value}</span>}
                />
                <Line type="monotone" dataKey="uefaB" stroke="#4caf50" strokeWidth={2} dot={{ r: 3 }} name="UEFA B" />
                <Line type="monotone" dataKey="uefaA" stroke="#ff6b35" strokeWidth={2} dot={{ r: 3 }} name="UEFA A" />
                <Line type="monotone" dataKey="uefaPro" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} name="UEFA Pro" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        {/* Position Type Distribution */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Position Types" height="280px">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}\n${value}%`}
                  labelStyle={{ fontSize: '10px', textAnchor: 'middle', fill: '#333' }}
                >
                  {positionData.map((entry, index) => (
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

export default WorkforceOverviewDashboard