// CLEAN IMPLEMENTATION (replaces corrupted previous content)
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, IconButton, Chip, Stack, Card, CardContent, LinearProgress } from '@mui/material'
import { ArrowBackOutlined, TrendingUp, TrendingDown, CheckCircle, Warning } from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, Legend, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts'
import FilterButton from '../components/FilterButton'
import FilterDrawer from '../components/FilterDrawer'
import DashboardCard from '../components/DashboardCard'
import TimelineVisualization from '../components/TimelineVisualization'
import { useCoachData } from '../hooks/useCoachData'

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

function EDIDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  // Demographics selected for the career timeline (allows in-component toggles to work)
  const [timelineDemographics, setTimelineDemographics] = useState(['ethnicity'])
  const coachData = useCoachData(filters)

  const handleFiltersChange = (newFilters) => setFilters(newFilters)
  const getActiveFiltersCount = () => Object.values(filters).filter(v => Array.isArray(v) && v.length).length

  // Compute baseline percentages from filtered data
  const ediPathwayMetrics = useMemo(() => {
    if (!coachData.coaches || coachData.coaches.length === 0) {
      return { headCoaches: { percentage: 0 }, academyCoaches: { percentage: 0 }, uefaBLicense: { percentage: 0 } }
    }
    const head = coachData.coaches.filter(c => c.primaryCoachingRole === 'head-coach')
    const academy = coachData.coaches.filter(c => c.primaryCoachingRole === 'academy-coach')
    const uefaBOrAbove = coachData.coaches.filter(c => ['uefa-b','uefa-a','uefa-pro'].includes(c.uefaBadges))
    const pct = (group) => {
      if (!group.length) return 0
      const em = group.filter(c => c.ethnicity && c.ethnicity !== 'white').length
      return (em / group.length) * 100
    }
    return {
      headCoaches: { percentage: pct(head) },
      academyCoaches: { percentage: pct(academy) },
      uefaBLicense: { percentage: pct(uefaBOrAbove) }
    }
  }, [coachData.coaches])

  // Override pathway values per issue (#23) except UEFA which uses live calc
  const pathwayData = useMemo(() => {
    const uefaCurrent = Math.round(ediPathwayMetrics.uefaBLicense.percentage * 10) / 10
    const stages = [
      { stage: 'UEFA B License or Above', current: uefaCurrent, target: 15 },
      { stage: 'Academy Coach', current: 10, target: 15 },
      { stage: 'Head Coach', current: 5, target: 15 }
    ]
    return stages.map((s,i) => {
      const progress = Math.min((s.current / s.target) * 100, 100)
      let status = 'progress'
      if (s.current >= s.target) status = 'success'
      else if (s.current < s.target * 0.8) status = 'warning'
      return { ...s, progress, status, color: COLORS[i%COLORS.length] }
    })
  }, [ediPathwayMetrics])

  const genderData = coachData.genderDistribution || []
  const ethnicityData = coachData.ethnicityDistribution?.breakdown || []
  const ageData = useMemo(() => {
    if (!coachData.coaches || coachData.coaches.length === 0) return []
    const counts = coachData.coaches.reduce((a,c)=>{ a[c.ageGroup]=(a[c.ageGroup]||0)+1; return a }, {})
    const total = coachData.coaches.length
    return Object.entries(counts).map(([k,v]) => ({ name:k, value: Math.round((v/total)*1000)/10 }))
  }, [coachData.coaches])

  const ethnicMinorityTrend = useMemo(() => {
    const seasons = ['19/20','20/21','21/22','22/23','23/24','24/25']
    const minorityValues = [6,9,5,11,8,15] // synthetic variability with latest 15%
    return seasons.map((season,i)=>{
      const percentage = minorityValues[i]
      const whitePercentage = Math.max(0, 100 - percentage) // complementary synthetic line
      return { season, percentage, whitePercentage }
    })
  }, [])

  const getStatusIcon = (status) => {
    switch(status){
      case 'success': return <CheckCircle sx={{ color:'var(--color-success)', fontSize:20 }} />
      case 'warning': return <Warning sx={{ color:'var(--color-warning)', fontSize:20 }} />
      case 'progress': return <TrendingUp sx={{ color:'var(--color-info)', fontSize:20 }} />
      default: return <TrendingDown sx={{ color:'var(--color-text-secondary)', fontSize:20 }} />
    }
  }
  const getStatusColor = (status) => {
    switch(status){
      case 'success': return 'var(--color-success)'
      case 'warning': return 'var(--color-warning)'
      case 'progress': return 'var(--color-info)'
      default: return 'var(--color-text-secondary)'
    }
  }

  return (
    <Box sx={{ display:'flex' }}>
      <Box sx={{ flexGrow:1, p:2 }}>
        {/* Header */}
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:3 }}>
          <Box sx={{ display:'flex', alignItems:'center' }}>
            <IconButton onClick={()=>navigate('/analysis')} sx={{ mr:1, p:1 }}>
              <ArrowBackOutlined fontSize='small' />
            </IconButton>
            <Box>
              <Typography variant='h5' sx={{ fontWeight:600, fontSize:'20px', mb:0.5 }}>
                EDI Dashboard
                {getActiveFiltersCount()>0 && (
                  <Typography component='span' sx={{ ml:2, fontSize:'14px', color:'var(--color-primary)', backgroundColor:'var(--color-info-light)', px:1, py:0.25, borderRadius:'12px', fontWeight:500 }}>
                    {coachData.totalCoaches} coaches (filtered)
                  </Typography>
                )}
              </Typography>
              <Typography variant='body2' sx={{ fontSize:'12px', color:'text.secondary' }}>
                Equality, Diversity & Inclusion metrics • {getActiveFiltersCount()>0 ? 'Showing filtered data' : 'All coaches shown'}
              </Typography>
            </Box>
          </Box>
          <FilterButton onClick={()=>setFilterDrawerOpen(true)} activeFiltersCount={getActiveFiltersCount()} />
        </Box>

        {/* Active Filters */}
        {getActiveFiltersCount()>0 && (
          <Box sx={{ mb:3, p:2, backgroundColor:'var(--color-background-tertiary)', borderRadius:'8px', border:'1px solid var(--color-border-primary)' }}>
            <Typography variant='body2' sx={{ fontSize:'13px', fontWeight:600, mb:1 }}>Active Data Filters</Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap'>
              {Object.entries(filters).flatMap(([k,vals])=>Array.isArray(vals)?vals.map(v=> <Chip key={`${k}-${v}`} label={`${k}: ${v}`} size='small' sx={{ fontSize:'10px', height:'24px', backgroundColor:'var(--color-primary)', color:'var(--color-white)' }} />):[])}
            </Stack>
          </Box>
        )}

        {/* Demographic Pie Charts */}
        <Grid container spacing={2} sx={{ mb:2 }}>
          <Grid item xs={12} md={4}>
            <DashboardCard title='Gender Distribution' height='360px'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie data={genderData} cx='50%' cy='50%' innerRadius={45} outerRadius={75} dataKey='value' label={({value})=> value>3?`${value}%`:''}>
                    {genderData.map((e,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor:'#fff', border:'1px solid #ccc', borderRadius:4, fontSize:'11px' }} formatter={v=>[`${v}%`,'Percentage']} />
                  <Legend wrapperStyle={{ fontSize:'var(--font-size-xs)' }} iconType='circle' iconSize={6} verticalAlign='bottom' height={40} formatter={(v,entry)=><span style={{ fontSize:'var(--font-size-xs)' }}>{v} ({entry.payload.value}%)</span>} />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard title='Ethnicity Distribution' height='360px'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie data={ethnicityData} cx='50%' cy='50%' innerRadius={45} outerRadius={75} dataKey='value' label={({value})=> value>0.5?`${value}%`:''}>
                    {ethnicityData.map((e,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor:'#fff', border:'1px solid #ccc', borderRadius:4, fontSize:'11px' }} formatter={(v,n)=>[`${v}%`, n]} />
                  <Legend wrapperStyle={{ fontSize:'var(--font-size-xs)', lineHeight:'1.2' }} iconType='circle' iconSize={6} verticalAlign='bottom' height={40} formatter={(v,entry)=><span style={{ fontSize:'var(--font-size-xs)' }}>{v} ({entry.payload.value}%)</span>} />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard title='Age Group Distribution' height='360px'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie data={ageData} cx='50%' cy='50%' innerRadius={45} outerRadius={75} dataKey='value' label={({value})=> value>3?`${value}%`:''}>
                    {ageData.map((e,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor:'#fff', border:'1px solid #ccc', borderRadius:4, fontSize:'11px' }} formatter={v=>[`${v}%`,'Percentage']} />
                  <Legend wrapperStyle={{ fontSize:'var(--font-size-xs)' }} iconType='circle' iconSize={6} verticalAlign='bottom' height={40} formatter={(v,entry)=><span style={{ fontSize:'var(--font-size-xs)' }}>{v} ({entry.payload.value}%)</span>} />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Ethnic Minority Representation Trend */}
        <Grid container spacing={2} sx={{ mb:3 }}>
          <Grid item xs={12}>
            <DashboardCard title='Ethnic Minority Representation Over Time' height='380px'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={ethnicMinorityTrend} margin={{ top:10, right:30, left:10, bottom:0 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border-secondary)' />
                  <XAxis dataKey='season' tick={{ fontSize:11, fill:'var(--color-text-secondary)' }} />
                  <YAxis domain={[0,100]} ticks={[0,20,40,60,80,100]} tickFormatter={v=>`${v}%`} tick={{ fontSize:11, fill:'var(--color-text-secondary)' }} />
                  <Tooltip contentStyle={{ backgroundColor:'var(--color-background-primary)', border:'1px solid var(--color-border-primary)', fontSize:'11px' }} formatter={v=>[`${v}%`,'Ethnic Minority %']} />
                  <Legend wrapperStyle={{ fontSize:'var(--font-size-xs)' }} />
                  <Line type='monotone' dataKey='percentage' name='Ethnic Minority %' stroke={COLORS[1]} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />
                  <Line type='monotone' dataKey='whitePercentage' name='White %' stroke={COLORS[0]} strokeWidth={2} dot={{ r:3 }} activeDot={{ r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Pathway Cards */}
        <Grid container spacing={2} sx={{ mb:3 }}>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ fontSize:'16px', fontWeight:600, mb:2 }}>Ethnic Minority Representation Pathway</Typography>
          </Grid>
          {pathwayData.map(stage => (
            <Grid item xs={12} md={4} key={stage.stage}>
              <Card sx={{ height:'100%', border:`1px solid ${getStatusColor(stage.status)}`, backgroundColor:'var(--color-background-primary)' }}>
                <CardContent sx={{ p:2 }}>
                  <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:1 }}>
                    <Typography variant='body2' sx={{ fontSize:'13px', fontWeight:600 }}>{stage.stage}</Typography>
                    {getStatusIcon(stage.status)}
                  </Box>
                  <Box sx={{ display:'flex', alignItems:'baseline', mb:1 }}>
                    <Typography variant='h6' sx={{ fontSize:'18px', fontWeight:700, color:getStatusColor(stage.status) }}>{stage.current}%</Typography>
                    <Typography variant='body2' sx={{ fontSize:'11px', ml:1, color:'var(--color-text-secondary)' }}>/ {stage.target}% target</Typography>
                  </Box>
                  <LinearProgress variant='determinate' value={stage.progress} sx={{ height:6, borderRadius:3, backgroundColor:'var(--color-border-secondary)', '& .MuiLinearProgress-bar':{ backgroundColor:getStatusColor(stage.status), borderRadius:3 } }} />
                  <Typography variant='caption' sx={{ fontSize:'10px', mt:0.5, display:'block', color:'var(--color-text-secondary)' }}>
                    {stage.progress>=100?'Target achieved':stage.progress>=80?'Close to target':stage.progress>=60?'Making progress':'Needs investment'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Timeline */}
        <Grid container spacing={2} sx={{ mb:2 }}>
          <Grid item xs={12}>
            <DashboardCard title='Career Progression Timeline' height='560px'>
              <TimelineVisualization 
                data={coachData} 
                demographics={timelineDemographics} 
                onDemographicsChange={setTimelineDemographics}
              />
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>

      <FilterDrawer open={filterDrawerOpen} onClose={()=>setFilterDrawerOpen(false)} onFiltersChange={handleFiltersChange} filters={filters} />
    </Box>
  )
}

export default EDIDashboard