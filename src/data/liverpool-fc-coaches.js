// Liverpool FC Coach Data for Club View
export const liverpoolFCData = {
  club: {
    name: "Liverpool FC",
    logo: "/assets/logos/teams/premier-league/liverpool.png",
    established: 1892,
    colors: {
      primary: "#C8102E",
      secondary: "#F6EB61"
    }
  },
  
  kpis: [
    { title: "Total Coaches", value: 47, trend: "+3", trendDirection: "up" },
    { title: "Average Age", value: 38.2, trend: "-1.2", trendDirection: "down" },
    { title: "Female Coaches", value: 6, trend: "+2", trendDirection: "up" },
    { title: "Compliance Rate", value: "94%", trend: "+2%", trendDirection: "up" }
  ],

  coaches: [
    {
      id: 1,
      name: "Jürgen Klopp",
      role: "First Team Manager",
      department: "First Team",
      age: 56,
      gender: "Male",
      nationality: "German",
      employment: "employed",
      joinDate: "2015-10-08",
      qualifications: ["UEFA Pro License", "DFB Elite Youth License"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-12-31" },
        firstAid: { status: "compliant", expiry: "2024-08-15" },
        coaching: { status: "compliant", expiry: "2025-06-30" }
      },
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      name: "Pepijn Lijnders",
      role: "Assistant Manager",
      department: "First Team",
      age: 41,
      gender: "Male", 
      nationality: "Dutch",
      employment: "employed",
      joinDate: "2018-06-01",
      qualifications: ["UEFA Pro License", "KNVB Coaching License"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-11-20" },
        firstAid: { status: "compliant", expiry: "2024-09-10" },
        coaching: { status: "compliant", expiry: "2025-05-15" }
      },
      lastUpdated: "2024-01-10"
    },
    {
      id: 3,
      name: "Peter Krawietz",
      role: "Assistant Manager",
      department: "First Team",
      age: 52,
      gender: "Male",
      nationality: "German",
      employment: "employed", 
      joinDate: "2015-10-08",
      qualifications: ["UEFA A License", "DFB Coaching License"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-10-30" },
        firstAid: { status: "expiring", expiry: "2024-02-28" },
        coaching: { status: "compliant", expiry: "2025-03-20" }
      },
      lastUpdated: "2024-01-08"
    },
    {
      id: 4,
      name: "John Achterberg",
      role: "Goalkeeping Coach",
      department: "First Team",
      age: 50,
      gender: "Male",
      nationality: "Dutch",
      employment: "employed",
      joinDate: "2009-07-01", 
      qualifications: ["UEFA Goalkeeping License", "KNVB GK Diploma"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-09-15" },
        firstAid: { status: "compliant", expiry: "2024-07-22" },
        coaching: { status: "compliant", expiry: "2025-01-10" }
      },
      lastUpdated: "2024-01-12"
    },
    {
      id: 5,
      name: "Alex Inglethorpe",
      role: "Academy Director",
      department: "Academy",
      age: 51,
      gender: "Male",
      nationality: "English",
      employment: "employed",
      joinDate: "2012-09-01",
      qualifications: ["UEFA Pro License", "FA Youth Award"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-08-30" },
        firstAid: { status: "compliant", expiry: "2024-06-15" },
        coaching: { status: "compliant", expiry: "2025-04-10" }
      },
      lastUpdated: "2024-01-05"
    },
    {
      id: 6,
      name: "Sarah Thompson",
      role: "Women's First Team Coach", 
      department: "Women's Team",
      age: 34,
      gender: "Female",
      nationality: "English",
      employment: "employed",
      joinDate: "2021-03-15",
      qualifications: ["UEFA A License", "FA Women's Coaching"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-12-01" },
        firstAid: { status: "non-compliant", expiry: "2024-01-20" },
        coaching: { status: "compliant", expiry: "2025-02-28" }
      },
      lastUpdated: "2024-01-18"
    },
    {
      id: 7,
      name: "Marc Bridge-Wilkinson",
      role: "U21 Head Coach",
      department: "Academy",
      age: 43,
      gender: "Male",
      nationality: "English",
      employment: "employed", 
      joinDate: "2019-08-01",
      qualifications: ["UEFA A License", "FA Youth Certificate"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-07-31" },
        firstAid: { status: "compliant", expiry: "2024-05-20" },
        coaching: { status: "compliant", expiry: "2025-01-15" }
      },
      lastUpdated: "2024-01-14"
    },
    {
      id: 8,
      name: "Emma Clarke", 
      role: "Sports Scientist",
      department: "Performance",
      age: 29,
      gender: "Female",
      nationality: "English",
      employment: "employed",
      joinDate: "2022-01-10",
      qualifications: ["MSc Sports Science", "BASES Accreditation"],
      compliance: {
        safeguarding: { status: "compliant", expiry: "2024-11-10" },
        firstAid: { status: "compliant", expiry: "2024-08-30" },
        coaching: { status: "not-required", expiry: null }
      },
      lastUpdated: "2024-01-16"
    }
  ],

  qualificationsBreakdown: [
    { qualification: "UEFA Pro License", count: 12, percentage: 25.5 },
    { qualification: "UEFA A License", count: 18, percentage: 38.3 },
    { qualification: "UEFA B License", count: 11, percentage: 23.4 },
    { qualification: "FA Youth Award", count: 8, percentage: 17.0 },
    { qualification: "Goalkeeping Specialist", count: 4, percentage: 8.5 },
    { qualification: "Sports Science", count: 6, percentage: 12.8 }
  ],

  complianceOverview: {
    safeguarding: { compliant: 44, nonCompliant: 0, expiring: 3 },
    firstAid: { compliant: 41, nonCompliant: 2, expiring: 4 },
    coaching: { compliant: 39, nonCompliant: 0, expiring: 0, notRequired: 8 }
  },

  departmentBreakdown: [
    { name: "First Team", value: 12, percentage: 25.5 },
    { name: "Academy", value: 18, percentage: 38.3 },
    { name: "Women's Team", value: 8, percentage: 17.0 },
    { name: "Performance", value: 6, percentage: 12.8 },
    { name: "Medical", value: 3, percentage: 6.4 }
  ],

  recentUpdates: [
    {
      type: "new_coach",
      message: "Emma Clarke joined as Sports Scientist",
      date: "2024-01-10",
      department: "Performance"
    },
    {
      type: "compliance_expiry", 
      message: "Peter Krawietz - First Aid certification expiring soon",
      date: "2024-02-28",
      department: "First Team"
    },
    {
      type: "qualification_update",
      message: "Sarah Thompson completed UEFA A License",
      date: "2024-01-15", 
      department: "Women's Team"
    }
  ]
}