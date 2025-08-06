import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useView } from '../contexts/ViewContext'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Badge,
  LinearProgress,
  Alert,
  Divider,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Toolbar
} from '@mui/material'
import { 
  DashboardOutlined, 
  TrendingUpOutlined, 
  AnalyticsOutlined,
  ArrowForwardOutlined,
  AccountTreeOutlined,
  MapOutlined,
  PeopleOutlined,
  SchoolOutlined,
  PersonOutlined,
  AssignmentTurnedInOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  TrendingUpOutlined as TrendingUp,
  TrendingDownOutlined as TrendingDown
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart } from 'recharts'
import pcpData from '../data/pcp.json'
import { liverpoolFCData } from '../data/liverpool-fc-coaches'

function AnalysisPage() {
  const navigate = useNavigate()
  const { isLeagueView, currentTheme } = useView()

  // Chart rendering helper
  const renderChart = (chartType, data, primaryColor = '#1976d2', label = '') => {
    const COLORS = [primaryColor, '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#2196f3', '#ff5722', '#607d8b']
    
    switch (chartType) {
      case 'pie':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie
                  data={data || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={40}
                  fill={primaryColor}
                >
                  {(data || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'timeline':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ 
              height: '60px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              px: 1
            }}>
              {/* Timeline line */}
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '10px', 
                right: '10px', 
                height: '2px', 
                backgroundColor: '#e0e0e0',
                borderRadius: '1px'
              }} />
              
              {/* Timeline points */}
              {[20, 40, 60, 80].map((position, index) => (
                <Box key={index} sx={{ 
                  position: 'absolute', 
                  left: `${position}%`, 
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: index === 2 ? primaryColor : '#e0e0e0',
                    borderRadius: '50%',
                    border: `2px solid ${index === 2 ? 'white' : '#f5f5f5'}`,
                    boxShadow: index === 2 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                  }} />
                  {index === 2 && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: '-20px', 
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: primaryColor,
                      color: 'white',
                      px: 0.5,
                      py: 0.25,
                      borderRadius: '2px',
                      fontSize: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      Current Role
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'line':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsiveContainer width="100%" height={70}>
              <LineChart data={data || []}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={primaryColor} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'area':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart data={data || []}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={primaryColor} 
                  fill={`${primaryColor}30`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'bar':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsiveContainer width="100%" height={70}>
              <BarChart data={data || []}>
                <Bar dataKey="coachesPerMillion" fill={primaryColor} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'compliance':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsiveContainer width="100%" height={70}>
              <BarChart data={Object.entries(data || {}).map(([key, value]) => ({ 
                name: key.replace(/([A-Z])/g, ' $1').trim(), 
                compliant: value?.compliant || 0,
                total: value?.total || 0 
              }))}>
                <Bar dataKey="compliant" fill={primaryColor} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'sankey':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart data={data || []}>
                <Area 
                  type="monotone" 
                  dataKey="coaches" 
                  stroke={primaryColor} 
                  fill={`${primaryColor}30`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      case 'heatmap':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 1,
              height: '70px',
              alignItems: 'end'
            }}>
              {['UEFA B', 'UEFA A', 'UEFA Pro'].map((qual, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {['M', 'F'].map((gender, gIndex) => (
                    <Box
                      key={gIndex}
                      sx={{
                        height: gIndex === 0 ? '16px' : '4px',
                        backgroundColor: `${primaryColor}${gIndex === 0 ? '' : '60'}`,
                        borderRadius: '1px',
                        opacity: index === 0 ? 1 : index === 1 ? 0.7 : 0.4
                      }}
                    />
                  ))}
                </Box>
              ))}
            </Box>
            {label && (
              <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                {label}
              </Typography>
            )}
          </Box>
        )
      default:
        return null
    }
  }
  
  // Club View Filter State
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    search: '',
    compliance: ''
  })

  // Helper function to get compliance status color
  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant': return '#28a745'
      case 'expiring': return '#ffc107'
      case 'non-compliant': return '#dc3545'
      case 'not-required': return '#6c757d'
      default: return '#6c757d'
    }
  }

  // Helper function to get compliance status icon
  const getComplianceStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircleOutlined sx={{ fontSize: 16 }} />
      case 'expiring': return <WarningOutlined sx={{ fontSize: 16 }} />
      case 'non-compliant': return <ErrorOutlined sx={{ fontSize: 16 }} />
      default: return <CheckCircleOutlined sx={{ fontSize: 16 }} />
    }
  }

  // Filter coaches based on current filters
  const filteredCoaches = useMemo(() => {
    return liverpoolFCData.coaches.filter(coach => {
      // Search filter
      if (filters.search && !coach.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Department filter
      if (filters.department && coach.department !== filters.department) {
        return false
      }
      
      // Role filter
      if (filters.role && coach.role !== filters.role) {
        return false
      }
      
      // Compliance filter
      if (filters.compliance) {
        const hasCompliance = Object.values(coach.compliance).some(cert => cert.status === filters.compliance)
        if (!hasCompliance) return false
      }
      
      return true
    })
  }, [filters])

  // Get unique filter options
  const filterOptions = useMemo(() => ({
    departments: [...new Set(liverpoolFCData.coaches.map(coach => coach.department))],
    roles: [...new Set(liverpoolFCData.coaches.map(coach => coach.role))],
    complianceStates: ['compliant', 'expiring', 'non-compliant']
  }), [])

  // Club View Dashboard Homepage
  if (!isLeagueView) {
    const clubDashboards = [
      {
        id: 'coach-management',
        title: 'Coach Management & Compliance',
        description: 'Digital passport and compliance tracking for coaching staff',
        icon: AssignmentTurnedInOutlined,
        route: '/analysis/coach-management',
        chartData: liverpoolFCData.departmentBreakdown || [],
        chartType: 'pie',
        chartLabel: 'Department Distribution',
        tags: [
          { label: 'Compliance', color: '#C8102E' },
          { label: 'Management', color: '#8B0000' },
          { label: 'Tracking', color: '#ff6b35' }
        ]
      },
      {
        id: 'individual-coach-profile',
        title: 'Digital CV',
        description: 'Detailed profiles with career timeline and digital CV',
        icon: PersonOutlined,
        route: '/analysis/individual-coach-profile',
        chartData: [],
        chartType: 'timeline',
        chartLabel: 'Career Timeline',
        tags: [
          { label: 'Profiles', color: '#2196f3' },
          { label: 'Timeline', color: '#4caf50' }
        ]
      }
    ]

    const handleDashboardClick = (route) => {
      navigate(route)
    }

    return (
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5, color: currentTheme.primaryColor }}>
            Liverpool FC Coach Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
            Comprehensive coaching staff management and analytics platform
          </Typography>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={2}>
          {clubDashboards.map((dashboard) => {
            const IconComponent = dashboard.icon
            return (
              <Grid item xs={12} md={6} lg={4} key={dashboard.id}>
                <Card 
                  sx={{ 
                    height: 240,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      borderColor: currentTheme.primaryColor
                    }
                  }}
                  onClick={() => handleDashboardClick(dashboard.route)}
                >
                  <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconComponent sx={{ color: currentTheme.primaryColor, fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>
                          {dashboard.title}
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ color: '#666' }}>
                        <ArrowForwardOutlined fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1, 
                        lineHeight: 1.3, 
                        fontSize: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {dashboard.description}
                    </Typography>

                    {/* Chart Preview */}
                    <Box sx={{ mb: 0.5, minHeight: 100, flex: '0 0 100px' }}>
                      {renderChart(dashboard.chartType, dashboard.chartData, currentTheme.primaryColor, dashboard.chartLabel)}
                    </Box>

                    {/* Tags */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 0.5, 
                      flexWrap: 'nowrap',
                      overflow: 'hidden',
                      mt: 'auto'
                    }}>
                      {dashboard.tags.slice(0, 4).map((tag, index) => (
                        <Chip 
                          key={index}
                          label={tag.label}
                          size="small"
                          sx={{ 
                            fontSize: '10px',
                            height: '24px',
                            backgroundColor: `${tag.color}15`,
                            color: tag.color,
                            border: `1px solid ${tag.color}30`,
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    )
  }

  // League View (updated dashboard cards)
  const dashboards = [
    {
      id: 'workforce-overview',
      title: 'Workforce Stats',
      description: 'Demographics and statistics across the entire coaching workforce',
      icon: DashboardOutlined,
      route: '/analysis/workforce-overview',
      chartData: pcpData.leagueData.genderDistribution || [],
      chartType: 'pie',
      chartLabel: 'Gender Distribution',
      tags: [
        { label: 'Demographics', color: '#1976d2' },
        { label: 'Statistics', color: '#4caf50' },
        { label: 'KPIs', color: '#ff9800' }
      ]
    },
    {
      id: 'development-pathways',
      title: 'Development Paths',
      description: 'Career progression and qualification journey mapping',
      icon: TrendingUpOutlined,
      route: '/analysis/development-pathways',
      chartData: [],
      chartType: 'heatmap',
      chartLabel: 'Qualification Heatmap',
      tags: [
        { label: 'Pathways', color: '#9c27b0' },
        { label: 'Qualifications', color: '#2196f3' }
      ]
    },
    {
      id: 'career-progression-flow',
      title: 'Progression Flow',
      description: 'Career pathway analysis with demographic breakdowns',
      icon: AccountTreeOutlined,
      route: '/analysis/career-progression-flow',
      chartData: [
        { stage: 'Entry', value: 450 },
        { stage: 'Junior', value: 320 },
        { stage: 'Senior', value: 180 },
        { stage: 'Lead', value: 85 }
      ],
      chartType: 'area',
      chartLabel: 'Career Progression Flow (Sankey Diagram)',
      tags: [
        { label: 'Flow Analysis', color: '#ff5722' },
        { label: 'Demographics', color: '#795548' },
        { label: 'Sankey', color: '#607d8b' }
      ]
    },
    {
      id: 'geospatial',
      title: 'Regional Map',
      description: 'Interactive UK coaching distribution with zoom controls',
      icon: MapOutlined,
      route: '/analysis/geospatial',
      chartData: pcpData.leagueData.regionalDistribution?.slice(0, 8) || [],
      chartType: 'bar',
      chartLabel: 'UK Regional Map',
      tags: [
        { label: 'Geography', color: '#3f51b5' },
        { label: 'Interactive', color: '#009688' }
      ]
    }
  ]

  const handleDashboardClick = (route) => {
    navigate(route)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
          League Dashboards
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
          Comprehensive analytics and insights for the Pro Coach Partnership workforce
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {dashboards.map((dashboard) => {
          const IconComponent = dashboard.icon
          return (
            <Grid item xs={12} md={6} lg={4} key={dashboard.id}>
              <Card 
                sx={{ 
                  height: 240,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1976d2'
                  }
                }}
                onClick={() => handleDashboardClick(dashboard.route)}
              >
                <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <IconComponent sx={{ color: '#1976d2', fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>
                        {dashboard.title}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <ArrowForwardOutlined fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1, 
                      lineHeight: 1.3, 
                      fontSize: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {dashboard.description}
                  </Typography>

                  {/* Chart Preview */}
                  <Box sx={{ mb: 0.5, minHeight: 100, flex: '0 0 100px' }}>
                    {renderChart(dashboard.chartType, dashboard.chartData, '#1976d2', dashboard.chartLabel)}
                  </Box>

                  {/* Tags */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                    mt: 'auto'
                  }}>
                    {dashboard.tags.slice(0, 4).map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag.label}
                        size="small"
                        sx={{ 
                          fontSize: '10px',
                          height: '24px',
                          backgroundColor: `${tag.color}15`,
                          color: tag.color,
                          border: `1px solid ${tag.color}30`,
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default AnalysisPage