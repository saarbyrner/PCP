import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageTemplate({ title, icon }) {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box component="span" sx={{ mr: 1, display: 'flex' }}>{icon}</Box>}
        {title}
      </Typography>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mt: 2, 
          bgcolor: theme.palette.background.paper,
          borderTop: `4px solid ${theme.palette.primary.main}`
        }}
      >
        <Typography variant="body1" paragraph>
          This is a placeholder for the {title} page content.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Replace this component with your actual implementation.
        </Typography>
      </Paper>
    </Box>
  );
}

export default PageTemplate;
