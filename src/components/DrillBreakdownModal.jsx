import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar
} from '@mui/material'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { useView } from '../contexts/ViewContext'

const DrillBreakdownModal = ({ open, onClose, coach, drillData }) => {
  const { currentTheme } = useView()

  if (!coach || !drillData) return null

  // Transform drill data for charts
  const chartData = Object.entries(drillData).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: Math.round((count / Object.values(drillData).reduce((a, b) => a + b, 0)) * 100)
  }))



  const totalDrills = Object.values(drillData).reduce((a, b) => a + b, 0)

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-primary)'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid var(--color-border-primary)',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            width: 48, 
            height: 48, 
            bgcolor: currentTheme.primaryColor,
            fontSize: '18px'
          }}>
            {coach.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: currentTheme.primaryColor }}>
              {coach.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {coach.role} • {coach.department}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: currentTheme.primaryColor }}>
            Drill Breakdown
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Drills Coached: {totalDrills.toLocaleString()}
          </Typography>
        </Box>

        {/* Bar Chart */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Drill Distribution
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary)" />
            <XAxis 
              dataKey="type" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
              tick={{ fill: 'var(--color-text-primary)' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: 'var(--color-text-primary)' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-background-primary)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 8
              }}
            />
            <Bar 
              dataKey="count" 
              fill={currentTheme.primaryColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </DialogContent>

      <DialogActions sx={{ 
        borderTop: '1px solid var(--color-border-primary)',
        pt: 2,
        px: 3,
        pb: 3
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: 'var(--color-border-primary)',
            color: 'var(--color-text-primary)',
            '&:hover': {
              borderColor: currentTheme.primaryColor,
              backgroundColor: 'transparent'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DrillBreakdownModal
