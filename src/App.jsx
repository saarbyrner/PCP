import { Routes, Route } from 'react-router-dom'
import LayoutWithMainNav from './components/LayoutWithMainNav'
import SimplePage from './pages/SimplePage'
import Athletes from './pages/Athletes'
import AnalysisPage from './pages/AnalysisPage'
import WorkforceOverviewDashboard from './pages/WorkforceOverviewDashboard'
import CareerProgressionSankeyDashboard from './pages/CareerProgressionSankeyDashboard'

import CoachManagementDashboard from './pages/CoachManagementDashboard'
import IndividualCoachProfileDashboard from './pages/IndividualCoachProfileDashboard'
import EDIDashboard from './pages/EDIDashboard'
import CompletenessQualityDashboard from './pages/CompletenessQualityDashboard'
import OrganizationLogosTest from './pages/OrganizationLogosTest'

function App() {
  return (
    <LayoutWithMainNav>
      <Routes>
        <Route path="/" element={<SimplePage pageName="Home" />} />
        <Route path="/dashboard" element={<SimplePage pageName="Dashboard" />} />
        <Route path="/medical" element={<SimplePage pageName="Medical" />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/workforce-overview" element={<WorkforceOverviewDashboard />} />
        <Route path="/analysis/career-progression-flow" element={<CareerProgressionSankeyDashboard />} />

        <Route path="/analysis/coach-management" element={<CoachManagementDashboard />} />
        <Route path="/analysis/individual-coach-profile" element={<IndividualCoachProfileDashboard />} />
        <Route path="/analysis/edi" element={<EDIDashboard />} />
        <Route path="/analysis/completeness-quality" element={<CompletenessQualityDashboard />} />
        <Route path="/athlete" element={<Athletes />} />
        <Route path="/workloads" element={<SimplePage pageName="Workload" />} />
        <Route path="/questionnaires" element={<SimplePage pageName="Forms" />} />
        <Route path="/planning" element={<SimplePage pageName="Calendar" />} />
        <Route path="/activity" element={<SimplePage pageName="Activity log" />} />
        <Route path="/settings" element={<SimplePage pageName="Admin" />} />
        <Route path="/help" element={<SimplePage pageName="Help" />} />
        <Route path="/test/logos" element={<OrganizationLogosTest />} />
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App