import { useMemo } from 'react'

export const useFilteredData = (baseData, filters) => {
  return useMemo(() => {
    // Calculate combined multiplier from all active filters
    let combinedMultiplier = 1.0
    Object.entries(filters).forEach(([filterType, filterValue]) => {
      if (filterValue !== 'all' && filterValue !== '' && filterValue && filterValue.length > 0) {
        const variations = {
          season: { '2024': 1.0, '2023': 0.95, '2022': 0.90, '2021': 0.85, '2020': 0.80 },
          region: { 'north-west': 1.15, 'east-midlands': 1.05, 'south-east-london': 0.95, 'west-midlands': 1.00, 'yorkshire-humber': 0.90, 'other': 0.85 },
          gender: { 'male': 0.91, 'female': 0.09 }, // Represents actual gender distribution
          ethnicity: { 'white': 0.85, 'black': 0.07, 'asian': 0.05, 'mixed': 0.02, 'other': 0.01 }, // Represents actual ethnic distribution
          ageGroup: { '18-25': 0.12, '26-35': 0.28, '36-45': 0.35, '46-55': 0.20, '56+': 0.05 },
          position: { 'head-coach': 0.08, 'assistant-coach': 0.25, 'academy-coach': 0.45, 'development-coach': 0.15, 'other': 0.07 },
          employmentType: { 'full-time': 0.60, 'part-time': 0.25, 'contract': 0.10, 'volunteer': 0.05 },
          employmentStatus: { 'employed': 0.918, 'unemployed': 0.082 }
        }
        
        // Handle both single values and arrays (multiselect)
        if (Array.isArray(filterValue)) {
          // For multiselect, sum the proportions of selected values
          const selectedProportions = filterValue.map(val => variations[filterType]?.[val] || 0)
          const totalProportion = selectedProportions.reduce((sum, prop) => sum + prop, 0)
          combinedMultiplier *= Math.max(0.01, totalProportion) // Don't let it go to zero
        } else {
          combinedMultiplier *= (variations[filterType]?.[filterValue] || 1.0)
        }
      }
    })

    // Apply filters to different data types
    const applyFilters = (data, dataType) => {
      if (!data) return data

      // Apply to different data structures
      if (Array.isArray(data)) {
        return data.map(item => {
          if (typeof item === 'object' && item !== null) {
            const newItem = { ...item }
            
            // Handle different value properties
            if ('value' in item && typeof item.value === 'number') {
              newItem.value = Math.max(1, Math.round(item.value * combinedMultiplier))
            }
            if ('coachesPerMillion' in item) {
              newItem.coachesPerMillion = Math.max(1, Math.round(item.coachesPerMillion * combinedMultiplier))
            }
            if ('percentage' in item) {
              newItem.percentage = Math.max(0.1, Math.round((item.percentage * combinedMultiplier) * 10) / 10)
            }
            
            // Handle qualifications trend data
            if ('uefaB' in item) {
              newItem.uefaB = Math.max(1, Math.round(item.uefaB * combinedMultiplier))
              newItem.uefaA = Math.max(1, Math.round(item.uefaA * combinedMultiplier))
              newItem.uefaPro = Math.max(1, Math.round(item.uefaPro * combinedMultiplier))
            }
            
            return newItem
          }
          return item
        })
      }
      
      // Handle object with title/value structure (KPIs)
      if (typeof data === 'object' && 'title' in data && 'value' in data) {
        return {
          ...data,
          value: typeof data.value === 'number' 
            ? Math.max(1, Math.round(data.value * combinedMultiplier))
            : data.value
        }
      }
      
      return data
    }

    // Return filtered versions of all data
    return {
      kpis: baseData.kpis?.map(kpi => applyFilters(kpi, 'kpi')),
      genderDistribution: applyFilters(baseData.genderDistribution, 'gender'),
      ethnicityDistribution: {
        ...baseData.ethnicityDistribution,
        breakdown: applyFilters(baseData.ethnicityDistribution?.breakdown, 'ethnicity')
      },
      qualificationsTrend: applyFilters(baseData.qualificationsTrend, 'qualifications'),
      regionalDistribution: applyFilters(baseData.regionalDistribution, 'regional'),
      interventionImpact: applyFilters(baseData.interventionImpact, 'intervention'),
      positionTypeDistribution: applyFilters(baseData.positionTypeDistribution, 'position'),
      employmentStatusDistribution: applyFilters(baseData.employmentStatusDistribution, 'employment'),
      // Add combined multiplier for use in calculations
      _filterMultiplier: combinedMultiplier
    }
  }, [baseData, filters])
}