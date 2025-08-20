import React from 'react'
import { Box, Typography } from '@mui/material'

function SimplePage({ pageName }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {pageName}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is under development. Content for {pageName} will be added here.
      </Typography>
    </Box>
  )
}

export default SimplePage