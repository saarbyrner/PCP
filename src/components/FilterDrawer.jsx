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

function FilterDrawer({ open, onClose, onFiltersChange, filters = {}, filterConfig = null }) {
  const [localFilters, setLocalFilters] = useState(filters)

  // Filter options
  const filterOptions = {
    seasons: [
      { value: '24/25', label: '24/25' },
      { value: '23/24', label: '23/24' },
      { value: '22/23', label: '22/23' },
      { value: '21/22', label: '21/22' },
      { value: '20/21', label: '20/21' },
      { value: '19/20', label: '19/20' }
    ],
    gamePartners: [
      { value: 'premier-league', label: 'Premier League' },
      { value: 'efl', label: 'English Football League (EFL)' },
      { value: 'fa', label: 'Football Association (FA)' },
      { value: 'womens-professional-game', label: "Women's Professional Game" },
      { value: 'pfa', label: 'Professional Footballers\' Association (PFA)' },
      { value: 'lma', label: 'League Managers Association (LMA)' },
      { value: 'lca', label: 'League Coaches Association (LCA)' }
    ],
    regions: [
      { value: 'london', label: 'London' },
      { value: 'south-east', label: 'South East' },
      { value: 'south-west', label: 'South West' },
      { value: 'west-midlands', label: 'West Midlands' },
      { value: 'east-midlands', label: 'East Midlands' },
      { value: 'east-england', label: 'East of England' },
      { value: 'yorkshire-humber', label: 'Yorkshire & The Humber' },
      { value: 'north-west', label: 'North West' },
      { value: 'north-east', label: 'North East' },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' },
      { value: 'northern-ireland', label: 'Northern Ireland' }
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
    primaryCoachingRoles: [
      { value: 'head-coach', label: 'Head Coach' },
      { value: 'assistant-coach', label: 'Assistant Coach' },
      { value: '1st-team-coach', label: '1st Team Coach' },
      { value: 'academy-coach', label: 'Academy Coach' },
      { value: 'goalkeeping-coach', label: 'Goalkeeping Coach' },
      { value: 'cross-club-coach', label: 'Cross-Club Coach' }
    ],
    levels: [
      { value: 'senior', label: 'Senior' },
      { value: 'junior', label: 'Junior' }
    ],
    positionTypes: [
      { value: 'full-time', label: 'Full-Time' },
      { value: 'part-time', label: 'Part-Time' }
    ],
    divisions: [
      { value: 'premier-league', label: 'Premier League' },
      { value: 'efl', label: 'EFL' },
      { value: 'womens-super-league', label: "Women's Super League" },
      { value: 'womens-championship', label: "Women's Championship" },
      { value: 'academy', label: 'Academy' }
    ],
    ageGroups: [
      { value: '18-25', label: '18-25' },
      { value: '26-35', label: '26-35' },
      { value: '36-45', label: '36-45' },
      { value: '46-55', label: '46-55' },
      { value: '56+', label: '56+' }
    ],
    employmentStatuses: [
      { value: 'employed', label: 'Employed' },
      { value: 'unemployed', label: 'Unemployed' }
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
    let resetFilters
    if (filterConfig) {
      // Custom filter configuration
      resetFilters = { search: '' }
      filterConfig.sections.forEach(section => {
        resetFilters[section.filterKey] = []
      })
    } else {
      // Default league filter configuration
      resetFilters = {
        gamePartners: [],
        region: [],
        ethnicity: [],
        gender: [],
        primaryCoachingRole: [],
        level: [],
        positionType: [],
        division: [],
        ageGroup: [],
        employmentStatus: []
      }
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
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
                  borderColor: 'var(--color-border-primary)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primary)',
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
              variant="filled"
              sx={{
                fontSize: '11px',
                height: '24px',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark)'
                }
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

  const hasActiveFilters = () => {
    if (filterConfig) {
      // Custom filter configuration
      const hasSearch = localFilters.search && localFilters.search.trim() !== ''
      const hasArrayFilters = filterConfig.sections.some(section => 
        Array.isArray(localFilters[section.filterKey]) && localFilters[section.filterKey].length > 0
      )
      return hasSearch || hasArrayFilters
    } else {
      // Default league filter configuration
      return Object.values(localFilters).some(value => Array.isArray(value) && value.length > 0)
    }
  }

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
          {filterConfig ? (
            /* Custom filter configuration */
            <>
              {filterConfig.search && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    color: 'var(--color-text-secondary)', 
                    mb: 0.5,
                    display: 'block'
                  }}>
                    Search Coach Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type coach name..."
                    value={localFilters.search || ''}
                    onChange={(e) => setLocalFilters({...localFilters, search: e.target.value})}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '12px',
                        '& fieldset': {
                          borderColor: 'var(--color-border-primary)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        }
                      }
                    }}
                  />
                </Box>
              )}
              {filterConfig.sections.map((section) => (
                <FilterSection 
                  key={section.filterKey}
                  title={section.title} 
                  filterKey={section.filterKey} 
                  options={section.options} 
                />
              ))}
            </>
          ) : (
            /* Default league filter configuration */
            <>
              <FilterSection title="Game Partners" filterKey="gamePartners" options={filterOptions.gamePartners} />
              <FilterSection title="Regions" filterKey="region" options={filterOptions.regions} />
              <FilterSection title="Ethnicities" filterKey="ethnicity" options={filterOptions.ethnicities} />
              <FilterSection title="Genders" filterKey="gender" options={filterOptions.genders} />
              <FilterSection title="Primary Coaching Roles" filterKey="primaryCoachingRole" options={filterOptions.primaryCoachingRoles} />
              <FilterSection title="Level" filterKey="level" options={filterOptions.levels} />
              <FilterSection title="Position Type" filterKey="positionType" options={filterOptions.positionTypes} />
              <FilterSection title="Division" filterKey="division" options={filterOptions.divisions} />
              <FilterSection title="Age Groups" filterKey="ageGroup" options={filterOptions.ageGroups} />
              <FilterSection title="Employment Status" filterKey="employmentStatus" options={filterOptions.employmentStatuses} />
            </>
          )}
        </Box>

        {/* Footer Actions */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid var(--color-border, #E5E5E5)' }}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={applyFilters}
              disabled={!hasActiveFilters()}
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
              variant="contained"
              size="small"
              onClick={resetFilters}
              startIcon={<RefreshOutlined fontSize="small" />}
              sx={{
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: 'var(--color-background-primary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                '&:hover': {
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)'
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
  filters: PropTypes.object,
  filterConfig: PropTypes.shape({
    search: PropTypes.bool,
    sections: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      filterKey: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })).isRequired
    }))
  })
}

export default FilterDrawer