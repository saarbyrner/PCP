import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useView } from '../contexts/ViewContext'
import DashboardCard from '../components/DashboardCard'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  Paper,
  Button
} from '@mui/material'
import { 
  ArrowBackOutlined,
  PersonOutlined,
  SchoolOutlined,
  WorkOutlineOutlined,
  EmojiEventsOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ErrorOutlined,
  AddOutlined,
  LocationOnOutlined,
  CalendarTodayOutlined,
  BadgeOutlined
} from '@mui/icons-material'
import { liverpoolFCData } from '../data/liverpool-fc-coaches'

function IndividualCoachProfileDashboard() {
  const navigate = useNavigate()
  const { currentTheme } = useView()
  const [selectedCoachId, setSelectedCoachId] = useState(1) // Default to first coach

  // Get selected coach data
  const selectedCoach = liverpoolFCData.coaches.find(coach => coach.id === selectedCoachId)

  // Mock timeline data for the selected coach
  const getCoachTimeline = (coach) => {
    if (coach.id === 1) { // Jürgen Klopp
      return [
        { 
          date: '2015-10-08', 
          type: 'job', 
          title: 'Appointed First Team Manager', 
          description: 'Joined Liverpool FC as First Team Manager',
          club: 'Liverpool FC',
          level: 'First Team'
        },
        { 
          date: '2019-06-01', 
          type: 'success', 
          title: 'Champions League Winner', 
          description: 'Led Liverpool to Champions League victory against Tottenham',
          achievement: 'European Cup'
        },
        { 
          date: '2020-06-25', 
          type: 'success', 
          title: 'Premier League Champion', 
          description: 'First Premier League title in 30 years',
          achievement: 'Premier League'
        },
        { 
          date: '2021-03-15', 
          type: 'certificate', 
          title: 'UEFA Pro License Renewed', 
          description: 'Successfully renewed UEFA Pro coaching license',
          qualification: 'UEFA Pro License'
        }
      ]
    } else if (coach.id === 5) { // Alex Inglethorpe
      return [
        { 
          date: '2012-09-01', 
          type: 'job', 
          title: 'Appointed Academy Director', 
          description: 'Joined Liverpool FC as Academy Director',
          club: 'Liverpool FC',
          level: 'Academy'
        },
        { 
          date: '2018-05-12', 
          type: 'success', 
          title: '3 Players Graduated to First Team', 
          description: 'Successfully developed academy players to first team level',
          achievement: 'Player Development'
        },
        { 
          date: '2019-04-20', 
          type: 'certificate', 
          title: 'UEFA B License', 
          description: 'Completed UEFA B coaching qualification',
          qualification: 'UEFA B License'
        },
        { 
          date: '2020-03-15', 
          type: 'certificate', 
          title: 'UEFA A License', 
          description: 'Advanced to UEFA A coaching qualification',
          qualification: 'UEFA A License'
        },
        { 
          date: '2021-06-10', 
          type: 'success', 
          title: 'Academy Trophy Winner', 
          description: 'Led academy team to cup victory',
          achievement: 'Academy Cup'
        }
      ]
    } else {
      return [
        { 
          date: new Date(coach.joinDate).toISOString().split('T')[0], 
          type: 'job', 
          title: `Joined as ${coach.role}`, 
          description: `Started role in ${coach.department}`,
          club: 'Liverpool FC',
          level: coach.department
        },
        ...coach.qualifications.map((qual, index) => ({
          date: new Date(Date.now() - (index * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          type: 'certificate',
          title: `${qual} Completed`,
          description: `Achieved ${qual} qualification`,
          qualification: qual
        }))
      ]
    }
  }

  const timeline = getCoachTimeline(selectedCoach)

  // Helper function to get compliance status color and icon
  const getComplianceDisplay = (status) => {
    switch (status) {
      case 'compliant':
        return { color: '#28a745', icon: <CheckCircleOutlined />, text: 'Active' }
      case 'expiring':
        return { color: '#ffc107', icon: <WarningOutlined />, text: 'Expiring Soon' }
      case 'non-compliant':
        return { color: '#dc3545', icon: <ErrorOutlined />, text: 'Expired' }
      default:
        return { color: '#6c757d', icon: <CheckCircleOutlined />, text: 'Unknown' }
    }
  }

  // Get timeline icon based on type
  const getTimelineIcon = (type) => {
    switch (type) {
      case 'job':
        return <WorkOutlineOutlined sx={{ fontSize: 20 }} />
      case 'certificate':
        return <SchoolOutlined sx={{ fontSize: 20 }} />
      case 'success':
        return <EmojiEventsOutlined sx={{ fontSize: 20 }} />
      default:
        return <PersonOutlined sx={{ fontSize: 20 }} />
    }
  }

  const getTimelineColor = (type) => {
    switch (type) {
      case 'job':
        return currentTheme.primaryColor
      case 'certificate':
        return '#1976d2'
      case 'success':
        return '#f57c00'
      default:
        return '#757575'
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/analysis')} sx={{ mr: 1, p: 1 }}>
            <ArrowBackOutlined fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', mb: 0.5 }}>
              Digital CV
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
              Detailed coach profiles with career timeline and compliance tracking
            </Typography>
          </Box>
        </Box>
          
          {/* Coach Selector */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Coach</InputLabel>
            <Select
              value={selectedCoachId}
              onChange={(e) => setSelectedCoachId(e.target.value)}
              label="Select Coach"
            >
              {liverpoolFCData.coaches.map(coach => (
                <MenuItem key={coach.id} value={coach.id}>
                  {coach.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      {/* Hero Section */}
      <Card sx={{ mb: 3, backgroundColor: 'white' }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: currentTheme.primaryColor,
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}
              >
                {selectedCoach.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" sx={{ fontWeight: 600, color: currentTheme.primaryColor, mb: 0.5 }}>
                {selectedCoach.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                {selectedCoach.role}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Liverpool FC</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BadgeOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{selectedCoach.department}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Joined {new Date(selectedCoach.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Age
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: currentTheme.primaryColor, textAlign: 'center' }}>
                  {selectedCoach.age}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Career Highlights KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {Math.floor((new Date() - new Date(selectedCoach.joinDate)) / (365 * 24 * 60 * 60 * 1000))}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Years at Liverpool FC
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {selectedCoach.qualifications.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Active Qualifications
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {timeline.filter(t => t.type === 'success').length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Career Achievements
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {Math.round((Object.values(selectedCoach.compliance).filter(c => c.status === 'compliant').length / Object.values(selectedCoach.compliance).length) * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Compliance Rate
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {selectedCoach.playersCoachedCount}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Players Coached
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {selectedCoach.totalSessionsCoached}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Total Sessions Coached
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {selectedCoach.totalDrillsCoached}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Total Drills Coached
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardCard height="90px">
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: currentTheme.primaryColor, fontSize: '28px', lineHeight: 1 }}>
                {selectedCoach.totalGames.wins}-{selectedCoach.totalGames.draws}-{selectedCoach.totalGames.losses}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', mt: 0.5 }}>
                Games (W-D-L)
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Digital CV */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', color: '#333', lineHeight: 1.2 }}>
                  Digital CV
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<AddOutlined />}
                  sx={{ color: currentTheme.primaryColor }}
                >
                  Add
                </Button>
              </Box>

              <Stack spacing={3}>
                {/* Personal Details */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: currentTheme.primaryColor }}>
                    Personal Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Nationality</Typography>
                      <Typography variant="body2">{selectedCoach.nationality}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Gender</Typography>
                      <Typography variant="body2">{selectedCoach.gender}</Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Qualifications */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: currentTheme.primaryColor }}>
                    Qualifications
                  </Typography>
                  <Stack spacing={1}>
                    {selectedCoach.qualifications.map((qual, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{qual}</Typography>
                        <Chip 
                          label="Active" 
                          size="small" 
                          sx={{ 
                            bgcolor: '#28a74520', 
                            color: '#28a745',
                            fontSize: '10px',
                            height: '20px'
                          }} 
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Divider />

                {/* CPD (Continuing Professional Development) */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: currentTheme.primaryColor }}>
                    CPD (Continuing Professional Development)
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Points Needed</Typography>
                      <Typography variant="body2">{selectedCoach.cpd.pointsNeeded}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Points Today</Typography>
                      <Typography variant="body2">{selectedCoach.cpd.pointsCurrent}</Typography>
                    </Box>
                    {selectedCoach.cpd.expiringPoints && selectedCoach.cpd.expiringPoints.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                          Expiring Points:
                        </Typography>
                        {selectedCoach.cpd.expiringPoints.map((item, index) => (
                          <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                            - {item.amount} points expiring {new Date(item.date).toLocaleDateString()}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {selectedCoach.cpd.availableCourses && selectedCoach.cpd.availableCourses.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                          Available Courses:
                        </Typography>
                        {selectedCoach.cpd.availableCourses.map((course, index) => (
                          <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                            - {course}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Divider />

                {/* Coaching Details */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: currentTheme.primaryColor }}>
                    Coaching Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Age Groups Coached</Typography>
                      <Typography variant="body2">{selectedCoach.ageGroupsCoached.join(', ')}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Dashboard */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', color: '#333', lineHeight: 1.2 }}>
                  Compliance Status
                </Typography>
              </Box>

              <Stack spacing={3}>
                {Object.entries(selectedCoach.compliance).map(([type, status]) => {
                  const display = getComplianceDisplay(status.status)
                  return (
                    <Paper key={type} sx={{ p: 2, border: `1px solid ${display.color}20` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: display.color }}>
                          {display.icon}
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {display.text}
                          </Typography>
                        </Box>
                      </Box>
                      {status.expiry && (
                        <Typography variant="caption" color="text.secondary">
                          Expires: {new Date(status.expiry).toLocaleDateString()}
                        </Typography>
                      )}
                      <LinearProgress
                        variant="determinate"
                        value={status.status === 'compliant' ? 100 : status.status === 'expiring' ? 75 : 0}
                        sx={{ 
                          mt: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: `${display.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: display.color
                          }
                        }}
                      />
                    </Paper>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Career Timeline */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', color: '#333', lineHeight: 1.2 }}>
                  Career Timeline
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<AddOutlined />}
                  sx={{ color: currentTheme.primaryColor }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ position: 'relative' }}>
                {timeline.slice(0, 4).map((event, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 3, alignItems: 'flex-start' }}>
                    {/* Date */}
                    <Box sx={{ minWidth: 80, mr: 2, textAlign: 'right', pt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    {/* Timeline line and dot */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                      <Box 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          bgcolor: getTimelineColor(event.type),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        {getTimelineIcon(event.type)}
                      </Box>
                      {index < timeline.slice(0, 4).length - 1 && (
                        <Box 
                          sx={{ 
                            width: 2, 
                            height: 40, 
                            bgcolor: '#e0e0e0',
                            mt: 1
                          }} 
                        />
                      )}
                    </Box>
                    
                    {/* Content */}
                    <Box sx={{ flex: 1, pt: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0.5 }}>
                        {event.description}
                      </Typography>
                      {event.achievement && (
                        <Chip 
                          label={event.achievement} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f57c0020', 
                            color: '#f57c00',
                            fontSize: '10px',
                            height: '18px'
                          }} 
                        />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default IndividualCoachProfileDashboard