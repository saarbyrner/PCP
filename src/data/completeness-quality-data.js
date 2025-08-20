// Completeness and Quality Data for Partner Organizations
// Based on GitHub Issue #15 requirements

export const completenessQualityData = {
  organizations: [
    {
      id: 'premier-league',
      name: 'Premier League',
      logo: '/assets/logos/organizations/premier-league.png',
      metrics: [
        { metric: 'ID', completeness: 98, outliers: 50, totalRecords: 10000 },
        { metric: 'Club', completeness: 99, outliers: 20, totalRecords: 10000 },
        { metric: 'Employment start date', completeness: 95, outliers: 150, totalRecords: 10000 },
        { metric: 'Employment end date', completeness: 87, outliers: 200, totalRecords: 10000 },
        { metric: 'Area_name', completeness: 92, outliers: 40, totalRecords: 10000 },
        { metric: 'Position_type_name', completeness: 96, outliers: 35, totalRecords: 10000 },
        { metric: 'Department_name', completeness: 89, outliers: 45, totalRecords: 10000 },
        { metric: 'Age_groups', completeness: 97, outliers: 30, totalRecords: 10000 },
        { metric: 'Club_job_title', completeness: 91, outliers: 40, totalRecords: 10000 }
      ]
    },
    {
      id: 'efl',
      name: 'English Football League (EFL)',
      logo: '/assets/logos/organizations/efl.png',
      metrics: [
        { metric: 'ID', completeness: 96, outliers: 50, totalRecords: 10000 },
        { metric: 'Club', completeness: 98, outliers: 20, totalRecords: 10000 },
        { metric: 'Employment start date', completeness: 93, outliers: 150, totalRecords: 10000 },
        { metric: 'Employment end date', completeness: 85, outliers: 200, totalRecords: 10000 },
        { metric: 'Area_name', completeness: 90, outliers: 40, totalRecords: 10000 },
        { metric: 'Position_type_name', completeness: 94, outliers: 35, totalRecords: 10000 },
        { metric: 'Department_name', completeness: 87, outliers: 45, totalRecords: 10000 },
        { metric: 'Age_groups', completeness: 95, outliers: 30, totalRecords: 10000 },
        { metric: 'Club_job_title', completeness: 89, outliers: 40, totalRecords: 10000 }
      ]
    },
    {
      id: 'fa',
      name: 'Football Association (FA)',
      logo: '/assets/logos/organizations/fa.png',
      metrics: [
        { metric: 'Qualification Name', completeness: 97, outliers: 75, totalRecords: 10000 },
        { metric: 'Date Qualification Achieved', completeness: 96, outliers: 80, totalRecords: 10000 },
        { metric: 'Gender', completeness: 99, outliers: 10, totalRecords: 10000 },
        { metric: 'Age', completeness: 98, outliers: 30, totalRecords: 10000 },
        { metric: 'Country of Nationality', completeness: 95, outliers: 60, totalRecords: 10000 },
        { metric: 'Region', completeness: 94, outliers: 70, totalRecords: 10000 },
        { metric: 'Place of Birth', completeness: 93, outliers: 80, totalRecords: 10000 },
        { metric: 'Qualification Group', completeness: 97, outliers: 50, totalRecords: 10000 },
        { metric: 'Qualification Sub Group', completeness: 96, outliers: 55, totalRecords: 10000 }
      ]
    },
    {
      id: 'womens-professional-game',
      name: 'Women\'s Professional Game',
      logo: '/assets/logos/organizations/womens-professional-game.png',
      metrics: [
        { metric: 'ID', completeness: 95, outliers: 50, totalRecords: 10000 },
        { metric: 'Club', completeness: 97, outliers: 20, totalRecords: 10000 },
        { metric: 'Employment start date', completeness: 91, outliers: 150, totalRecords: 10000 },
        { metric: 'Employment end date', completeness: 83, outliers: 200, totalRecords: 10000 },
        { metric: 'Area_name', completeness: 88, outliers: 40, totalRecords: 10000 },
        { metric: 'Position_type_name', completeness: 92, outliers: 35, totalRecords: 10000 },
        { metric: 'Department_name', completeness: 85, outliers: 45, totalRecords: 10000 },
        { metric: 'Age_groups', completeness: 93, outliers: 30, totalRecords: 10000 },
        { metric: 'Club_job_title', completeness: 87, outliers: 40, totalRecords: 10000 }
      ]
    },
    {
      id: 'pfa',
      name: 'Professional Footballers\' Association (PFA)',
      logo: '/assets/logos/organizations/pfa.png',
      metrics: [
        { metric: 'Players coached', completeness: 70, outliers: 250, totalRecords: 10000 },
        { metric: 'Sessions and drills coached', completeness: 68, outliers: 280, totalRecords: 10000 },
        { metric: 'Results', completeness: 72, outliers: 230, totalRecords: 10000 }
      ]
    },
    {
      id: 'lma',
      name: 'League Managers Association (LMA)',
      logo: '/assets/logos/organizations/lma.png',
      metrics: [
        { metric: 'Disability', completeness: 85, outliers: 120, totalRecords: 10000 },
        { metric: 'Ethnicity', completeness: 82, outliers: 150, totalRecords: 10000 },
        { metric: 'Religion', completeness: 75, outliers: 250, totalRecords: 10000 },
        { metric: 'Sexual Identity', completeness: 70, outliers: 300, totalRecords: 10000 },
        { metric: 'LMA Programmes', completeness: 88, outliers: 90, totalRecords: 10000 },
        { metric: 'Other (qualifications)', completeness: 80, outliers: 180, totalRecords: 10000 }
      ]
    },
    {
      id: 'lca',
      name: 'League Coaches Association (LCA)',
      logo: '/assets/logos/organizations/lca.png',
      metrics: [
        { metric: 'Disability', completeness: 78, outliers: 120, totalRecords: 10000 },
        { metric: 'Ethnicity', completeness: 81, outliers: 150, totalRecords: 10000 },
        { metric: 'Religion', completeness: 72, outliers: 250, totalRecords: 10000 },
        { metric: 'Sexual Identity', completeness: 65, outliers: 300, totalRecords: 10000 },
        { metric: 'LMA Programmes', completeness: 85, outliers: 90, totalRecords: 10000 },
        { metric: 'Other (qualifications)', completeness: 77, outliers: 180, totalRecords: 10000 }
      ]
    }
  ]
}

// Helper function to get RAG status based on completeness percentage
export const getRAGStatus = (completeness) => {
  if (completeness >= 90) return 'green'
  if (completeness >= 75) return 'amber'
  return 'red'
}

// Helper function to get RAG color
export const getRAGColor = (status) => {
  switch (status) {
    case 'green': return 'var(--color-success)'
    case 'amber': return 'var(--color-warning)'
    case 'red': return 'var(--color-error)'
    default: return 'var(--color-text-muted)'
  }
}

// Helper function to get RAG label
export const getRAGLabel = (status) => {
  switch (status) {
    case 'green': return 'Good'
    case 'amber': return 'Needs Attention'
    case 'red': return 'Critical'
    default: return 'Unknown'
  }
}
