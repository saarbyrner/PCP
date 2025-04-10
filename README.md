# Kitman Labs Prototyping Kit

This repository provides a foundation for Kitman Labs designers to quickly create realistic prototypes for user testing, utilizing dummy sports data and the Material UI component library.

## Getting Started

1. Clone this repository: `git clone git@github.com:kitmanlabs/prototype.git`
2. Navigate to the project directory: `cd prototype`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm start` or `yarn start` (This will run a basic React app showcasing the components and data).
5. Access the Material UI documentation: [Material UI Documentation](https://mui.com/material-ui/).
6. Explore the dummy data in the `src/data` directory.
7. Utilize the base file templates in the `base-files` directory for quick screen/component creation.

## Dummy Data

This repository includes realistic (but fictional) sports data organized in the following categories:

- **Bio Data** (`src/data/bio/`): Athlete biographical information
- **Medical Data** (`src/data/medical/`): Injury and medical records
- **Performance Data** (`src/data/performance/`): Training and match performance metrics

All data is stored in JSON format and can be easily imported into your prototype components.

## MUI Theme

A basic Material UI theme is included in `src/styles/theme.js`. This theme includes Kitman Labs brand colors and typography settings. To use the theme in your components:

```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  // Now you can access theme.palette.primary.main, etc.
}
```

## Base Files

The `base-files` directory contains templates to help you quickly create new components and screens:

- `component.js.template`: Basic functional React component template with MUI styling
- `screen.js.template`: Template for creating full screens/pages with common layout elements

Copy these templates to create new files and customize as needed for your prototype.

## Support

For any questions or issues, please contact [Your Contact Person/Team].

## License

MIT License

Copyright (c) 2025 Kitman Labs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
