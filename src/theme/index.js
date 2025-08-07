import { createTheme } from '@mui/material/styles'

// Create MUI theme with Open Sans font family
export const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans', Arial, sans-serif",
    // Override all typography variants to use Open Sans
    h1: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    h2: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    h3: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    h4: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    h5: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    h6: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    subtitle1: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    subtitle2: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    body1: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    body2: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    button: {
      fontFamily: "'Open Sans', Arial, sans-serif",
      textTransform: 'none', // Prevent uppercase transformation
    },
    caption: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
    overline: {
      fontFamily: "'Open Sans', Arial, sans-serif",
    },
  },
  components: {
    // Override specific components to ensure font consistency
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', Arial, sans-serif",
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: "'Open Sans', Arial, sans-serif",
          },
          '& .MuiInputLabel-root': {
            fontFamily: "'Open Sans', Arial, sans-serif",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', Arial, sans-serif",
          textTransform: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          fontFamily: "'Open Sans', Arial, sans-serif",
        },
      },
    },
  },
})