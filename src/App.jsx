import { Routes, Route } from 'react-router-dom'
import LayoutWithMainNav from './components/LayoutWithMainNav'
import SimplePage from './pages/SimplePage'
import Athletes from './pages/Athletes'
import AnalysisPage from './pages/AnalysisPage'
import WorkforceOverviewDashboard from './pages/WorkforceOverviewDashboard'
import DevelopmentPathwaysDashboard from './pages/DevelopmentPathwaysDashboard'
import ImpactInterventionsDashboard from './pages/ImpactInterventionsDashboard'

function App() {
  return (
    <LayoutWithMainNav>
      <Routes>
        <Route path="/" element={<SimplePage pageName="Home" />} />
        <Route path="/dashboard" element={<SimplePage pageName="Dashboard" />} />
        <Route path="/medical" element={<SimplePage pageName="Medical" />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/workforce-overview" element={<WorkforceOverviewDashboard />} />
        <Route path="/analysis/development-pathways" element={<DevelopmentPathwaysDashboard />} />
        <Route path="/analysis/impact-interventions" element={<ImpactInterventionsDashboard />} />
        <Route path="/athlete" element={<Athletes />} />
        <Route path="/workloads" element={<SimplePage pageName="Workload" />} />
        <Route path="/questionnaires" element={<SimplePage pageName="Forms" />} />
        <Route path="/planning" element={<SimplePage pageName="Calendar" />} />
        <Route path="/activity" element={<SimplePage pageName="Activity log" />} />
        <Route path="/settings" element={<SimplePage pageName="Admin" />} />
        <Route path="/help" element={<SimplePage pageName="Help" />} />
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App