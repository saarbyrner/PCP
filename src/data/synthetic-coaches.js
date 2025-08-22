// Synthetic coach dataset generator
export const generateCoachDataset = (numCoaches = 8450) => {
  const coaches = []
  
  // Realistic distributions based on football industry data
  const distributions = {
    gender: { male: 0.915, female: 0.085 },
    ethnicity: { 
      white: 0.848, 
      black: 0.070, 
      asian: 0.050, 
      mixed: 0.020, 
      other: 0.012 
    },
    region: {
      london: 0.145,
      'south-east': 0.132,
      'south-west': 0.098,
      'west-midlands': 0.105,
      'east-midlands': 0.122,
      'east-england': 0.089,
      'yorkshire-humber': 0.098,
      'north-west': 0.124,
      'north-east': 0.087,
      scotland: 0.076,
      wales: 0.064,
      'northern-ireland': 0.043
    },
    ageGroup: {
      '18-25': 0.12,
      '26-35': 0.28,
      '36-45': 0.35,
      '46-55': 0.20,
      '56+': 0.05
    },
    primaryCoachingRole: {
      'head-coach': 0.123,
      'assistant-coach': 0.287,
      '1st-team-coach': 0.152,
      'academy-coach': 0.318,
      'goalkeeping-coach': 0.084,
      'cross-club-coach': 0.036
    },
    level: { senior: 0.672, junior: 0.328 },
    positionType: { 'full-time': 0.450, 'part-time': 0.550 },
    division: {
      'premier-league': 0.081,
      'efl': 0.345,
      'womens-super-league': 0.042,
      'womens-championship': 0.067,
      'academy': 0.465
    },
    season: {
      '24/25': 0.18,
      '23/24': 0.17,
      '22/23': 0.16,
      '21/22': 0.15,
      '20/21': 0.14,
      '19/20': 0.12
    },
    employmentStatus: { employed: 0.918, unemployed: 0.082 },
    uefaBadges: { 
      'none': 0.35, 
      'uefa-b': 0.30, 
      'uefa-a': 0.25, 
      'uefa-pro': 0.10 
    },
    gamePartners: {
      'premier-league': 0.081,
      'efl': 0.345,
      'fa': 0.200,
      'womens-professional-game': 0.109,
      'fip': 0.150,
      'lma': 0.080,
      'lca': 0.035
    }
  }

  // Realistic correlations between demographics
  const getCorrelatedData = () => {
    const coach = {}
    
    // Generate base demographics
    coach.gender = weightedRandom(distributions.gender)
    coach.ethnicity = weightedRandom(distributions.ethnicity)
    coach.region = weightedRandom(distributions.region)
    coach.ageGroup = weightedRandom(distributions.ageGroup)
    coach.season = weightedRandom(distributions.season)
    
    // Apply realistic correlations
    const levelProbs = { ...distributions.level }
    const roleProbs = { ...distributions.primaryCoachingRole }
    const divisionProbs = { ...distributions.division }
    const positionTypeProbs = { ...distributions.positionType }
    const gamePartnerProbs = { ...distributions.gamePartners }
    
    // Older coaches more likely to be senior
    if (coach.ageGroup === '46-55' || coach.ageGroup === '56+') {
      levelProbs.senior *= 1.4
      levelProbs.junior *= 0.6
    }
    
    // Women's football correlations
    if (coach.gender === 'female') {
      divisionProbs['womens-super-league'] *= 8
      divisionProbs['womens-championship'] *= 6
      divisionProbs['premier-league'] *= 0.2
      divisionProbs['efl'] *= 0.3
      gamePartnerProbs['womens-professional-game'] *= 8
      gamePartnerProbs['premier-league'] *= 0.3
      gamePartnerProbs['efl'] *= 0.4
    }
    
    // Regional correlations
    if (coach.region === 'london' || coach.region === 'south-east') {
      divisionProbs['premier-league'] *= 2.5
      roleProbs['head-coach'] *= 1.3
      gamePartnerProbs['premier-league'] *= 2.5
    }
    
    // Ethnicity correlations - Updated to align with customer requirements
    if (coach.ethnicity !== 'white') {
      // Reduce ethnic minority representation in academy roles (target: 10%)
      roleProbs['academy-coach'] *= 0.65
      
      // Slightly reduce head coach representation but not as much (target: 15%)
      roleProbs['head-coach'] *= 0.9
      
      // Keep UEFA B license representation around 15% (current is good)
      // No adjustment needed for uefaBadges
      
      // Slight underrepresentation in senior roles
      levelProbs.senior *= 0.9
    }
    
    // Game partner correlations based on division and role
    if (divisionProbs['premier-league'] > 0.1) {
      gamePartnerProbs['premier-league'] *= 3
      gamePartnerProbs['lma'] *= 2
    }
    
    if (divisionProbs['efl'] > 0.2) {
      gamePartnerProbs['efl'] *= 2.5
      gamePartnerProbs['lma'] *= 1.5
    }
    
    if (roleProbs['head-coach'] > 0.1) {
      gamePartnerProbs['lma'] *= 2
      gamePartnerProbs['lca'] *= 1.5
    }
    
    // FA has broader reach across all levels
    gamePartnerProbs['fa'] *= 1.2
    
    // FiP membership correlates with professional experience
    if (coach.ageGroup === '26-35' || coach.ageGroup === '36-45') {
      gamePartnerProbs['fip'] *= 1.3
    }
    
    coach.level = weightedRandom(normalizeProbs(levelProbs))
    coach.primaryCoachingRole = weightedRandom(normalizeProbs(roleProbs))
    coach.division = weightedRandom(normalizeProbs(divisionProbs))
    coach.positionType = weightedRandom(normalizeProbs(positionTypeProbs))
    coach.employmentStatus = weightedRandom(distributions.employmentStatus)
    coach.uefaBadges = weightedRandom(distributions.uefaBadges)
    coach.gamePartners = weightedRandom(normalizeProbs(gamePartnerProbs))
    
    // Map age group to actual age
    const ageRanges = {
      '18-25': [18, 25],
      '26-35': [26, 35], 
      '36-45': [36, 45],
      '46-55': [46, 55],
      '56+': [56, 65]
    }
    const [minAge, maxAge] = ageRanges[coach.ageGroup]
    coach.age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge
    
    // Determine current career stage based on role and level
    const stageMapping = {
      'academy-coach': coach.level === 'senior' ? 'academy_coach' : 'development_coach',
      'assistant-coach': 'assistant_coach',
      '1st-team-coach': 'first_team_assistant', 
      'head-coach': 'head_coach',
      'goalkeeping-coach': 'assistant_coach',
      'cross-club-coach': 'other_roles'
    }
    coach.currentStage = stageMapping[coach.primaryCoachingRole] || 'other_roles'
    
    // Add years of experience
    coach.yearsInFootball = Math.max(1, Math.floor(Math.random() * (coach.age - 20)))
    coach.yearsInRole = Math.max(1, Math.floor(coach.yearsInFootball * Math.random() * 0.6))
    
    return coach
  }
  
  // Generate coaches
  for (let i = 0; i < numCoaches; i++) {
    coaches.push({
      id: `coach_${String(i + 1).padStart(5, '0')}`,
      ...getCorrelatedData()
    })
  }
  
  return coaches
}

// Helper functions
function weightedRandom(weights) {
  const entries = Object.entries(weights)
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let random = Math.random() * totalWeight
  
  for (const [key, weight] of entries) {
    if (random < weight) return key
    random -= weight
  }
  
  return entries[entries.length - 1][0] // fallback
}

function normalizeProbs(probs) {
  const total = Object.values(probs).reduce((sum, val) => sum + val, 0)
  const normalized = {}
  for (const [key, val] of Object.entries(probs)) {
    normalized[key] = val / total
  }
  return normalized
}

// Generate and export the dataset
export const SYNTHETIC_COACHES = generateCoachDataset()