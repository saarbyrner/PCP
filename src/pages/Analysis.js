import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Analysis() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AssessmentIcon sx={{ mr: 1 }} />
        Analysis
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Performance analysis and insights
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Analysis page. It will contain performance analytics and data visualization tools.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Analysis;
