# Components Directory

This directory is where you'll create your prototype-specific components, utilizing the Material UI library.

## Guidelines

- Create reusable components that can be shared across multiple screens
- Follow the component template from the `base-files` directory
- Leverage Material UI components whenever possible
- Keep components focused on a single responsibility
- Use proper naming conventions (PascalCase for component files)

## Example Structure

```
components/
  ├── Athletes/
  │   ├── AthleteCard.js
  │   ├── AthleteList.js
  │   └── AthleteDetails.js
  ├── Dashboard/
  │   ├── PerformanceChart.js
  │   ├── SummaryCard.js
  │   └── MetricDisplay.js
  ├── Layout/
  │   ├── Header.js
  │   ├── Sidebar.js
  │   └── Footer.js
  └── Common/
      ├── LoadingSpinner.js
      ├── ErrorBoundary.js
      └── EmptyState.js
```

## Importing Material UI Components

```jsx
import { 
  Button, 
  Card, 
  Typography, 
  Box 
} from '@mui/material';
```

## Using the Theme

```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(2)
    }}>
      {/* Component content */}
    </Box>
  );
}
```
