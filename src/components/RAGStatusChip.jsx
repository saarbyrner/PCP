import React from 'react'
import PropTypes from 'prop-types'
import { Chip, Box, Typography } from '@mui/material'
import { getRAGStatus, getRAGColor, getRAGLabel } from '../data/completeness-quality-data'

function RAGStatusChip({ completeness, showLabel = true, size = 'small' }) {
  const status = getRAGStatus(completeness)
  const color = getRAGColor(status)
  const label = getRAGLabel(status)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        label={`${completeness}%`}
        size={size}
        sx={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 600,
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          minWidth: size === 'small' ? '50px' : '60px'
        }}
      />
      {showLabel && (
        <Typography
          variant="caption"
          sx={{
            color: color,
            fontWeight: 500,
            fontSize: '0.7rem'
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  )
}

RAGStatusChip.propTypes = {
  completeness: PropTypes.number.isRequired,
  showLabel: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium'])
}

export default RAGStatusChip
