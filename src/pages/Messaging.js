import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  Message as MessageIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Messaging() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <MessageIcon sx={{ mr: 1 }} />
        Messaging
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Communication and notifications
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Messaging page. It will contain communication tools for team members and athletes.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Messaging;
