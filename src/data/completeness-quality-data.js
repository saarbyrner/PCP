// Completeness and Quality Data for Partner Organizations
// Updated to align with Kitman Labs software capabilities

export const completenessQualityData = {
  organizations: [
    {
      id: 'premier-league',
      name: 'Premier League',
      logo: '/assets/logos/organizations/premier-league.png',
      metrics: [
        { metric: 'ID', category: 'Workforce Overview', completeness: 95, outliers: 250, totalRecords: 5000 },
        { metric: 'Club', category: 'Workforce Overview', completeness: 98, outliers: 100, totalRecords: 5000 },
        { metric: 'Employment Start Date', category: 'Workforce Overview', completeness: 92, outliers: 400, totalRecords: 5000 },
        { metric: 'Employment End Date', category: 'Workforce Overview', completeness: 88, outliers: 600, totalRecords: 5000 },
        { metric: 'Area Name', category: 'Coach Development', completeness: 90, outliers: 500, totalRecords: 5000 },
        { metric: 'Position Type Name', category: 'Coach Development', completeness: 87, outliers: 650, totalRecords: 5000 },
        { metric: 'Department Name', category: 'Coach Development', completeness: 85, outliers: 750, totalRecords: 5000 },
        { metric: 'Age Groups', category: 'Coach Development', completeness: 82, outliers: 900, totalRecords: 5000 },
        { metric: 'Club Job Title', category: 'Coach Development', completeness: 89, outliers: 550, totalRecords: 5000 }
      ]
    },
    {
      id: 'efl',
      name: 'English Football League (EFL)',
      logo: '/assets/logos/organizations/efl.png',
      metrics: [
        { metric: 'ID', category: 'Workforce Overview', completeness: 93, outliers: 350, totalRecords: 5000 },
        { metric: 'Club', category: 'Workforce Overview', completeness: 96, outliers: 200, totalRecords: 5000 },
        { metric: 'Employment Start Date', category: 'Workforce Overview', completeness: 89, outliers: 550, totalRecords: 5000 },
        { metric: 'Employment End Date', category: 'Workforce Overview', completeness: 85, outliers: 750, totalRecords: 5000 },
        { metric: 'Area Name', category: 'Coach Development', completeness: 87, outliers: 650, totalRecords: 5000 },
        { metric: 'Position Type Name', category: 'Coach Development', completeness: 84, outliers: 800, totalRecords: 5000 },
        { metric: 'Department Name', category: 'Coach Development', completeness: 82, outliers: 900, totalRecords: 5000 },
        { metric: 'Age Groups', category: 'Coach Development', completeness: 79, outliers: 1050, totalRecords: 5000 },
        { metric: 'Club Job Title', category: 'Coach Development', completeness: 86, outliers: 700, totalRecords: 5000 }
      ]
    },
    {
      id: 'fa',
      name: 'Football Association (FA)',
      logo: '/assets/logos/organizations/fa.png',
      metrics: [
        { metric: 'Qualification Name', category: 'Workforce Overview', completeness: 94, outliers: 300, totalRecords: 5000 },
        { metric: 'Date Qualification Achieved', category: 'Workforce Overview', completeness: 91, outliers: 450, totalRecords: 5000 },
        { metric: 'Gender', category: 'Demographics', completeness: 96, outliers: 200, totalRecords: 5000 },
        { metric: 'Age', category: 'Demographics', completeness: 93, outliers: 350, totalRecords: 5000 },
        { metric: 'Country of Nationality', category: 'Demographics', completeness: 89, outliers: 550, totalRecords: 5000 },
        { metric: 'Region', category: 'Demographics', completeness: 87, outliers: 650, totalRecords: 5000 },
        { metric: 'Place of Birth', category: 'Demographics', completeness: 85, outliers: 750, totalRecords: 5000 },
        { metric: 'Qualification Group', category: 'Coach Development', completeness: 92, outliers: 400, totalRecords: 5000 },
        { metric: 'Qualification Sub Group', category: 'Coach Development', completeness: 88, outliers: 600, totalRecords: 5000 }
      ]
    },
    {
      id: 'womens-professional-game',
      name: 'Women\'s Professional Game',
      logo: '/assets/logos/organizations/womens-professional-game.png',
      metrics: [
        { metric: 'ID', category: 'Workforce Overview', completeness: 92, outliers: 400, totalRecords: 5000 },
        { metric: 'Club', category: 'Workforce Overview', completeness: 95, outliers: 250, totalRecords: 5000 },
        { metric: 'Employment Start Date', category: 'Workforce Overview', completeness: 88, outliers: 600, totalRecords: 5000 },
        { metric: 'Employment End Date', category: 'Workforce Overview', completeness: 84, outliers: 800, totalRecords: 5000 }
      ]
    },
    {
      id: 'fip',
      name: 'Football Intelligence Platform (FiP)',
      logo: '/assets/logos/kitman-labs-base.png',
      metrics: [
        { metric: 'Players Coached', category: 'Coach Development', completeness: 96, outliers: 200, totalRecords: 5000 },
        { metric: 'Sessions and Drills Coached', category: 'Coach Development', completeness: 94, outliers: 300, totalRecords: 5000 },
        { metric: 'Results', category: 'Coach Development', completeness: 91, outliers: 450, totalRecords: 5000 }
      ]
    },
    {
      id: 'lma',
      name: 'League Managers Association (LMA)',
      logo: '/assets/logos/organizations/lma.png',
      metrics: [
        { metric: 'Disability', category: 'Demographics', completeness: 78, outliers: 1100, totalRecords: 5000 },
        { metric: 'Ethnicity', category: 'Demographics', completeness: 82, outliers: 900, totalRecords: 5000 },
        { metric: 'Religion', category: 'Demographics', completeness: 75, outliers: 1250, totalRecords: 5000 },
        { metric: 'Sexual Identity', category: 'Demographics', completeness: 73, outliers: 1350, totalRecords: 5000 },
        { metric: 'LMA Programmes', category: 'Coach Development', completeness: 89, outliers: 550, totalRecords: 5000 },
        { metric: 'Other (Qualifications)', category: 'Coach Development', completeness: 86, outliers: 700, totalRecords: 5000 }
      ]
    },
    {
      id: 'lca',
      name: 'League Coaches Association (LCA)',
      logo: '/assets/logos/organizations/lca.png',
      metrics: [
        { metric: 'Disability', category: 'Demographics', completeness: 76, outliers: 1200, totalRecords: 5000 },
        { metric: 'Ethnicity', category: 'Demographics', completeness: 80, outliers: 1000, totalRecords: 5000 },
        { metric: 'Religion', category: 'Demographics', completeness: 73, outliers: 1350, totalRecords: 5000 },
        { metric: 'Sexual Identity', category: 'Demographics', completeness: 71, outliers: 1450, totalRecords: 5000 },
        { metric: 'LMA Programmes', category: 'Coach Development', completeness: 87, outliers: 650, totalRecords: 5000 },
        { metric: 'Other (Qualifications)', category: 'Coach Development', completeness: 84, outliers: 800, totalRecords: 5000 }
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
