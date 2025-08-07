import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Button,
  Grid
} from '@mui/material'

function DashboardFilters({ onFiltersChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    season: initialFilters.season || 'all',
    region: initialFilters.region || 'all',
    ethnicity: initialFilters.ethnicity || 'all',
    gender: initialFilters.gender || 'all',
    position: initialFilters.position || 'all',
    ageGroup: initialFilters.ageGroup || 'all',
    employmentType: initialFilters.employmentType || 'all',
    employmentStatus: initialFilters.employmentStatus || 'all'
  })

  // Filter options
  const seasons = [
    { value: 'all', label: 'All seasons' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' }
  ]

  const regions = [
    { value: 'all', label: 'All regions' },
    { value: 'north-west', label: 'North West' },
    { value: 'east-midlands', label: 'East Midlands' },
    { value: 'south-east-london', label: 'South East & London' },
    { value: 'west-midlands', label: 'West Midlands' },
    { value: 'yorkshire-humber', label: 'Yorkshire & The Humber' },
    { value: 'other', label: 'Other' }
  ]

  const ethnicities = [
    { value: 'all', label: 'All ethnicities' },
    { value: 'white', label: 'White/White British' },
    { value: 'black', label: 'Black/Black British' },
    { value: 'asian', label: 'Asian/Asian British' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'other', label: 'Other' }
  ]

  const genders = [
    { value: 'all', label: 'All genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]

  const positions = [
    { value: 'all', label: 'All positions' },
    { value: 'head-coach', label: 'Head Coach' },
    { value: 'assistant-coach', label: 'Assistant Coach' },
    { value: 'academy-coach', label: 'Academy Coach' },
    { value: 'development-coach', label: 'Development Coach' },
    { value: 'other', label: 'Other' }
  ]

  const ageGroups = [
    { value: 'all', label: 'All ages' },
    { value: '18-25', label: '18-25' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46-55', label: '46-55' },
    { value: '56+', label: '56+' }
  ]

  const employmentTypes = [
    { value: 'all', label: 'All employment types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'volunteer', label: 'Volunteer' }
  ]

  const employmentStatuses = [
    { value: 'all', label: 'All employment statuses' },
    { value: 'employed', label: 'Employed' },
    { value: 'unemployed', label: 'Unemployed' }
  ]

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      season: 'all',
      region: 'all',
      ethnicity: 'all',
      gender: 'all',
      position: 'all',
      ageGroup: 'all',
      employmentType: 'all',
      employmentStatus: 'all'
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const FilterSelect = ({ label, value, options, onChange }) => (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#666', mb: 0.5 }}>
        {label}
      </Typography>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            fontSize: '12px',
            py: 1.5,
            px: 1.5
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '12px' }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ 
      mb: 3, 
      p: 2, 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    }}>
      <Grid container spacing={2} alignItems="end">
        <Grid item xs={12} sm={6} md={2}>
          <FilterSelect
            label="Seasons"
            value={filters.season}
            options={seasons}
            onChange={(value) => handleFilterChange('season', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterSelect
            label="Regions"
            value={filters.region}
            options={regions}
            onChange={(value) => handleFilterChange('region', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterSelect
            label="Ethnicities"
            value={filters.ethnicity}
            options={ethnicities}
            onChange={(value) => handleFilterChange('ethnicity', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterSelect
            label="Genders"
            value={filters.gender}
            options={genders}
            onChange={(value) => handleFilterChange('gender', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterSelect
            label="Positions"
            value={filters.position}
            options={positions}
            onChange={(value) => handleFilterChange('position', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <FilterSelect
            label="Age Groups"
            value={filters.ageGroup}
            options={ageGroups}
            onChange={(value) => handleFilterChange('ageGroup', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <FilterSelect
            label="Employment Types"
            value={filters.employmentType}
            options={employmentTypes}
            onChange={(value) => handleFilterChange('employmentType', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <FilterSelect
            label="Employment Status"
            value={filters.employmentStatus}
            options={employmentStatuses}
            onChange={(value) => handleFilterChange('employmentStatus', value)}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={resetFilters}
          sx={{
            fontSize: '11px',
            py: 0.5,
            px: 2,
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Reset All Filters
        </Button>
      </Box>
    </Box>
  )
}

DashboardFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.object
}

export default DashboardFilters