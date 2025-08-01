import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import pcpData from '../data/pcp.json'

function ImpactInterventionsDashboard() {
  const navigate = useNavigate()

  const interventionData = pcpData.leagueData.interventionImpact
  const regionalData = pcpData.leagueData.regionalDistribution
  const ethnicityData = pcpData.leagueData.ethnicityDistribution

  // Mock comparison data
  const comparisonData = [
    { group: 'Coaching Programme Cohort', progressionRate: '85%', qualificationRate: '78%', retentionRate: '92%' },
    { group: 'Control Group', progressionRate: '62%', qualificationRate: '54%', retentionRate: '76%' }
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/analysis')} sx={{ mr: 2 }}>
          <ArrowBackOutlined />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Impact, Interventions & Geospatial
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Intervention effectiveness tracking with geographical distribution analysis
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Intervention Impact Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Intervention Impact: Female Coach Representation
              </Typography>
              <Box sx={{ height: '300px', position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'end', height: '250px', gap: 1 }}>
                  {interventionData.map((point, index) => {
                    const isPostIntervention = index >= 4
                    return (
                      <Box key={index} sx={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                        {/* Intervention marker */}
                        {index === 4 && (
                          <Box sx={{ 
                            position: 'absolute', 
                            top: '-30px', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            zIndex: 2
                          }}>
                            <Box sx={{ 
                              width: '2px', 
                              height: '280px', 
                              backgroundColor: '#ff6b35',
                              position: 'relative'
                            }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: '-20px', 
                                  left: '5px',
                                  backgroundColor: '#ff6b35',
                                  color: 'white',
                                  px: 1,
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Intervention Start
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        <Box 
                          sx={{ 
                            height: `${(point.percentage / 10) * 200}px`, 
                            backgroundColor: isPostIntervention ? '#4caf50' : '#1976d2',
                            mb: 1,
                            borderRadius: '2px 2px 0 0',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1
                          }} 
                        />
                        <Typography variant="caption" sx={{ fontSize: '10px' }}>
                          {point.season}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '10px', display: 'block', mt: 0.5 }}>
                          {point.percentage}%
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '12px', height: '12px', backgroundColor: '#1976d2' }} />
                    <Typography variant="caption">Pre-Intervention</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '12px', height: '12px', backgroundColor: '#4caf50' }} />
                    <Typography variant="caption">Post-Intervention</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '2px', height: '12px', backgroundColor: '#ff6b35' }} />
                    <Typography variant="caption">Intervention Point</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* UK Regional Map */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                UK Regional Distribution
              </Typography>
              <Box sx={{ height: '300px', position: 'relative' }}>
                {/* Simplified UK regions representation */}
                <Box sx={{ 
                  width: '100%', 
                  height: '200px',
                  position: 'relative',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0'
                }}>
                  {regionalData.map((region, index) => {
                    const intensity = region.coachesPerMillion / 130
                    const positions = [
                      { top: '20%', left: '30%' }, // North West
                      { top: '50%', left: '60%' }, // East Midlands  
                      { top: '70%', left: '50%' }, // South East & London
                      { top: '50%', left: '40%' }, // West Midlands
                      { top: '30%', left: '50%' }, // Yorkshire
                      { top: '15%', left: '45%' }  // Other
                    ]
                    
                    return (
                      <Box 
                        key={index}
                        sx={{
                          position: 'absolute',
                          ...positions[index],
                          width: '50px',
                          height: '30px',
                          backgroundColor: `rgba(25, 118, 210, ${intensity})`,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: intensity > 0.6 ? 'white' : 'black',
                          fontSize: '10px',
                          textAlign: 'center',
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      >
                        {region.coachesPerMillion}
                      </Box>
                    )
                  })}
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    Coaches per Million Population
                  </Typography>
                  {regionalData.slice(0, 3).map((region, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontSize: '10px' }}>
                        {region.region}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600 }}>
                        {region.coachesPerMillion}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Comparison Analysis */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '300px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Programme vs Control Group Comparison
              </Typography>
              <Box sx={{ height: '200px' }}>
                {comparisonData.map((group, groupIndex) => (
                  <Box key={groupIndex} sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                      {group.group}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {[
                        { label: 'Progression', value: group.progressionRate },
                        { label: 'Qualification', value: group.qualificationRate },
                        { label: 'Retention', value: group.retentionRate }
                      ].map((metric, index) => (
                        <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 600, 
                              color: groupIndex === 0 ? '#4caf50' : '#ff6b35',
                              mb: 0.5
                            }}
                          >
                            {metric.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {metric.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Requirements Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '300px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Data Quality Metrics
              </Typography>
              <TableContainer sx={{ height: '200px' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Source</TableCell>
                      <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Coverage</TableCell>
                      <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Missing Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontSize: '11px' }}>LCA</TableCell>
                      <TableCell sx={{ fontSize: '11px' }}>88%</TableCell>
                      <TableCell sx={{ fontSize: '11px', color: '#ff6b35' }}>
                        {ethnicityData.missingData.lca}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '11px' }}>LMA</TableCell>
                      <TableCell sx={{ fontSize: '11px' }}>23%</TableCell>
                      <TableCell sx={{ fontSize: '11px', color: '#f44336' }}>
                        {ethnicityData.missingData.lma}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '11px' }}>FA Regional</TableCell>
                      <TableCell sx={{ fontSize: '11px' }}>95%</TableCell>
                      <TableCell sx={{ fontSize: '11px', color: '#4caf50' }}>5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '11px' }}>PCP Unified</TableCell>
                      <TableCell sx={{ fontSize: '11px' }}>100%</TableCell>
                      <TableCell sx={{ fontSize: '11px', color: '#4caf50' }}>0%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ImpactInterventionsDashboard