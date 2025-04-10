import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Medical() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <MedicalServicesIcon sx={{ mr: 1 }} />
        Medical
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Injury tracking and medical records
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Medical page. It will contain injury tracking and medical record management tools.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Medical;
