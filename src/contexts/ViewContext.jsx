import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

// View types
export const VIEW_TYPES = {
  LEAGUE: 'league',
  CLUB: 'club'
}

// Theme configurations for different views
const viewThemes = {
  [VIEW_TYPES.LEAGUE]: {
    name: 'Kitman Labs',
    logoSrc: '/assets/logos/kitman-labs-base.png',
    primaryColor: 'var(--color-black)',
    gradientBackground: 'linear-gradient(180deg, var(--color-black) 0%, #111111 40%, var(--color-black) 70%, #040037ff 90%, #040037ff 100%)'
  },
  [VIEW_TYPES.CLUB]: {
    name: 'Liverpool FC',
    logoSrc: '/assets/logos/teams/premier-league/liverpool.png',
    primaryColor: 'var(--color-error)',
    gradientBackground: 'linear-gradient(180deg, var(--color-error) 0%, #8B0000 40%, var(--color-error) 70%, #8B0000 90%, #8B0000 100%)'
  }
}

// Create context
const ViewContext = createContext()

// Context provider component
export function ViewProvider({ children }) {
  const [currentView, setCurrentView] = useState(VIEW_TYPES.LEAGUE)

  const toggleView = () => {
    setCurrentView(prev => 
      prev === VIEW_TYPES.LEAGUE ? VIEW_TYPES.CLUB : VIEW_TYPES.LEAGUE
    )
  }

  const switchToView = (viewType) => {
    if (Object.values(VIEW_TYPES).includes(viewType)) {
      setCurrentView(viewType)
    }
  }

  const getCurrentTheme = () => viewThemes[currentView]

  const value = {
    currentView,
    viewTypes: VIEW_TYPES,
    currentTheme: getCurrentTheme(),
    toggleView,
    switchToView,
    isLeagueView: currentView === VIEW_TYPES.LEAGUE,
    isClubView: currentView === VIEW_TYPES.CLUB
  }

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  )
}

ViewProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// Hook to use the context
export function useView() {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error('useView must be used within a ViewProvider')
  }
  return context
}

export default ViewContext