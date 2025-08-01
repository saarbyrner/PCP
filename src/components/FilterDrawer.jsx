import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  Autocomplete,
  TextField,
  Chip,
  Stack,
  IconButton
} from '@mui/material'
import { CloseOutlined, FilterListOutlined, RefreshOutlined } from '@mui/icons-material'

function FilterDrawer({ open, onClose, onFiltersChange, filters = {} }) {
  const [localFilters, setLocalFilters] = useState(filters)

  // Filter options
  const filterOptions = {
    seasons: [
      { value: '2024', label: '2024' },
      { value: '2023', label: '2023' },
      { value: '2022', label: '2022' },
      { value: '2021', label: '2021' },
      { value: '2020', label: '2020' }
    ],
    regions: [
      { value: 'north-west', label: 'North West' },
      { value: 'east-midlands', label: 'East Midlands' },
      { value: 'south-east-london', label: 'South East & London' },
      { value: 'west-midlands', label: 'West Midlands' },
      { value: 'yorkshire-humber', label: 'Yorkshire & The Humber' },
      { value: 'other', label: 'Other' }
    ],
    ethnicities: [
      { value: 'white', label: 'White/White British' },
      { value: 'black', label: 'Black/Black British' },
      { value: 'asian', label: 'Asian/Asian British' },
      { value: 'mixed', label: 'Mixed' },
      { value: 'other', label: 'Other' }
    ],
    genders: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    positions: [
      { value: 'head-coach', label: 'Head Coach' },
      { value: 'assistant-coach', label: 'Assistant Coach' },
      { value: 'academy-coach', label: 'Academy Coach' },
      { value: 'development-coach', label: 'Development Coach' },
      { value: 'other', label: 'Other' }
    ],
    ageGroups: [
      { value: '18-25', label: '18-25' },
      { value: '26-35', label: '26-35' },
      { value: '36-45', label: '36-45' },
      { value: '46-55', label: '46-55' },
      { value: '56+', label: '56+' }
    ],
    employmentTypes: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'volunteer', label: 'Volunteer' }
    ]
  }

  const handleFilterChange = (filterKey, selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value)
    const newFilters = {
      ...localFilters,
      [filterKey]: selectedValues.length === 0 ? [] : selectedValues
    }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      season: [],
      region: [],
      ethnicity: [],
      gender: [],
      position: [],
      ageGroup: [],
      employmentType: []
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const getSelectedValues = (filterKey) => {
    const value = localFilters[filterKey]
    if (!value || !Array.isArray(value)) return []
    return options.filter(option => value.includes(option.value))
  }

  const FilterSection = ({ title, filterKey, options }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" sx={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        color: '#666', 
        mb: 0.5,
        display: 'block'
      }}>
        {title}
      </Typography>
      <Autocomplete
        multiple
        size="small"
        options={options}
        getOptionLabel={(option) => option.label}
        value={options.filter(option => (localFilters[filterKey] || []).includes(option.value))}
        onChange={(event, selectedOptions) => handleFilterChange(filterKey, selectedOptions)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`Select ${title.toLowerCase()}`}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '12px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                }
              }
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              size="small"
              sx={{
                fontSize: '11px',
                height: '24px'
              }}
            />
          ))
        }
        sx={{
          '& .MuiAutocomplete-tag': {
            margin: '2px'
          }
        }}
      />
    </Box>
  )

  const hasActiveFilters = Object.values(localFilters).some(value => Array.isArray(value) && value.length > 0)

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: open ? 320 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          backgroundColor: 'var(--color-background-primary, #FFFFFF)',
          borderLeft: '1px solid var(--color-border, #E5E5E5)',
          boxSizing: 'border-box'
        }
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListOutlined sx={{ 
              color: 'var(--color-primary, #3B4960)', 
              fontSize: '20px' 
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              fontSize: '16px',
              color: 'var(--color-text-primary, #3B4960)'
            }}>
              Filter data
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ 
              color: 'var(--color-text-secondary, #6B7280)',
              '&:hover': {
                backgroundColor: 'var(--color-background-secondary, #F1F2F3)'
              }
            }}
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'var(--color-border, #E5E5E5)' }} />

        {/* Filter Sections - Scrollable */}
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          <FilterSection title="Seasons" filterKey="season" options={filterOptions.seasons} />
          <FilterSection title="Regions" filterKey="region" options={filterOptions.regions} />
          <FilterSection title="Ethnicities" filterKey="ethnicity" options={filterOptions.ethnicities} />
          <FilterSection title="Genders" filterKey="gender" options={filterOptions.genders} />
          <FilterSection title="Positions" filterKey="position" options={filterOptions.positions} />
          <FilterSection title="Age groups" filterKey="ageGroup" options={filterOptions.ageGroups} />
          <FilterSection title="Employment types" filterKey="employmentType" options={filterOptions.employmentTypes} />
        </Box>

        {/* Footer Actions */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid var(--color-border, #E5E5E5)' }}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={applyFilters}
              disabled={!hasActiveFilters}
              sx={{
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: 'var(--color-primary, #3B4960)',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark, #2A3441)'
                },
                '&:disabled': {
                  backgroundColor: 'var(--color-background-secondary, #F1F2F3)',
                  color: 'var(--color-text-disabled, #9CA3AF)'
                }
              }}
            >
              Apply filters
            </Button>
            <Button
              variant="outlined"
              onClick={resetFilters}
              startIcon={<RefreshOutlined fontSize="small" />}
              sx={{
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                borderColor: 'var(--color-border, #E5E5E5)',
                color: 'var(--color-text-secondary, #6B7280)',
                '&:hover': {
                  borderColor: 'var(--color-primary, #3B4960)',
                  backgroundColor: 'var(--color-background-secondary, #F1F2F3)'
                }
              }}
            >
              Reset all filters
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  filters: PropTypes.object
}

export default FilterDrawer