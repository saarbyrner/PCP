import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  Person as PersonIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Athletes() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <PersonIcon sx={{ mr: 1 }} />
        Athletes
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Manage and view athlete information
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Athletes page. It will contain athlete profiles and management tools.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Athletes;
