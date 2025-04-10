import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainLayout from './layouts/MainLayout';

// Import pages
import Dashboard from './pages/Dashboard';
import Athletes from './pages/Athletes';
import Planning from './pages/Planning';
import Medical from './pages/Medical';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import DataCollection from './pages/DataCollection';
import Calendar from './pages/Calendar';
import Messaging from './pages/Messaging';
import Admin from './pages/Admin';

// This is a simple example component that will be displayed on the home page
function WelcomeCard() {
  const theme = useTheme();
  
  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardHeader 
        title="Welcome to Kitman Labs Prototyping Kit" 
        sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: theme.palette.primary.contrastText 
        }}
      />
      <CardContent>
        <Typography variant="body1" paragraph>
          This starter kit provides a foundation for quickly creating realistic prototypes using:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Material UI components" secondary="A comprehensive React UI library" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Dummy sports data" secondary="Realistic but fictional athlete data" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Base templates" secondary="For quick component and screen creation" />
          </ListItem>
        </List>
        <Typography variant="body1" paragraph>
          Explore the code structure and start building your prototype!
        </Typography>
      </CardContent>
    </Card>
  );
}

// Example of how to use the dummy data
function DataExampleCard() {
  const theme = useTheme();
  
  // In a real component, you would import the data like this:
  // import athleteData from './data/bio/athletes.json';
  
  // For this example, we'll just use a placeholder
  const sampleAthlete = {
    id: "ATH001",
    name: "James Wilson",
    position: "Forward",
    team: "Red Lions",
    age: 27,
    height: 188,
    weight: 82
  };
  
  return (
    <Card elevation={3}>
      <CardHeader 
        title="Data Usage Example" 
        sx={{ 
          bgcolor: theme.palette.secondary.main, 
          color: theme.palette.secondary.contrastText 
        }}
      />
      <CardContent>
        <Typography variant="body1" paragraph>
          Here's how you can display athlete data in your prototype:
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: theme.palette.grey[50] }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {sampleAthlete.name}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Position: {sampleAthlete.position}</Typography>
              <Typography variant="body2">Team: {sampleAthlete.team}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Age: {sampleAthlete.age}</Typography>
              <Typography variant="body2">Height: {sampleAthlete.height} cm</Typography>
              <Typography variant="body2">Weight: {sampleAthlete.weight} kg</Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="body2" color="text.secondary">
          Import JSON data from the data directory to use in your components.
        </Typography>
      </CardContent>
    </Card>
  );
}

function GettingStartedCard() {
  return (
    <Card elevation={3}>
      <CardHeader 
        title="Getting Started" 
        sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}
      />
      <CardContent>
        <Typography variant="body1" paragraph>
          To start building your prototype:
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="1. Explore the data directory" 
              secondary="See what dummy data is available for your prototype"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="2. Check out the base templates" 
              secondary="Use them as starting points for new components"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="3. Modify this App.js file" 
              secondary="Replace with your prototype content"
            />
          </ListItem>
        </List>
        <Typography variant="body2" color="text.secondary">
          Refer to the README.md for more information.
        </Typography>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        A foundation for quickly creating realistic sports data prototypes
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <WelcomeCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataExampleCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <GettingStartedCard />
        </Grid>
      </Grid>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/analysis" element={
          <MainLayout title="Analysis | Kitman Labs Prototype">
            <Analysis />
          </MainLayout>
        } />
        <Route path="/medical" element={
          <MainLayout title="Medical | Kitman Labs Prototype">
            <Medical />
          </MainLayout>
        } />
        <Route path="/athletes" element={
          <MainLayout title="Athletes | Kitman Labs Prototype">
            <Athletes />
          </MainLayout>
        } />
        <Route path="/planning" element={
          <MainLayout title="Planning | Kitman Labs Prototype">
            <Planning />
          </MainLayout>
        } />
        <Route path="/data-collection" element={
          <MainLayout title="Data Collection | Kitman Labs Prototype">
            <DataCollection />
          </MainLayout>
        } />
        <Route path="/calendar" element={
          <MainLayout title="Calendar | Kitman Labs Prototype">
            <Calendar />
          </MainLayout>
        } />
        <Route path="/messaging" element={
          <MainLayout title="Messaging | Kitman Labs Prototype">
            <Messaging />
          </MainLayout>
        } />
        <Route path="/admin" element={
          <MainLayout title="Admin | Kitman Labs Prototype">
            <Admin />
          </MainLayout>
        } />
        <Route path="/" element={
          <MainLayout title="Kitman Labs Prototype">
            <Analysis />
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
