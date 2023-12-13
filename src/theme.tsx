import createTheme from '@mui/material/styles/createTheme';
import {lighten} from '@mui/material';
import {PaletteMode} from '@mui/material';

const primaryColor = '#333333';

const theme = (mode?: PaletteMode) => createTheme({
  palette: {
    mode: mode ? mode : 'light',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: '#E9B30D',
    },
    text: {
      primary: '#000000',
      secondary: '#746F81',
    }
  },
  typography: {
    body1: {
      fontSize: '16px'
    },
    body2: {
      fontSize: '14px'
    },
    caption: {
      fontSize: '12px'
    },
    button: {
      fontSize: '14px'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        /* Firefox Scrollbar */
        'body': {
          scrollbarColor: `${lighten(primaryColor, 0.5)} transparent`, /* scroll thumb and track */
          scrollbarWidth: '2px'
        },
        /* Chrome Scrollbar */
        '*::-webkit-scrollbar': {
          width: '0.2em',
          height: '0.15em'
        },
        '*::-webkit-scrollbar-track': {
          WebkitBoxShadow: 'inset 0 0 2px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: lighten(primaryColor, 0.5),
          opacity: 0.2,
          outline: '0px solid slategrey'
        }
      }
    }
  }
});

export default theme;
