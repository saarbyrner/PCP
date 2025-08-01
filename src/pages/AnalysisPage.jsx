import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useView } from '../contexts/ViewContext'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  IconButton
} from '@mui/material'
import { 
  DashboardOutlined, 
  TrendingUpOutlined, 
  AnalyticsOutlined,
  ArrowForwardOutlined 
} from '@mui/icons-material'
import pcpData from '../data/pcp.json'

function AnalysisPage() {
  const navigate = useNavigate()
  const { isLeagueView } = useView()

  if (!isLeagueView) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Analysis
        </Typography>
      </Box>
    )
  }

  const dashboards = [
    {
      id: 'workforce-overview',
      title: 'Workforce Overview',
      description: 'High-level statistics and demographic analysis of the entire coaching workforce',
      icon: DashboardOutlined,
      route: '/analysis/workforce-overview',
      metrics: [
        { label: 'Total Coaches', value: pcpData.leagueData.kpis[0].value.toLocaleString() },
        { label: 'Avg Age', value: pcpData.leagueData.kpis[1].value },
        { label: 'Female %', value: `${pcpData.leagueData.kpis[2].value}%` }
      ],
      tags: ['Demographics', 'KPIs', 'Overview']
    },
    {
      id: 'development-pathways',
      title: 'Coach Development Pathways',
      description: 'Career progression analysis and development journey mapping across the workforce',
      icon: TrendingUpOutlined,
      route: '/analysis/development-pathways',
      metrics: [
        { label: 'UEFA Pro', value: pcpData.leagueData.qualificationsTrend[4].uefaPro },
        { label: 'UEFA A', value: pcpData.leagueData.qualificationsTrend[4].uefaA },
        { label: 'Career Flows', value: '4' }
      ],
      tags: ['Pathways', 'Qualifications', 'Career']
    },
    {
      id: 'impact-interventions',
      title: 'Impact, Interventions & Geospatial',
      description: 'Intervention effectiveness tracking with geographical distribution analysis',
      icon: AnalyticsOutlined,
      route: '/analysis/impact-interventions',
      metrics: [
        { label: 'Regions', value: pcpData.leagueData.regionalDistribution.length },
        { label: 'Intervention Impact', value: `+${(pcpData.leagueData.interventionImpact[6].percentage - pcpData.leagueData.interventionImpact[4].percentage).toFixed(1)}%` },
        { label: 'Data Points', value: '7yr' }
      ],
      tags: ['Impact', 'Geography', 'Interventions']
    }
  ]

  const handleDashboardClick = (route) => {
    navigate(route)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          League Dashboards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive analytics and insights for the Pro Coach Partnership workforce
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboards.map((dashboard) => {
          const IconComponent = dashboard.icon
          return (
            <Grid item xs={12} md={6} lg={4} key={dashboard.id}>
              <Card 
                sx={{ 
                  height: '100%',
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconComponent sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {dashboard.title}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <ArrowForwardOutlined fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.5 }}>
                    {dashboard.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {dashboard.metrics.map((metric, index) => (
                      <Box key={index} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          {metric.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {metric.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {dashboard.tags.map((tag) => (
                      <Chip 
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '11px' }}
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