import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useView } from '../contexts/ViewContext'
import FilterDrawer from '../components/FilterDrawer'
import FilterButton from '../components/FilterButton'
import DashboardCard from '../components/DashboardCard'
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
  Avatar,
  LinearProgress,
  Alert,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import { 
  ArrowBackOutlined,
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
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { liverpoolFCData } from '../data/liverpool-fc-coaches'

function CoachManagementDashboard() {
  const navigate = useNavigate()
  const { currentTheme } = useView()
  
  // Filter State - updated for drawer system
  const [filters, setFilters] = useState({
    departments: [],
    roles: [],
    search: '',
    complianceStatus: [],
    nationalities: []
  })
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

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
      if (filters.departments.length > 0 && !filters.departments.includes(coach.department)) {
        return false
      }
      
      // Role filter
      if (filters.roles.length > 0 && !filters.roles.includes(coach.role)) {
        return false
      }
      
      // Compliance filter
      if (filters.complianceStatus.length > 0) {
        const hasCompliance = Object.values(coach.compliance).some(cert => 
          filters.complianceStatus.includes(cert.status)
        )
        if (!hasCompliance) return false
      }
      
      // Nationality filter
      if (filters.nationalities.length > 0 && !filters.nationalities.includes(coach.nationality)) {
        return false
      }
      
      return true
    })
  }, [filters])

  // Get unique filter options and create Liverpool FC filter configuration
  const filterOptions = useMemo(() => ({
    departments: [...new Set(liverpoolFCData.coaches.map(coach => coach.department))],
    roles: [...new Set(liverpoolFCData.coaches.map(coach => coach.role))],
    complianceStates: ['compliant', 'expiring', 'non-compliant'],
    nationalities: [...new Set(liverpoolFCData.coaches.map(coach => coach.nationality))]
  }), [])

  // Liverpool FC specific filter configuration
  const liverpoolFilterConfig = useMemo(() => ({
    search: true,
    sections: [
      {
        title: 'Departments',
        filterKey: 'departments',
        options: filterOptions.departments.map(dept => ({ value: dept, label: dept }))
      },
      {
        title: 'Roles',
        filterKey: 'roles',
        options: filterOptions.roles.map(role => ({ value: role, label: role }))
      },
      {
        title: 'Compliance Status',
        filterKey: 'complianceStatus',
        options: filterOptions.complianceStates.map(status => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
        }))
      },
      {
        title: 'Nationalities',
        filterKey: 'nationalities',
        options: filterOptions.nationalities.map(nationality => ({ value: nationality, label: nationality }))
      }
    ]
  }), [filterOptions])

  // Helper functions for drawer system
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setFilterDrawerOpen(false)
  }

  const getActiveFiltersCount = () => {
    const { search, departments, roles, complianceStatus, nationalities } = filters
    return (search ? 1 : 0) + 
           departments.length + 
           roles.length + 
           complianceStatus.length + 
           nationalities.length
  }

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
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5, color: currentTheme.primaryColor }}>
                Coach Management & Compliance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                Digital passport, roster management, and compliance tracking for Liverpool FC coaching staff
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
          {liverpoolFCData.kpis.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DashboardCard height="90px">
                <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                    {typeof kpi.value === 'number' && kpi.value > 100 ? kpi.value.toLocaleString() : kpi.value}
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
          {/* Coach Roster Table */}
          <Grid item xs={12} lg={8}>
            <DashboardCard 
              title={`Coach Roster (${filteredCoaches.length})`}
              height="480px"
            >
              
              <TableContainer sx={{ height: '400px', overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Coach</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="center">Compliance</TableCell>
                      <TableCell>Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCoaches.slice(0, 10).map((coach) => (
                      <TableRow key={coach.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: currentTheme.primaryColor }}>
                              {coach.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {coach.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {coach.nationality} • Age {coach.age}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{coach.role}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={coach.department} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '11px' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              position: 'relative',
                              width: 20,
                              height: 20
                            }}>
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%', 
                                bgcolor: getComplianceStatusColor(coach.compliance.safeguarding.status),
                                position: 'absolute'
                              }} />
                              <Box sx={{ 
                                position: 'relative', 
                                zIndex: 1,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {getComplianceStatusIcon(coach.compliance.safeguarding.status)}
                              </Box>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              position: 'relative',
                              width: 20,
                              height: 20
                            }}>
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%', 
                                bgcolor: getComplianceStatusColor(coach.compliance.firstAid.status),
                                position: 'absolute'
                              }} />
                              <Box sx={{ 
                                position: 'relative', 
                                zIndex: 1,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {getComplianceStatusIcon(coach.compliance.firstAid.status)}
                              </Box>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              position: 'relative',
                              width: 20,
                              height: 20
                            }}>
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%', 
                                bgcolor: getComplianceStatusColor(coach.compliance.coaching.status),
                                position: 'absolute'
                              }} />
                              <Box sx={{ 
                                position: 'relative', 
                                zIndex: 1,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {getComplianceStatusIcon(coach.compliance.coaching.status)}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(coach.lastUpdated).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          {/* Compliance Overview */}
          <Grid item xs={12} lg={4}>
            <DashboardCard 
              title="Compliance Overview"
              height="480px"
            >

              <Box sx={{ height: '400px', overflow: 'auto' }}>
                <Stack spacing={2}>
                {Object.entries(liverpoolFCData.complianceOverview).map(([type, data]) => (
                  <Box key={type}>
                    <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize', mb: 1 }}>
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(data.compliant / (data.compliant + data.nonCompliant + data.expiring)) * 100}
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: currentTheme.primaryColor
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((data.compliant / (data.compliant + data.nonCompliant + data.expiring)) * 100)}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, fontSize: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#28a745', mr: 0.5 }} />
                        <Typography variant="caption">{data.compliant} Compliant</Typography>
                      </Box>
                      {data.expiring > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ffc107', mr: 0.5 }} />
                          <Typography variant="caption">{data.expiring} Expiring</Typography>
                        </Box>
                      )}
                      {data.nonCompliant > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#dc3545', mr: 0.5 }} />
                          <Typography variant="caption">{data.nonCompliant} Non-compliant</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
              </Box>
            </DashboardCard>
          </Grid>

          {/* Qualifications Breakdown Chart */}
          <Grid item xs={12} md={6}>
            <DashboardCard 
              title="Qualifications Breakdown"
              height="280px"
            >
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={liverpoolFCData.qualificationsBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="qualification" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    fontSize={11}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={currentTheme.primaryColor} />
                </BarChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>

          {/* Department Breakdown */}
          <Grid item xs={12} md={6}>
            <DashboardCard 
              title="Department Distribution"
              height="280px"
            >
              
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={liverpoolFCData.departmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {liverpoolFCData.departmentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? currentTheme.primaryColor : `${currentTheme.primaryColor}${Math.floor(255 - (index * 40)).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>

          {/* Recent Updates */}
          <Grid item xs={12}>
            <DashboardCard title="Recent Updates">
              
              <Stack spacing={2}>
                {liverpoolFCData.recentUpdates.map((update, index) => (
                  <Alert 
                    key={index}
                    severity={update.type === 'compliance_expiry' ? 'warning' : 'info'}
                    sx={{ 
                      '& .MuiAlert-message': { flexGrow: 1 }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Typography variant="body2">
                        {update.message}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip 
                          label={update.department} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '11px' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(update.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Alert>
                ))}
              </Stack>
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
        filterConfig={liverpoolFilterConfig}
      />
    </Box>
  )
}

export default CoachManagementDashboard