import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Admin() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AdminPanelSettingsIcon sx={{ mr: 1 }} />
        Admin
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        System administration and user management
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Admin page. It will contain system configuration and user management tools.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Admin;
