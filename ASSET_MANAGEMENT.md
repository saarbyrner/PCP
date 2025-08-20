# Asset Management Guide

## 📁 Asset Structure

**Team logos included from https://github.com/klunn91/team-logos**

```
public/assets/
├── logos/
│   ├── organizations/     # EFL, FA, LCA, LMA, PFA, Premier League, Women's Professional Game
│   ├── teams/
│   │   ├── premier-league/    # Arsenal, Chelsea, Liverpool, etc.
│   │   └── nba/              # Lakers, Warriors, Bulls, etc.
│   └── Kitman Labs base.png  # Organization logo
└── players/                   # Player photos (auto-generates initials)
```

## 🏆 Available Team Logos

**Premier League:** Arsenal, Chelsea, Liverpool, Manchester United, Manchester City, Tottenham, Everton, Leeds United

**NBA:** Lakers, Warriors, Bulls, Celtics

## 🏢 Available Organization Logos

**Football Organizations:**
- EFL (English Football League) - PNG - 600x600 (Square)
- FA (Football Association) - PNG - 600x600 (Square)  
- LCA (League Coaches Association) - PNG - 840x430 (Wide)
- LMA (League Managers Association) - PNG - 284x111 (Very Wide)
- PFA (Professional Footballers' Association) - JPEG - 1200x628 (Wide)
- Premier League - PNG - 225x225 (Square)
- Women's Professional Game - JPEG - 318x159 (Wide)

**Auto-sizing:** The system automatically calculates appropriate dimensions based on each logo's aspect ratio.

## 💻 Component Usage

```jsx
import { PlayerAvatar, LogoImage } from './components'
import { getOrganizationLogoDimensions } from '../utils/assetManager'

// Player avatar (auto-generates initials if no photo)
<PlayerAvatar playerId="123" playerName="John Smith" size="medium" />

// Team logos
<LogoImage type="team" logoId="arsenal" league="premier-league" height={40} />
<LogoImage type="team" logoId="lakers" league="nba" height={40} />

// Organization logos with auto-sizing
const logoDimensions = getOrganizationLogoDimensions('efl', 64)
<LogoImage 
  type="organization" 
  logoId="efl" 
  height={logoDimensions.height}
  width={logoDimensions.width}
/>

// Or use fixed dimensions
<LogoImage type="organization" logoId="fa" height={40} width={60} />
```

**Test Page:** Organization logos test is available at `/test/logos` for development and testing purposes.

## ✅ Auto Features

- **Player avatars:** Auto-generates initials if photo missing
- **Team logos:** Organized by league (premier-league, nba)
- **Organization logos:** Handles different file formats (PNG, JPEG, WebP)
- **Fallbacks:** Graceful handling of missing assets
- **Loading states:** Smooth transitions
- **Aspect ratio preservation:** Maintains logo proportions

## 🔧 Recent Fixes

**Image Format Issues Resolved:**
- ✅ PFA logo: Fixed JPEG with wrong PNG extension
- ✅ Women's Professional Game: Updated to JPEG with correct extension and new dimensions (318x159)
- ✅ All images now have correct file extensions
- ✅ Component handles different aspect ratios properly
- ✅ Improved container sizing and overflow handling

**Auto-sizing Improvements:**
- ✅ Added automatic dimension calculation based on aspect ratios
- ✅ Wide logos (LCA, PFA, LMA) now display at appropriate sizes
- ✅ Square logos maintain proper proportions
- ✅ Dashboard uses optimal dimensions for each organization
- ✅ Test page shows all logos with correct proportions

**Asset Registry** (`src/utils/assetManager.js`):
```jsx
teams: {
  'premier-league': ['arsenal.png', 'chelsea.png', 'liverpool.png', ...],
  'nba': ['lakers.png', 'warriors.png', 'bulls.png', ...]
}
```

## 📝 Asset Manager Functions

```jsx
import { getTeamLogo, getOrganizationLogo, getAvailableTeamLogos, getAvailableLeagues } from '../utils/assetManager'

// Get team logo path
const logoPath = getTeamLogo('arsenal', 'premier-league')
// Returns: '/assets/logos/teams/premier-league/arsenal.png'

// Get organization logo path
const orgLogoPath = getOrganizationLogo('efl')
// Returns: '/assets/logos/organizations/efl.png'

// Get all available teams for a league
const premierLeagueTeams = getAvailableTeamLogos('premier-league')
// Returns: ['arsenal.png', 'chelsea.png', ...]

// Get all available leagues
const leagues = getAvailableLeagues()
// Returns: ['premier-league', 'nba']
```

## 📁 Mock Data Integration

**Team data** (`src/data/teams.json`) includes logo references:
```json
{
  "id": "arsenal",
  "name": "Arsenal FC",
  "logo": "arsenal",
  "league": "premier-league"
}
```

**Squad data** (`src/data/squads_teams.json`) includes team logos:
```json
{
  "name": "First Team",
  "logo": "arsenal",
  "league": "premier-league",
  "next_match": {
    "opponent": "Liverpool FC",
    "opponent_logo": "liverpool"
  }
}
```

## 🎯 Adding New Assets

1. **Add team logo:** Place PNG in `public/assets/logos/teams/{league}/`
2. **Update registry:** Add filename to `