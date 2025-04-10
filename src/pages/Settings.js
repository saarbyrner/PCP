import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Settings() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ mr: 1 }} />
        Settings
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Configure application preferences
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Settings page. It will contain application configuration options.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Settings;
