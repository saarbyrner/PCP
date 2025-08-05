import { useMemo } from 'react'
import { SYNTHETIC_COACHES } from '../data/synthetic-coaches'

export const useCoachData = (filters = {}) => {
  return useMemo(() => {
    // Filter individual coaches based on active filters
    let filteredCoaches = SYNTHETIC_COACHES.filter(coach => {
      // Apply each filter
      for (const [filterKey, filterValues] of Object.entries(filters)) {
        if (!filterValues || !Array.isArray(filterValues) || filterValues.length === 0) {
          continue // Skip empty filters
        }
        
        // Map filter keys to coach properties
        const coachProperty = getCoachProperty(coach, filterKey)
        if (!filterValues.includes(coachProperty)) {
          return false // Coach doesn't match this filter
        }
      }
      return true // Coach matches all filters
    })

    // Generate aggregated data from filtered coaches
    const aggregatedData = aggregateCoachData(filteredCoaches)
    
    // Generate Sankey flow data
    const sankeyData = generateSankeyData(filteredCoaches)
    
    return {
      coaches: filteredCoaches,
      totalCoaches: filteredCoaches.length,
      ...aggregatedData,
      sankeyData
    }
  }, [filters])
}

// Helper function to get coach property based on filter key
function getCoachProperty(coach, filterKey) {
  const propertyMap = {
    season: coach.season,
    region: coach.region,
    ethnicity: coach.ethnicity,
    gender: coach.gender,
    primaryCoachingRole: coach.primaryCoachingRole,
    level: coach.level,
    positionType: coach.positionType,
    division: coach.division,
    ageGroup: coach.ageGroup
  }
  return propertyMap[filterKey]
}

// Aggregate individual coach data into dashboard format
function aggregateCoachData(coaches) {
  const total = coaches.length
  if (total === 0) {
    return getEmptyAggregation()
  }

  // Calculate distributions
  const genderCounts = countBy(coaches, 'gender')
  const ethnicityCounts = countBy(coaches, 'ethnicity')
  const regionCounts = countBy(coaches, 'region')
  const ageCounts = countBy(coaches, 'ageGroup')
  const roleCounts = countBy(coaches, 'primaryCoachingRole')
  const levelCounts = countBy(coaches, 'level')
  const positionTypeCounts = countBy(coaches, 'positionType')
  const divisionCounts = countBy(coaches, 'division')
  const seasonCounts = countBy(coaches, 'season')

  // Calculate average age
  const averageAge = coaches.reduce((sum, coach) => sum + coach.age, 0) / total

  // Calculate female percentage
  const femalePercentage = ((genderCounts.female || 0) / total) * 100

  // Calculate non-white percentage
  const nonWhiteCount = total - (ethnicityCounts.white || 0)
  const nonWhitePercentage = (nonWhiteCount / total) * 100

  return {
    kpis: [
      { title: "Total Coaches", value: total },
      { title: "Average Age", value: Math.round(averageAge * 10) / 10 },
      { title: "Female Coaches", value: Math.round(femalePercentage * 10) / 10 },
      { title: "Ethnicity (Non-White)", value: Math.round(nonWhitePercentage * 10) / 10 }
    ],
    genderDistribution: [
      { name: "Male", value: Math.round(((genderCounts.male || 0) / total) * 1000) / 10 },
      { name: "Female", value: Math.round(((genderCounts.female || 0) / total) * 1000) / 10 }
    ],
    ethnicityDistribution: {
      breakdown: [
        { name: "White/White British", value: Math.round(((ethnicityCounts.white || 0) / total) * 1000) / 10 },
        { name: "Black/Black British", value: Math.round(((ethnicityCounts.black || 0) / total) * 1000) / 10 },
        { name: "Asian/Asian British", value: Math.round(((ethnicityCounts.asian || 0) / total) * 1000) / 10 },
        { name: "Mixed", value: Math.round(((ethnicityCounts.mixed || 0) / total) * 1000) / 10 },
        { name: "Other", value: Math.round(((ethnicityCounts.other || 0) / total) * 1000) / 10 }
      ],
      missingData: { lca: "0%", lma: "0%" } // No missing data in synthetic dataset
    },
    regionalDistribution: Object.entries(regionCounts).map(([region, count]) => ({
      region: formatRegionName(region),
      coachCount: count,
      coachesPerMillion: Math.round((count / total) * 1000000 / 1000) // Keep for backwards compatibility
    })),
    seasonDistribution: Object.entries(seasonCounts).map(([season, count]) => ({
      season,
      coaches: count
    })),
    primaryCoachingRoleDistribution: Object.entries(roleCounts).map(([role, count]) => ({
      role: formatRoleName(role),
      value: Math.round(((count / total) * 1000)) / 10
    })),
    levelDistribution: Object.entries(levelCounts).map(([level, count]) => ({
      level: level.charAt(0).toUpperCase() + level.slice(1),
      value: Math.round(((count / total) * 1000)) / 10
    })),
    divisionDistribution: Object.entries(divisionCounts).map(([division, count]) => ({
      division: formatDivisionName(division),
      value: Math.round(((count / total) * 1000)) / 10
    })),
    positionTypeDistribution: [
      { name: "Full-Time", value: Math.round(((positionTypeCounts['full-time'] || 0) / total) * 1000) / 10 },
      { name: "Part-Time", value: Math.round(((positionTypeCounts['part-time'] || 0) / total) * 1000) / 10 }
    ]
  }
}

// Generate Sankey diagram data from filtered coaches
function generateSankeyData(coaches) {
  // Count coaches by current stage
  const stageCounts = countBy(coaches, 'currentStage')
  
  // Create nodes for each stage that has coaches
  const nodes = []
  const nodeMap = new Map()
  
  const stageNames = {
    'entry_level': 'Entry Level',
    'academy_coach': 'Academy Coach',
    'development_coach': 'Development Coach',
    'assistant_coach': 'Assistant Coach',
    'first_team_assistant': 'First Team Assistant',
    'head_coach': 'Head Coach',
    'technical_director': 'Technical Director',
    'other_roles': 'Other Roles',
    'exit': 'Exit Football'
  }
  
  const stageLevels = {
    'entry_level': 0,
    'academy_coach': 1,
    'development_coach': 1,
    'assistant_coach': 2,
    'first_team_assistant': 2,
    'other_roles': 2,
    'head_coach': 3,
    'technical_director': 3,
    'exit': 4
  }
  
  Object.entries(stageCounts).forEach(([stage, count]) => {
    if (count > 0) {
      const nodeIndex = nodes.length
      nodes.push({
        id: stage,
        name: stageNames[stage] || stage,
        level: stageLevels[stage] || 0
      })
      nodeMap.set(stage, nodeIndex)
    }
  })
  
  // Generate realistic flow links based on career progression patterns
  const links = generateCareerFlows(coaches, nodes, nodeMap)
  
  return { nodes, links }
}

// Generate career flow links with demographics
function generateCareerFlows(coaches, nodes, nodeMap) {
  const links = []
  
  // Define realistic career progression patterns
  const progressionPatterns = [
    { from: 'entry_level', to: 'academy_coach', probability: 0.6 },
    { from: 'entry_level', to: 'development_coach', probability: 0.4 },
    { from: 'academy_coach', to: 'assistant_coach', probability: 0.3 },
    { from: 'academy_coach', to: 'other_roles', probability: 0.7 },
    { from: 'development_coach', to: 'assistant_coach', probability: 0.25 },
    { from: 'development_coach', to: 'other_roles', probability: 0.75 },
    { from: 'assistant_coach', to: 'first_team_assistant', probability: 0.4 },
    { from: 'assistant_coach', to: 'head_coach', probability: 0.1 },
    { from: 'assistant_coach', to: 'other_roles', probability: 0.5 },
    { from: 'first_team_assistant', to: 'head_coach', probability: 0.2 },
    { from: 'first_team_assistant', to: 'other_roles', probability: 0.8 },
    { from: 'head_coach', to: 'technical_director', probability: 0.15 },
    { from: 'head_coach', to: 'other_roles', probability: 0.85 },
    { from: 'other_roles', to: 'exit', probability: 0.1 },
    { from: 'technical_director', to: 'exit', probability: 0.05 }
  ]
  
  progressionPatterns.forEach(pattern => {
    const fromIndex = nodeMap.get(pattern.from)
    const toIndex = nodeMap.get(pattern.to)
    
    if (fromIndex !== undefined && toIndex !== undefined) {
      // Calculate flow value based on source stage population and probability
      const sourceCoaches = coaches.filter(c => c.currentStage === pattern.from)
      const flowValue = Math.round(sourceCoaches.length * pattern.probability)
      
      if (flowValue > 0) {
        // Generate demographic breakdown for this flow
        const demographics = generateFlowDemographics(sourceCoaches.slice(0, flowValue))
        
        links.push({
          source: fromIndex,
          target: toIndex,
          value: flowValue,
          demographics
        })
      }
    }
  })
  
  return links
}

// Generate demographic breakdown for a flow
function generateFlowDemographics(flowCoaches) {
  const demographics = {}
  
  const demographicFields = ['gender', 'ethnicity', 'region', 'ageGroup', 'primaryCoachingRole', 'level', 'positionType', 'division']
  
  demographicFields.forEach(field => {
    demographics[field] = countBy(flowCoaches, field)
  })
  
  return demographics
}

// Helper function to count occurrences
function countBy(array, property) {
  return array.reduce((counts, item) => {
    const value = item[property]
    counts[value] = (counts[value] || 0) + 1
    return counts
  }, {})
}

// Helper function for empty state
function getEmptyAggregation() {
  return {
    kpis: [
      { title: "Total Coaches", value: 0 },
      { title: "Average Age", value: 0 },
      { title: "Female Coaches", value: 0 },
      { title: "Ethnicity (Non-White)", value: 0 }
    ],
    genderDistribution: [
      { name: "Male", value: 0 },
      { name: "Female", value: 0 }
    ],
    ethnicityDistribution: {
      breakdown: [
        { name: "White/White British", value: 0 },
        { name: "Black/Black British", value: 0 },
        { name: "Asian/Asian British", value: 0 },
        { name: "Mixed", value: 0 },
        { name: "Other", value: 0 }
      ],
      missingData: { lca: "0%", lma: "0%" }
    },
    regionalDistribution: [],
    seasonDistribution: [],
    primaryCoachingRoleDistribution: [],
    levelDistribution: [],
    divisionDistribution: [],
    positionTypeDistribution: [
      { name: "Full-Time", value: 0 },
      { name: "Part-Time", value: 0 }
    ]
  }
}

// Formatting helper functions
function formatRegionName(region) {
  const regionNames = {
    'london': 'London',
    'south-east': 'South East',
    'south-west': 'South West',
    'west-midlands': 'West Midlands',
    'east-midlands': 'East Midlands',
    'east-england': 'East of England',
    'yorkshire-humber': 'Yorkshire & The Humber',
    'north-west': 'North West',
    'north-east': 'North East',
    'scotland': 'Scotland',
    'wales': 'Wales',
    'northern-ireland': 'Northern Ireland'
  }
  return regionNames[region] || region
}

function formatRoleName(role) {
  const roleNames = {
    'head-coach': 'Head Coach',
    'assistant-coach': 'Assistant Coach',
    '1st-team-coach': '1st Team Coach',
    'academy-coach': 'Academy Coach',
    'goalkeeping-coach': 'Goalkeeping Coach',
    'cross-club-coach': 'Cross-Club Coach'
  }
  return roleNames[role] || role
}

function formatDivisionName(division) {
  const divisionNames = {
    'premier-league': 'Premier League',
    'efl': 'EFL',
    'womens-super-league': "Women's Super League",
    'womens-championship': "Women's Championship",
    'academy': 'Academy'
  }
  return divisionNames[division] || division
}