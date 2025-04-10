# Layouts Directory

This directory is for creating reusable layout components that provide consistent page structures across your prototype.

## Purpose

Layout components help maintain consistency across different screens in your prototype. They typically include common elements like:

- Headers
- Navigation menus
- Sidebars
- Footers
- Content containers with consistent padding/margins

## Example Layouts

You might create layouts such as:

- `DashboardLayout` - For data-heavy screens with sidebar navigation
- `ProfileLayout` - For athlete profile pages with header tabs
- `ReportLayout` - For printable or exportable report views
- `FullScreenLayout` - For immersive visualizations or presentations

## Example Layout Component

```jsx
// DashboardLayout.js
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Sidebar width
const DRAWER_WIDTH = 240;

function DashboardLayout({ children, title = 'Dashboard' }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Kitman Labs - {title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Spacer to push content below app bar */}
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <List>
            {/* Navigation items would go here */}
          </List>
          <Divider sx={{ my: 2 }} />
          {/* Additional navigation sections */}
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer to push content below app bar */}
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
```

## Usage in Screens

```jsx
import DashboardLayout from '../layouts/DashboardLayout';

function AthleteOverviewScreen() {
  return (
    <DashboardLayout title="Athlete Overview">
      {/* Your screen content here */}
    </DashboardLayout>
  );
}
```
