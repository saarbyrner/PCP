import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
    name: "John Smith",
    position: "Forward",
    team: "Red Lions",
    age: 24,
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

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Kitman Labs Prototyping Kit
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          A foundation for quickly creating realistic sports data prototypes
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <WelcomeCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataExampleCard />
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
