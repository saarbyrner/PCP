// Asset Management System for Medinah Design Prototype
// Handles image loading, fallbacks, and placeholder generation

/**
 * Asset paths configuration
 */
export const ASSET_PATHS = {
  players: '/assets/players',
  logos: '/assets/logos', 
  badges: '/assets/badges',
  teams: '/assets/logos/teams',
  organizations: '/assets/logos/organizations'
}

/**
 * Default placeholder images
 */
export const PLACEHOLDERS = {
  logo: '/assets/logos/placeholder-logo.svg',
  player: '/assets/players/placeholder-player.jpg',
  team: '/assets/teams/placeholder-team.png',
  badge: '/assets/badges/placeholder-badge.png'
}

/**
 * Organization logo dimensions and aspect ratios
 * Used for better sizing and layout
 */
export const ORGANIZATION_DIMENSIONS = {
  'efl': { width: 600, height: 600, aspectRatio: 1 }, // Square
  'fa': { width: 600, height: 600, aspectRatio: 1 }, // Square
  'lca': { width: 840, height: 430, aspectRatio: 1.95 }, // Wide
  'lma': { width: 284, height: 111, aspectRatio: 2.56 }, // Very wide
  'fip': { width: 1200, height: 628, aspectRatio: 1.91 }, // Wide - Football Intelligence Platform
  'premier-league': { width: 225, height: 225, aspectRatio: 1 }, // Square
  'womens-professional-game': { width: 318, height: 159, aspectRatio: 2 } // Wide
}

/**
 * Get recommended dimensions for organization logo
 * @param {string} logoName - Logo filename without extension
 * @param {number} baseHeight - Base height in pixels
 * @returns {object} Recommended width and height
 */
export function getOrganizationLogoDimensions(logoName, baseHeight = 64) {
  const dimensions = ORGANIZATION_DIMENSIONS[logoName]
  if (!dimensions) {
    return { width: baseHeight * 1.5, height: baseHeight }
  }
  
  const aspectRatio = dimensions.aspectRatio
  const width = Math.round(baseHeight * aspectRatio)
  
  return { width, height: baseHeight }
}

/**
 * Get player image URL with fallback
 * @param {string|number} playerId - Player ID or slug
 * @param {string} playerName - Player name for generating initials
 * @returns {string} Image URL or data URL for initials
 */
export function getPlayerImage(playerId, playerName = '') {
  if (!playerId) {
    return generateInitialsImage(playerName)
  }
  
  // For now, always return initials since we don't have actual player images
  // In a real application, you would check if the image exists first
  return generateInitialsImage(playerName)
}

/**
 * Get team logo URL with fallback
 * @param {string} teamSlug - Team identifier slug
 * @param {string} league - League identifier (premier-league, nba, etc.)
 * @param {string} fallback - Fallback image URL
 * @returns {string} Logo URL
 */
export function getTeamLogo(teamSlug, league = 'premier-league', fallback = PLACEHOLDERS.logo) {
  if (!teamSlug) return fallback
  
  // Return PNG from the specific league folder
  return `${ASSET_PATHS.teams}/${league}/${teamSlug}.png`
}

/**
 * Get organization logo
 * @param {string} logoName - Logo filename without extension
 * @returns {string} Logo URL
 */
export function getOrganizationLogo(logoName = 'kitman-labs-base') {
  // Check if it's a special case for kitman-labs-base
  if (logoName === 'kitman-labs-base') {
    return `${ASSET_PATHS.logos}/${logoName}.png`
  }
  
  // Special case for FiP - use Kitman Labs base logo
  if (logoName === 'fip') {
    return `${ASSET_PATHS.logos}/kitman-labs-base.png`
  }
  
  // Special cases for different file formats
  const specialCases = {
    'womens-professional-game': 'jpg'
  }
  
  if (specialCases[logoName]) {
    return `${ASSET_PATHS.organizations}/${logoName}.${specialCases[logoName]}`
  }
  
  // For other organizations, use PNG as default
  return `${ASSET_PATHS.organizations}/${logoName}.png`
}

/**
 * Get badge/achievement image
 * @param {string} badgeId - Badge identifier
 * @returns {string} Badge URL
 */
export function getBadgeImage(badgeId) {
  if (!badgeId) return PLACEHOLDERS.badge
  return `${ASSET_PATHS.badges}/${badgeId}.png`
}

/**
 * Generate initials image as data URL (for missing player photos)
 * @param {string} name - Full name to generate initials from
 * @param {number} size - Image size (width/height)
 * @param {string} bgColor - Background color (hex)
 * @param {string} textColor - Text color (hex) 
 * @returns {string} Data URL containing SVG image
 */
export function generateInitialsImage(
  name = '', 
  size = 400, 
  bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#3B4960', 
  textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-white').trim() || '#ffffff'
) {
  // Extract initials from name
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'
  
  // Generate SVG
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dy="0.35em" 
        font-family="'Open Sans', sans-serif" 
        font-size="${size * 0.4}" 
        font-weight="600" 
        fill="${textColor}"
      >
        ${initials}
      </text>
    </svg>
  `
  
  // Return as data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Create image element with error handling
 * @param {string} src - Image source URL
 * @param {string} fallbackSrc - Fallback image URL
 * @param {string} alt - Alt text
 * @param {Function} onLoad - Load callback
 * @param {Function} onError - Error callback
 * @returns {HTMLImageElement} Image element
 */
export function createImageWithFallback(src, fallbackSrc, alt = '', onLoad, onError) {
  const img = new Image()
  img.alt = alt
  
  img.onload = () => {
    if (onLoad) onLoad(img)
  }
  
  img.onerror = () => {
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc
    } else if (onError) {
      onError(img)
    }
  }
  
  img.src = src
  return img
}

/**
 * Asset registry for managing available images
 * This can be populated with actual available assets
 */
export const ASSET_REGISTRY = {
  players: [
    // Example entries - update with actual available images
    'player-1-john-smith.jpg',
    'player-2-sarah-johnson.jpg',
    'player-3-mike-wilson.jpg'
  ],
  logos: [
    'organization-logo.png'
  ],
  teams: {
    'premier-league': [
      'arsenal.png',
      'chelsea.png',
      'liverpool.png',
      'manchester-united.png',
      'manchester-city.png',
      'tottenham.png',
      'everton.png',
      'leeds-united.png',
      'premier-league.png'
    ],
    'nba': [
      'lakers.png',
      'warriors.png',
      'bulls.png',
      'celtics.png',
      'nba.png'
    ]
  }
}

/**
 * Check if team asset exists in registry
 * @param {string} league - League identifier
 * @param {string} filename - Filename to check
 * @returns {boolean} Whether asset exists
 */
export function teamAssetExists(league, filename) {
  return ASSET_REGISTRY.teams[league]?.includes(filename) || false
}

/**
 * Get all available team assets for a league
 * @param {string} league - League identifier
 * @returns {Array} Array of available team logo filenames
 */
export function getAvailableTeamLogos(league) {
  return ASSET_REGISTRY.teams[league] || []
}

/**
 * Get all available leagues
 * @returns {Array} Array of available league identifiers
 */
export function getAvailableLeagues() {
  return Object.keys(ASSET_REGISTRY.teams)
}