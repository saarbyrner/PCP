import React, { useState } from 'react'
import { Box, Typography, Grid, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material'
import LogoImage from '../components/LogoImage'
import { getOrganizationLogoDimensions } from '../utils/assetManager'

function OrganizationLogosTest() {
  const [size, setSize] = useState('medium')
  
  const organizations = [
    { id: 'efl', name: 'English Football League (EFL)' },
    { id: 'fa', name: 'Football Association (FA)' },
    { id: 'lca', name: 'League Coaches Association (LCA)' },
    { id: 'lma', name: 'League Managers Association (LMA)' },
    { id: 'pfa', name: 'Professional Footballers\' Association (PFA)' },
    { id: 'premier-league', name: 'Premier League' },
    { id: 'womens-professional-game', name: 'Women\'s Professional Game' }
  ]

  const sizeConfig = {
    small: { baseHeight: 50 },
    medium: { baseHeight: 80 },
    large: { baseHeight: 120 }
  }

  const config = sizeConfig[size]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Organization Logos Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Size:
        </Typography>
        <ToggleButtonGroup
          value={size}
          exclusive
          onChange={(e, newSize) => newSize && setSize(newSize)}
        >
          <ToggleButton value="small">Small (50px height)</ToggleButton>
          <ToggleButton value="medium">Medium (80px height)</ToggleButton>
          <ToggleButton value="large">Large (120px height)</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Grid container spacing={3}>
        {organizations.map((org) => {
          const logoDimensions = getOrganizationLogoDimensions(org.id, config.baseHeight)
          return (
            <Grid item xs={12} sm={6} md={4} key={org.id}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ 
                  mb: 2, 
                  height: logoDimensions.height + 20, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px dashed #ccc',
                  borderRadius: 1
                }}>
                  <LogoImage
                    type="organization"
                    logoId={org.id}
                    alt={org.name}
                    height={logoDimensions.height}
                    width={logoDimensions.width}
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {org.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  ID: {org.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Size: {logoDimensions.width}x{logoDimensions.height}px
                </Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default OrganizationLogosTest
