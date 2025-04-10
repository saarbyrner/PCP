# Data Directory

This directory contains realistic (but entirely fictional) dummy data for use in your prototypes. The data is organized into three main categories:

## Structure

- **Bio Data** (`/bio`): Athlete biographical and demographic information
- **Medical Data** (`/medical`): Injury records and medical information
- **Performance Data** (`/performance`): Training and match performance metrics

## Using the Data

You can import the JSON data directly into your components:

```jsx
// Import the data
import athletes from '../data/bio/athletes.json';
import injuries from '../data/medical/injuries.json';
import performance from '../data/performance/training.json';

// Use the data in your component
function AthleteList() {
  return (
    <div>
      {athletes.map(athlete => (
        <div key={athlete.id}>
          <h3>{athlete.name}</h3>
          <p>Position: {athlete.position}</p>
          {/* ... */}
        </div>
      ))}
    </div>
  );
}
```

## Data Schema

### Bio Data

- `athletes.json`: Basic athlete information (name, position, team, etc.)
- `teams.json`: Team information (name, league, coach, etc.)

### Medical Data

- `injuries.json`: Injury records (type, severity, duration, etc.)
- `treatments.json`: Treatment information (type, protocol, duration, etc.)

### Performance Data

- `training.json`: Training session metrics (duration, intensity, etc.)
- `matches.json`: Match performance data (minutes played, stats, etc.)
- `fitness.json`: Fitness test results (speed, strength, endurance, etc.)

## Extending the Data

Feel free to modify or extend the data to suit your prototype needs. Just make sure to maintain the JSON structure for compatibility with existing components.
