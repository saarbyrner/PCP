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
  Divider
} from '@mui/material'
import { 
  DashboardOutlined, 
  ArrowForwardOutlined,
  AccountTreeOutlined,
  PersonOutlined,
  AssignmentTurnedInOutlined,
  EqualizerOutlined,
  AssessmentOutlined
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, Area, AreaChart } from 'recharts'
import pcpData from '../data/pcp.json'
import { liverpoolFCData } from '../data/liverpool-fc-coaches'
import { completenessQualityData } from '../data/completeness-quality-data'
import LogoImage from '../components/LogoImage'
import { getOrganizationLogoDimensions } from '../utils/assetManager'

function AnalysisPage() {
  const navigate = useNavigate()
  const { isLeagueView, currentTheme } = useView()


  
  // Club View Filter State
  const [filters, ] = useState({
    department: '',
    role: '',
    search: '',
    compliance: ''
  })

  // Filter coaches based on current filters
  useMemo(() => {
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
  useMemo(() => ({
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
          { label: 'Compliance', color: 'var(--color-error)' },
          { label: 'Management', color: 'var(--color-error-dark)' },
          { label: 'Tracking', color: 'var(--color-chart-3)' }
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
          { label: 'Profiles', color: 'var(--color-chart-1)' },
          { label: 'Timeline', color: 'var(--color-chart-2)' }
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
              <Grid item xs={12} md={4} key={dashboard.id}>
                <Card 
                  sx={{ 
                    height: 140,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid var(--color-border-primary)',
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
                      <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
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
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                      }}
                    >
                      {dashboard.description}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 0.5, 
                      flexWrap: 'wrap',
                      mt: 'auto'
                    }}>
                      {dashboard.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index}
                          label={tag.label}
                          size="small"
                          variant="filled"
                          sx={{ 
                            fontSize: '10px',
                            height: '20px',
                            backgroundColor: tag.color || 'var(--color-chart-1)',
                            color: 'var(--color-white)',
                            fontWeight: 500,
                            flexShrink: 0
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
        title: 'Workforce Overview',
        description: 'Demographics and statistics across the entire coaching workforce',
        icon: DashboardOutlined,
        route: '/analysis/workforce-overview',
        chartData: pcpData.leagueData.positionTypeDistribution || [],
        chartType: 'pie',
        chartLabel: 'Position Types',
        tags: [
          { label: 'Demographics', color: 'var(--color-primary)' },
          { label: 'Statistics', color: 'var(--color-chart-2)' },
          { label: 'KPIs', color: 'var(--color-chart-3)' }
        ]
      },
    {
      id: 'career-progression-flow',
      title: 'Coaches Pathway',
      description: 'Career progression analysis with Sankey flows and milestone timelines',
      icon: AccountTreeOutlined,
      route: '/analysis/career-progression-flow',
      chartData: [
        { stage: 'Entry', value: 450 },
        { stage: 'Junior', value: 320 },
        { stage: 'Senior', value: 180 },
        { stage: 'Lead', value: 85 }
      ],
      chartType: 'area',
      chartLabel: 'Coaches Pathway (Sankey & Timeline Views)',
      tags: [
        { label: 'Flow Analysis', color: 'var(--color-chart-7)' },
        { label: 'Demographics', color: 'var(--color-chart-8)' },
        { label: 'Sankey', color: 'var(--color-chart-5)' }
      ]
    },
    {
      id: 'edi',
      title: 'EDI Dashboard',
      description: 'Equality, Diversity & Inclusion metrics with interactive demographic analysis',
      icon: EqualizerOutlined,
      route: '/analysis/edi',
      chartData: [
        { name: 'Male', value: 85 },
        { name: 'Female', value: 15 }
      ],
      chartType: 'pie',
      chartLabel: 'Gender Distribution',
      tags: [
        { label: 'Equality', color: 'var(--color-chart-9)' },
        { label: 'Demographics', color: 'var(--color-chart-10)' },
        { label: 'Interactive', color: 'var(--color-chart-4)' }
      ]
    },

  ]

  // Organization-specific dashboards
  const organizationDashboards = completenessQualityData.organizations.map(org => {
    // Calculate average completeness for the organization
    const avgCompleteness = Math.round(
      org.metrics.reduce((sum, metric) => sum + metric.completeness, 0) / org.metrics.length
    )
    
    // Calculate quality score based on outliers (inverse relationship - fewer outliers = better quality)
    const totalOutliers = org.metrics.reduce((sum, metric) => sum + metric.outliers, 0)
    const totalRecords = org.metrics.reduce((sum, metric) => sum + metric.totalRecords, 0)
    const outlierPercentage = (totalOutliers / totalRecords) * 100
    const qualityScore = Math.max(0, Math.round(100 - outlierPercentage))
    
    // Calculate RAG status based on completeness
    const ragStatus = avgCompleteness >= 90 ? 'green' : avgCompleteness >= 75 ? 'amber' : 'red'
    
    // Calculate quality RAG status
    const qualityRagStatus = qualityScore >= 90 ? 'green' : qualityScore >= 75 ? 'amber' : 'red'
    
    return {
      id: org.id,
      title: org.name,
      logo: org.logo,
      route: `/analysis/completeness-quality?org=${org.id}`,
      ragStatus,
      avgCompleteness,
      qualityScore,
      qualityRagStatus,
      tags: [
        { label: 'Data Completeness', color: 'var(--color-chart-2)' },
        { label: 'Data Quality', color: 'var(--color-chart-3)' },
        { label: ragStatus === 'green' ? 'Good Status' : ragStatus === 'amber' ? 'Needs Attention' : 'Critical Status', color: ragStatus === 'green' ? 'var(--color-success)' : ragStatus === 'amber' ? 'var(--color-warning)' : 'var(--color-error)' }
      ]
    }
  })

  const handleDashboardClick = (route) => {
    navigate(route)
    // Scroll to top when navigating to a new page
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, 100)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
          PCP Dashboards
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
          Comprehensive analytics and insights for the Pro Coach Partnership workforce
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {dashboards.map((dashboard) => {
          const IconComponent = dashboard.icon
          return (
            <Grid item xs={12} md={4} key={dashboard.id}>
              <Card 
                sx={{ 
                  height: 140,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid var(--color-border-primary)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderColor: 'var(--color-primary)'
                  }
                }}
                onClick={() => handleDashboardClick(dashboard.route)}
              >
                <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <IconComponent sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>
                        {dashboard.title}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
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
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}
                  >
                    {dashboard.description}
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    flexWrap: 'wrap',
                    mt: 'auto'
                  }}>
                    {dashboard.tags.slice(0, 3).map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag.label}
                        size="small"
                        variant="filled"
                        sx={{ 
                          fontSize: '10px',
                          height: '20px',
                          backgroundColor: tag.color || 'var(--color-chart-1)',
                          color: 'var(--color-white)',
                          fontWeight: 500,
                          flexShrink: 0
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

      {/* Divider */}
      <Box sx={{ my: 4 }}>
        <Divider sx={{ borderColor: 'var(--color-border-primary)' }}>
          <Chip 
            label="Partner Organisations" 
            size="small" 
            sx={{ 
              backgroundColor: 'var(--color-background-secondary)',
              color: 'var(--color-text-secondary)',
              fontSize: '12px',
              fontWeight: 500
            }}
          />
        </Divider>
      </Box>
      <Grid container spacing={2}>
        {/* Partner Dashboards Card - First in Partner Organisations section */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: 140,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid var(--color-border-primary)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderColor: 'var(--color-primary)'
              }
            }}
            onClick={() => handleDashboardClick('/analysis/completeness-quality')}
          >
            <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssessmentOutlined sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>
                    Partner Dashboards
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
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
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: 1
                }}
              >
                Hiring, shortlisting, panel diversity and outcomes data completeness with RAG status
              </Typography>

              {/* Tags */}
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                flexWrap: 'wrap',
                mt: 'auto'
              }}>
                <Chip 
                  label="EDI"
                  size="small"
                  variant="filled"
                  sx={{ 
                    fontSize: '10px',
                    height: '20px',
                    backgroundColor: 'var(--color-success)',
                    color: 'var(--color-white)',
                    fontWeight: 500,
                    flexShrink: 0
                  }}
                />
                <Chip 
                  label="Accountability"
                  size="small"
                  variant="filled"
                  sx={{ 
                    fontSize: '10px',
                    height: '20px',
                    backgroundColor: 'var(--color-warning)',
                    color: 'var(--color-white)',
                    fontWeight: 500,
                    flexShrink: 0
                  }}
                />
                <Chip 
                  label="Hiring Data"
                  size="small"
                  variant="filled"
                  sx={{ 
                    fontSize: '10px',
                    height: '20px',
                    backgroundColor: 'var(--color-error)',
                    color: 'var(--color-white)',
                    fontWeight: 500,
                    flexShrink: 0
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {organizationDashboards.map((dashboard) => (
          <Grid item xs={12} md={4} key={dashboard.id}>
                          <Card 
                sx={{ 
                  height: 140,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid var(--color-border-primary)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderColor: 'var(--color-primary)'
                  }
                }}
              onClick={() => handleDashboardClick(dashboard.route)}
            >
              <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header with Logo */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                    <Box sx={{ 
                      minWidth: 40,
                      maxWidth: 80,
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-start',
                      flexShrink: 0
                    }}>
                      {(() => {
                        const logoDimensions = getOrganizationLogoDimensions(dashboard.id, 40)
                        return (
                          <LogoImage 
                            type="organization"
                            logoId={dashboard.id}
                            width={logoDimensions.width}
                            height={logoDimensions.height}
                            alt={`${dashboard.title} logo`}
                          />
                        )
                      })()}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '16px', 
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}
                      >
                        {dashboard.title}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                    <ArrowForwardOutlined fontSize="small" />
                  </IconButton>
                </Box>

                {/* Data Metrics */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Box sx={{ 
                    flex: 1,
                    backgroundColor: 'var(--color-background-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    p: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', display: 'block' }}>
                      Completeness
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px', color: dashboard.ragStatus === 'green' ? 'var(--color-success)' : dashboard.ragStatus === 'amber' ? 'var(--color-warning)' : 'var(--color-error)' }}>
                      {dashboard.avgCompleteness}%
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    flex: 1,
                    backgroundColor: 'var(--color-background-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    p: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', display: 'block' }}>
                      Quality
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px', color: dashboard.qualityRagStatus === 'green' ? 'var(--color-success)' : dashboard.qualityRagStatus === 'amber' ? 'var(--color-warning)' : 'var(--color-error)' }}>
                      {dashboard.qualityScore}%
                    </Typography>
                  </Box>
                </Box>


              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default AnalysisPage