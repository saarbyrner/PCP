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
      lastUpdated: "2024-01-15",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 87,
        expiringPoints: [
          { amount: 12, date: "2025-12-31" }
        ],
        availableCourses: [
          { name: "Advanced Tactics", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Leadership in Football", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["First Team"],
      playersCoachedCount: 28,
      totalSessionsCoached: 847,
      totalDrillsCoached: 4923,
      drillBreakdown: {
        defending: 423,
        attacking: 1247,
        possession: 923,
        finishing: 745,
        "1v1": 612,
        passing: 789,
        dribbling: 184
      },
      totalGames: {
        wins: 287,
        draws: 103,
        losses: 64
      }
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
      lastUpdated: "2024-01-10",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 63,
        expiringPoints: [
          { amount: 7, date: "2025-09-01" },
          { amount: 18, date: "2026-01-01" }
        ],
        availableCourses: [
          { name: "Player Development Strategies", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Match Analysis", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["First Team", "U18s"],
      playersCoachedCount: 23,
      totalSessionsCoached: 427,
      totalDrillsCoached: 2673,
      drillBreakdown: {
        defending: 234,
        attacking: 723,
        possession: 567,
        finishing: 423,
        "1v1": 345,
        passing: 456,
        dribbling: 125
      },
      totalGames: {
        wins: 189,
        draws: 87,
        losses: 46
      }
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
      lastUpdated: "2024-01-08",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 92,
        expiringPoints: [
          { amount: 23, date: "2025-10-01" }
        ],
        availableCourses: [
          { name: "Opposition Scouting", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Set-Piece Coaching", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["First Team"],
      playersCoachedCount: 27,
      totalSessionsCoached: 318,
      totalDrillsCoached: 2147,
      drillBreakdown: {
        defending: 189,
        attacking: 567,
        possession: 445,
        finishing: 334,
        "1v1": 278,
        passing: 367,
        dribbling: 67
      },
      totalGames: {
        wins: 174,
        draws: 73,
        losses: 41
      }
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
      lastUpdated: "2024-01-12",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 74,
        expiringPoints: [
          { amount: 13, date: "2025-09-15" }
        ],
        availableCourses: [
          { name: "Modern Goalkeeping Techniques", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Psychology of Goalkeeping", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["First Team", "U23s Goalkeepers"],
      playersCoachedCount: 11,
      totalSessionsCoached: 263,
      totalDrillsCoached: 1847,
      drillBreakdown: {
        defending: 145,
        attacking: 456,
        possession: 378,
        finishing: 289,
        "1v1": 234,
        passing: 312,
        dribbling: 33
      },
      totalGames: {
        wins: 156,
        draws: 67,
        losses: 29
      }
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
      lastUpdated: "2024-01-05",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 97,
        expiringPoints: [
          { amount: 8, date: "2025-08-30" }
        ],
        availableCourses: [
          { name: "Academy Management", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Talent Identification", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["U9s", "U16s", "U23s"],
      playersCoachedCount: 167,
      totalSessionsCoached: 634,
      totalDrillsCoached: 4281,
      drillBreakdown: {
        defending: 567,
        attacking: 1234,
        possession: 987,
        finishing: 678,
        "1v1": 456,
        passing: 789,
        dribbling: 381
      },
      totalGames: {
        wins: 312,
        draws: 108,
        losses: 73
      }
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
      lastUpdated: "2024-01-18",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 54,
        expiringPoints: [
          { amount: 14, date: "2025-09-01" }
        ],
        availableCourses: [
          { name: "Women's Football Development", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Sports Nutrition", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["Women's First Team", "U21 Women"],
      playersCoachedCount: 26,
      totalSessionsCoached: 371,
      totalDrillsCoached: 2387,
      drillBreakdown: {
        defending: 234,
        attacking: 678,
        possession: 456,
        finishing: 389,
        "1v1": 345,
        passing: 567,
        dribbling: 118
      },
      totalGames: {
        wins: 127,
        draws: 43,
        losses: 24
      }
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
      lastUpdated: "2024-01-14",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 83,
        expiringPoints: [
          { amount: 17, date: "2025-10-10" }
        ],
        availableCourses: [
          { name: "Youth Player Psychology", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Talent Pathway Management", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Defensive Masterclass", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["U18s", "U21s"],
      playersCoachedCount: 43,
      totalSessionsCoached: 472,
      totalDrillsCoached: 2934,
      drillBreakdown: {
        defending: 89,
        attacking: 823,
        possession: 567,
        finishing: 445,
        "1v1": 378,
        passing: 456,
        dribbling: 176
      },
      totalGames: {
        wins: 186,
        draws: 71,
        losses: 33
      }
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
      lastUpdated: "2024-01-16",
      cpd: {
        pointsNeeded: 100,
        pointsCurrent: 42,
        expiringPoints: [
          { amount: 6, date: "2025-12-01" }
        ],
        availableCourses: [
          { name: "Advanced Biomechanics", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" },
          { name: "Data Analysis in Sport", url: "https://www.thepfa.com/players/education/course-options/lma-diploma-in-football-management" }
        ]
      },
      ageGroupsCoached: ["All Age Groups (Support)"],
      playersCoachedCount: 0,
      totalSessionsCoached: 127,
      totalDrillsCoached: 0,
      drillBreakdown: {
        defending: 0,
        attacking: 0,
        possession: 0,
        finishing: 0,
        "1v1": 0,
        passing: 0,
        dribbling: 0
      },
      totalGames: {
        wins: 0,
        draws: 0,
        losses: 0
      }
    }
  ],

  qualificationsBreakdown: [
  // Adjusted so Liverpool exceeds Premier League averages for most categories
  { qualification: "UEFA Pro License", count: 13, percentage: 18.1 },
  { qualification: "UEFA A License", count: 19, percentage: 26.4 },
  { qualification: "UEFA B License", count: 15, percentage: 20.8 },
  { qualification: "FA Youth Award", count: 11, percentage: 15.3 },
  { qualification: "Goalkeeping Specialist", count: 6, percentage: 8.3 },
  { qualification: "Sports Science", count: 8, percentage: 11.1 }
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

  // Updated to reflect team age groups (academy structure) rather than staff age ranges
  ageGroupBreakdown: [
  // Each age group is now distinct (no grouped ranges)
  { name: "U9", value: 1, percentage: 2.1 },
  { name: "U10", value: 1, percentage: 2.1 },
  { name: "U11", value: 2, percentage: 4.2 },
  { name: "U12", value: 2, percentage: 4.2 },
  { name: "U13", value: 2, percentage: 4.2 },
  { name: "U14", value: 2, percentage: 4.2 },
  { name: "U15", value: 3, percentage: 6.3 },
  { name: "U16", value: 3, percentage: 6.3 },
  { name: "U17", value: 3, percentage: 6.3 },
  { name: "U18", value: 3, percentage: 6.3 },
  { name: "U19", value: 4, percentage: 8.3 },
  { name: "U21", value: 10, percentage: 20.8 },
  { name: "First Team", value: 12, percentage: 25.0 }
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