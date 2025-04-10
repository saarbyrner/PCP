import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  Storage as StorageIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function DataCollection() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <StorageIcon sx={{ mr: 1 }} />
        Data Collection
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Collect and manage athlete performance data
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Data Collection page. It will contain tools for gathering, importing, and managing athlete data.
        </Typography>
      </Paper>
    </Box>
  );
}

export default DataCollection;
