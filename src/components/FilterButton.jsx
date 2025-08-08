import React from 'react'
import PropTypes from 'prop-types'
import { Button, Badge } from '@mui/material'
import { FilterListOutlined } from '@mui/icons-material'

function FilterButton({ onClick, activeFiltersCount = 0 }) {
  return (
    <Badge 
      badgeContent={activeFiltersCount} 
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: 'var(--color-primary, #3B4960)',
          color: 'white',
          fontSize: '10px',
          minWidth: '16px',
          height: '16px'
        }
      }}
    >
      <Button
        variant="contained" 
        size="small"
        onClick={onClick}
        startIcon={<FilterListOutlined fontSize="small" />}
        sx={{
          textTransform: 'none',
          fontSize: '12px',
          fontWeight: 500,
          borderColor: 'var(--color-border, #E5E5E5)',
          color: 'var(--color-text-secondary, #6B7280)',
          backgroundColor: 'var(--color-background-primary, #FFFFFF)',
          '&:hover': {
            borderColor: 'var(--color-primary, #3B4960)',
            backgroundColor: 'var(--color-background-secondary, #F1F2F3)',
            color: 'var(--color-primary, #3B4960)'
          }
        }}
      >
        Filter
      </Button>
    </Badge>
  )
}

FilterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  activeFiltersCount: PropTypes.number
}

export default FilterButton