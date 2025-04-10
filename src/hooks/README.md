# Hooks Directory

This directory is for custom React hooks that can be reused across your prototype components.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They allow you to use state and other React features without writing a class.

## Common Custom Hooks

Here are some examples of custom hooks you might create:

- `useAthleteData` - For fetching and managing athlete data
- `usePerformanceMetrics` - For processing and displaying performance metrics
- `useFilteredData` - For filtering large datasets based on criteria
- `useLocalStorage` - For persisting data between sessions

## Example Custom Hook

```jsx
// useAthleteData.js
import { useState, useEffect } from 'react';
import athletesData from '../data/bio/athletes.json';

export function useAthleteData(athleteId = null) {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Simulate API fetch delay
      const timer = setTimeout(() => {
        setAthletes(athletesData);
        
        if (athleteId) {
          const found = athletesData.find(athlete => athlete.id === athleteId);
          setSelectedAthlete(found || null);
        }
        
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError('Error loading athlete data');
      setLoading(false);
    }
  }, [athleteId]);

  return { athletes, selectedAthlete, loading, error };
}
```

## Usage in Components

```jsx
import { useAthleteData } from '../hooks/useAthleteData';

function AthleteProfile({ athleteId }) {
  const { selectedAthlete, loading, error } = useAthleteData(athleteId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!selectedAthlete) return <div>Athlete not found</div>;
  
  return (
    <div>
      <h2>{selectedAthlete.name}</h2>
      <p>Position: {selectedAthlete.position}</p>
      {/* More athlete details */}
    </div>
  );
}
```
