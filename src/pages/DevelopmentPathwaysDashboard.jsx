import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton,
  Chip
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts'
import DashboardCard from '../components/DashboardCard'
import SankeyDiagram from '../components/SankeyDiagram'
import pcpData from '../data/pcp.json'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0']

function DevelopmentPathwaysDashboard() {
  const navigate = useNavigate()

  const qualificationsTrend = pcpData.leagueData.qualificationsTrend
  const careerFlowData = pcpData.leagueData.careerFlowData
  const positionData = pcpData.leagueData.positionTypeDistribution

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
      { source: 0, target: 1, value: 150 },
      { source: 0, target: 3, value: 350 },
      { source: 1, target: 2, value: 20 },
      { source: 1, target: 4, value: 130 },
      { source: 3, target: 4, value: 350 }
    ]
  }

  // Mock cohort data for impact metrics
  const cohortMetrics = [
    { label: 'Avg Players Graduated', value: '8.2', numericValue: 8.2, cohort: 'UEFA Pro Coaches' },
    { label: 'Avg Trophies Won', value: '2.5', numericValue: 2.5, cohort: 'UEFA Pro Coaches' },
    { label: 'Career Progression Rate', value: '73%', numericValue: 73, cohort: 'All Coaches' }
  ]

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/analysis')} sx={{ mr: 1, p: 1 }}>
          <ArrowBackOutlined fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
            Coach Development Pathways
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
            Career progression analysis and development journey mapping across the workforce
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Career Flow Sankey Diagram */}
        <Grid item xs={12} md={8}>
          <DashboardCard title="Career Progression Flow (Sankey Diagram)" height="320px">
            <Box sx={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SankeyDiagram 
                data={sankeyData} 
                width={520} 
                height={240} 
              />
            </Box>
          </DashboardCard>
        </Grid>

        {/* Cohort Impact Metrics */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Cohort Impact Metrics" height="320px">
            <ResponsiveContainer width="100%" height={260}>
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
          <DashboardCard title="Typical Career Progression Timeline" height="240px">
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
      </Grid>
    </Box>
  )
}

export default DevelopmentPathwaysDashboard