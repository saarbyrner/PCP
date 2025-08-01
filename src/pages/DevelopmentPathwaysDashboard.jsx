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
import pcpData from '../data/pcp.json'

const COLORS = ['#1976d2', '#ff6b35', '#4caf50', '#ff9800', '#9c27b0']

function DevelopmentPathwaysDashboard() {
  const navigate = useNavigate()

  const qualificationsTrend = pcpData.leagueData.qualificationsTrend
  const careerFlowData = pcpData.leagueData.careerFlowData
  const positionData = pcpData.leagueData.positionTypeDistribution

  // Mock cohort data for impact metrics
  const cohortMetrics = [
    { label: 'Avg Players Graduated', value: '8.2', cohort: 'UEFA Pro Coaches' },
    { label: 'Avg Trophies Won', value: '2.5', cohort: 'UEFA Pro Coaches' },
    { label: 'Career Progression Rate', value: '73%', cohort: 'All Coaches' }
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
            <Box sx={{ height: '260px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              {/* Simplified Sankey representation */}
              <Box sx={{ width: '100%', height: '220px', position: 'relative' }}>
                {/* Left column - Source */}
                <Box sx={{ position: 'absolute', left: '8%', top: '25%' }}>
                  <Box sx={{ 
                    width: '100px', 
                    height: '50px', 
                    backgroundColor: '#1976d2', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    textAlign: 'center'
                  }}>
                    Academy Coach<br/>500 coaches
                  </Box>
                </Box>

                {/* Middle column - Intermediate */}
                <Box sx={{ position: 'absolute', left: '42%', top: '15%' }}>
                  <Box sx={{ 
                    width: '100px', 
                    height: '35px', 
                    backgroundColor: '#ff6b35', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    textAlign: 'center'
                  }}>
                    First Team Asst<br/>150 coaches
                  </Box>
                </Box>

                <Box sx={{ position: 'absolute', left: '42%', top: '60%' }}>
                  <Box sx={ {
                    width: '100px', 
                    height: '65px', 
                    backgroundColor: '#9e9e9e', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    textAlign: 'center'
                  }}>
                    Other Roles<br/>350 coaches
                  </Box>
                </Box>

                {/* Right column - Destinations */}
                <Box sx={{ position: 'absolute', right: '8%', top: '10%' }}>
                  <Box sx={{ 
                    width: '85px', 
                    height: '25px', 
                    backgroundColor: '#4caf50', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '9px',
                    textAlign: 'center'
                  }}>
                    Head Coach<br/>20
                  </Box>
                </Box>

                <Box sx={{ position: 'absolute', right: '8%', top: '50%' }}>
                  <Box sx={{ 
                    width: '85px', 
                    height: '50px', 
                    backgroundColor: '#9e9e9e', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '9px',
                    textAlign: 'center'
                  }}>
                    Other<br/>480
                  </Box>
                </Box>

                {/* Flow lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <defs>
                    <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1976d2" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.6"/>
                    </linearGradient>
                    <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#4caf50" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  <path d="M 125 50 Q 250 50 285 35" stroke="url(#flowGradient1)" strokeWidth="12" fill="none" opacity="0.7"/>
                  <path d="M 125 65 Q 250 100 285 100" stroke="#9e9e9e" strokeWidth="28" fill="none" opacity="0.5"/>
                  <path d="M 385 35 Q 420 35 445 25" stroke="url(#flowGradient2)" strokeWidth="6" fill="none" opacity="0.7"/>
                  <path d="M 385 45 Q 420 65 445 70" stroke="#9e9e9e" strokeWidth="10" fill="none" opacity="0.5"/>
                </svg>
              </Box>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Cohort Impact Metrics */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Cohort Impact Metrics" height="320px">
            <Box sx={{ height: '260px' }}>
              {cohortMetrics.map((metric, index) => (
                <Box key={index} sx={{ mb: 3, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', mb: 0.5, fontSize: '24px' }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, fontSize: '11px' }}>
                    {metric.label}
                  </Typography>
                  <Chip 
                    label={metric.cohort}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '9px', height: '20px' }}
                  />
                </Box>
              ))}
            </Box>
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