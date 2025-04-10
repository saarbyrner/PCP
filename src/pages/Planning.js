import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Planning() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <EventNoteIcon sx={{ mr: 1 }} />
        Planning
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Training and session planning
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Planning page. It will contain training schedules and session planning tools.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Planning;
