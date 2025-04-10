import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Dashboard() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <DashboardIcon sx={{ mr: 1 }} />
        Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of key metrics and athlete performance
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Dashboard page. It will contain overview metrics and performance summaries.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;
