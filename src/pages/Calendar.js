import React from 'react';
import { 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { 
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Calendar() {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CalendarTodayIcon sx={{ mr: 1 }} />
        Calendar
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Schedule and manage events
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the Calendar page. It will contain scheduling tools and event management features.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Calendar;
